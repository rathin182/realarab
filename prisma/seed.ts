import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error("Missing ADMIN_EMAIL or ADMIN_PASSWORD.");

  await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN" },
    create: {
      email,
      name: "Admin",
      role: "ADMIN",
      passwordHash: await bcrypt.hash(password, 12),
      emailVerified: new Date(),
    },
  });
  console.log(`Admin ready: ${email}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());