// import { PrismaClient } from "@/app/generated/prisma/client";
// import { PrismaPg } from "@prisma/adapter-pg";
// const adapter = new PrismaPg({
//   connectionString: process.env.DATABASE_URL!,
// });
// export const prisma = new PrismaClient({ adapter });

// import { PrismaClient } from "@/app/generated/prisma/client";
// import { PrismaPg } from "@prisma/adapter-pg";
//
// const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
//
// const adapter = new PrismaPg({
//   connectionString: process.env.DATABASE_URL!,
// });
//
// export const prisma =
//   globalForPrisma.prisma ?? new PrismaClient({ adapter });
//
// if (process.env.NODE_ENV !== "production") {
//   globalForPrisma.prisma = prisma;

// import { PrismaClient } from "@/app/generated/prisma/client";
// import { PrismaPg } from "@prisma/adapter-pg";
// import { Pool } from "pg";
//
// const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
//
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL!,
// });
//
// const adapter = new PrismaPg(pool);
//
// export const prisma =
//   globalForPrisma.prisma ?? new PrismaClient({ adapter });
//
// if (process.env.NODE_ENV !== "production") {
//   globalForPrisma.prisma = prisma;


import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
} 
