import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  try {
    // Log the DATABASE_URL to verify it's available
    console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
    
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL is not defined in environment variables");
      // Provide a fallback for development
      process.env.DATABASE_URL = "mysql://root:HypeBeast420@127.0.0.1:3306/learnany";
      console.log("Using fallback DATABASE_URL");
    }
    
    return new PrismaClient({
      log: ['query', 'error', 'warn'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  } catch (error) {
    console.error("Failed to initialize Prisma client:", error);
    throw error;
  }
};

export const prisma = global.prisma || prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
} 