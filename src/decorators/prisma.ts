import { PrismaClient } from "@prisma/client";
import type { Elysia } from "elysia";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

prisma
	.$connect()
	.then(() => console.log("✅ Prisma is connected to the database"))
	.catch((error: unknown) =>
		console.error("❌ Error connecting to Prisma:", error),
	);

const prismaElysia = (app: Elysia) => {
	app.decorate("prisma", prisma);

	app.onStop(() => {
		prisma.$disconnect();
		console.log("🛑 Prisma connection closed");
	});

	return app;
};

export default prismaElysia;
