import { Prisma, PrismaClient } from "@prisma/client";

import { env } from "../env/server.mjs";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prismaOptions: Prisma.PrismaClientOptions = { log: ["error"] };

if (env.NODE_ENV === "development")
  prismaOptions.log = ["query", "error", "warn"];

export const prisma = globalThis.prisma || new PrismaClient(prismaOptions);

if (env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
