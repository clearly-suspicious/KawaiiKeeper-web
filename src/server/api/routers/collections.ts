import { z } from "zod";

import { protectedProcedure, router } from "./../trpc";

export const collectionsRouter = router({
  getCollectionsByUser: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.collection.findMany({
      where: {
        creatorId: ctx.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  insertPhotoToCollection: protectedProcedure
    .input(
      z.object({
        collectionId: z.string(),
        photoId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.photo.update({
        where: {
          id: input.photoId,
        },
        data: {
          collection: {
            connect: {
              id: input.collectionId,
            },
          },
        },
      });
    }),

  insertNewCollection: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        tags: z.string().array().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.collection.create({
        data: {
          ...input,
          user: {
            connect: {
              id: ctx.user.id,
            },
          },
        },
      });
    }),
});
