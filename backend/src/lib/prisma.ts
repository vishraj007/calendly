import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasourceUrl: process.env.DATABASE_URL,
  });

// Neon serverless: handle connection drops gracefully
prisma.$connect().catch((e: Error) => {
  console.warn("[Prisma] Initial connection failed, will retry on first query:", e.message);
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;