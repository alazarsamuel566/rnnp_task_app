import { PrismaClient } from "@/app/generated/prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Prisma 7+ requires either an adapter (e.g. @prisma/adapter-pg) or an accelerateUrl.
// Try to dynamically load a Postgres adapter if available, otherwise fall back
// to `PRISMA_ACCELERATE_URL`. If neither is present, throw an explicit error
// with instructions to install the adapter.
let prismaConstructorArgs: any = {};

try {
	// top-level await is supported in this environment; dynamically import adapter
	// @ts-ignore - adapter may not be installed in every environment
	const adapterMod: any = await import("@prisma/adapter-pg");
	// adapter packages may export under different names — find the exported factory/class
	const AdapterClass = adapterMod.PrismaPg ?? adapterMod.PrismaPgAdapterFactory ?? adapterMod.default?.PrismaPg ?? adapterMod.default ?? adapterMod;
	// If it's a class or factory constructor, instantiate it to produce a driver adapter factory.
	try {
		if (typeof AdapterClass === "function") {
			// If a DATABASE_URL is provided, pass it as the pool/config so the adapter's
			// internal `pg.Pool` will be created with the correct connection string.
			if (process.env.DATABASE_URL) {
				prismaConstructorArgs.adapter = new AdapterClass({ connectionString: process.env.DATABASE_URL });
			} else {
				// No connection string provided — adapter will pick up PG_* env vars or require config later.
				prismaConstructorArgs.adapter = new AdapterClass();
			}
		} else {
			prismaConstructorArgs.adapter = AdapterClass;
		}
	} catch (instErr) {
		// If instantiation fails, fall back to using the value directly
		prismaConstructorArgs.adapter = AdapterClass;
	}
} catch (e) {
	if (process.env.PRISMA_ACCELERATE_URL) {
		prismaConstructorArgs.accelerateUrl = process.env.PRISMA_ACCELERATE_URL;
	} else {
		throw new Error(
			'Prisma Client initialization failed: missing driver adapter.\n' +
				'Install a matching Prisma adapter (for Postgres run: `npm install @prisma/adapter-pg`)\n' +
				'or set `PRISMA_ACCELERATE_URL` to use Prisma Accelerate.'
		);
	}
}

export const db = globalForPrisma.prisma || new PrismaClient(prismaConstructorArgs);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;