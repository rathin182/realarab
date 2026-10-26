"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";

function safeRedirect(url: unknown): string {
    return typeof url === "string" && url.startsWith("/") && !url.startsWith("//") ? url : "/admin";
}

export async function loginAction(_prev: string | undefined, formData: FormData) {
    const redirectTo = safeRedirect(formData.get("callbackUrl"));
    const parsed = loginSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) return parsed.error.issues[0].message;
    try {
        await signIn("credentials", { ...parsed.data, redirectTo });
    } catch (e) {
        if (e instanceof AuthError) return "Invalid email or password.";
        throw e;
    }
}

export async function logoutAction() {
    await signOut({ redirectTo: "/login" });
}