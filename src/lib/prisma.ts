import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
        throw new Error("DATABASE_URL must be set to use Prisma.");
    }

    return new PrismaClient({
        adapter: new PrismaPg({ connectionString: databaseUrl }),
    });
}

// Delay client creation until a database operation is actually used. Next.js
// imports route modules while collecting build data, when no DB connection is
// needed and deployment environment variables may not be available.
export const prisma = new Proxy({} as PrismaClient, {
    get(_target, property) {
        const client = globalForPrisma.prisma ?? createPrismaClient();

        if (process.env.NODE_ENV !== "production") {
            globalForPrisma.prisma = client;
        }

        const value = Reflect.get(client, property, client);
        return typeof value === "function" ? value.bind(client) : value;
    },
});

