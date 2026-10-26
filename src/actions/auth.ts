"use server";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { createHmac, timingSafeEqual } from "crypto";
import { signIn, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { loginSchema, buyerRegisterSchema } from "@/lib/validations";
export async function loginAction(
  _prevState: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return parsed.error.issues[0].message;
  }

  const email = parsed.data.email.trim().toLowerCase();

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { role: true },
    });

    if (!user || (user.role !== "BUYER" && user.role !== "ADMIN")) {
      return "Invalid email or password.";
    }

    const redirectTo = user.role === "ADMIN" ? "/admin" : "/user/";

    await signIn("credentials", {
      email,
      password: parsed.data.password,
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return "Invalid email or password.";
    }

    throw error;
  }
}

export async function registerAction(
  _prevState: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  const parsed = buyerRegisterSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    countryCode: formData.get("countryCode"),
    phone: formData.get("phone"),
  });

  if (!parsed.success) {
    return parsed.error.issues[0].message;
  }

  const name = parsed.data.name.trim();
  const email = parsed.data.email.trim().toLowerCase();
  const password = parsed.data.password;
  const phone = `${parsed.data.countryCode}${parsed.data.phone.trim()}`;

  const secret = process.env.OTP_SECRET;

  if (!secret) {
    return "Email verification is temporarily unavailable.";
  }

  try {
    // Check that the email has a valid, unexpired verification proof.
    const verification = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        expires: { gt: new Date() },
      },
    });

    if (!verification) {
      return "Please verify your email before creating your account.";
    }

    const expectedToken = createHmac("sha256", secret)
      .update(`${email}:VERIFIED`)
      .digest();

    const storedToken = Buffer.from(verification.token, "hex");

    if (
      storedToken.length !== expectedToken.length ||
      !timingSafeEqual(storedToken, expectedToken)
    ) {
      return "Please verify your email before creating your account.";
    }

    // Prevent duplicate email registrations.
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return "That email is already registered.";
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Create the account and consume its verification proof together.
    await prisma.$transaction(async (tx) => {
      const currentVerification = await tx.verificationToken.findUnique({
        where: {
          identifier_token: {
            identifier: email,
            token: verification.token,
          },
        },
      });

      if (
        !currentVerification ||
        currentVerification.expires <= new Date()
      ) {
        throw new Error("EMAIL_VERIFICATION_EXPIRED");
      }

      const currentToken = Buffer.from(currentVerification.token, "hex");

      if (
        currentToken.length !== expectedToken.length ||
        !timingSafeEqual(currentToken, expectedToken)
      ) {
        throw new Error("EMAIL_VERIFICATION_INVALID");
      }

      await tx.user.create({
        data: {
          name,
          email,
          phone,
          passwordHash,
          role: "BUYER",
        },
      });

      await tx.verificationToken.deleteMany({
        where: { identifier: email },
      });
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.startsWith("EMAIL_VERIFICATION_")
    ) {
      return "Email verification expired or is invalid. Please verify your email again.";
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return "That email is already registered.";
    }

    console.error("Registration failed:", error);
    return "Unable to create your account. Please try again.";
  }

  // Sign in after the account has been created successfully.
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/user/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return "Account created successfully. Please log in.";
    }

    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
