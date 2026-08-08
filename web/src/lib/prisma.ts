import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// max düşük tutuluyor çünkü Supabase'in transaction-mode pooler'ı (pgbouncer)
// zaten kendi bağlantı havuzunu yönetiyor; üstüne büyük bir pool açmak
// "Unable to start a transaction" (P2028) hatalarına yol açabiliyor.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL, max: 5 });

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
