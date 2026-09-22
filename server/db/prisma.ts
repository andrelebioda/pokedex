import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

const databaseUrl = process.env.ENVIRONMENT === "development" ? process.env.DATABASE_URL : process.env.DATABASE_URL_PROD;

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ datasources: { db: { url: databaseUrl } } });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
