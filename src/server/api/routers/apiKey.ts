import { createHash, randomBytes } from "crypto";
import { z } from "zod";

import { router } from "./../trpc";
import { protectedProcedure } from "../trpc";

// Hash the API key to check against when veriying it. so we don't have to store the key in plain text.
export const hashAPIKey = (apiKey: string): string =>
  createHash("sha256").update(apiKey).digest("hex");

// Generate a random API key. Prisma already makes sure it's unique. So no need to add salts like with passwords.
export const generateUniqueAPIKey = (
  apiKey = randomBytes(16).toString("hex")
) => [hashAPIKey(apiKey), apiKey];

export const apiKeysRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.apiKey.findMany({
      where: {
        ownerId: ctx.user.id,
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        expiresAt: z.date().optional().nullable(),
        neverExpires: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [hashedApiKey, apiKey] = generateUniqueAPIKey();
      // Here we snap never expires before deleting it so it's not passed to prisma create call.
      const neverExpires = input.neverExpires;
      delete input.neverExpires;
      const createdApiKey = await ctx.prisma.apiKey.create({
        data: {
          ownerId: ctx.user.id,
          ...input,
          // And here we pass a null to expiresAt if never expires is true. otherwise just pass expiresAt from input
          expiresAt: neverExpires ? null : input.expiresAt,
          hashedKey: hashedApiKey as string,
        },
      });
      await ctx.prisma.user.update({
        where: {
          id: ctx.user.id,
        },
        data: {
          apiKey: {
            connect: {
              id: createdApiKey.id,
            },
          },
        },
      });
      const prefixedApiKey = `${process.env.API_KEY_PREFIX ?? "kk_"}${apiKey}`;
      return prefixedApiKey;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        eventTypeId: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      //delete it from the user
      await ctx.prisma.user.update({
        where: {
          id: ctx.user.id,
        },
        data: {
          apiKey: {},
        },
      });

      //delete the key from the db
      await ctx.prisma.apiKey.delete({
        where: {
          id,
        },
      });

      return {
        id,
      };
    }),
});
