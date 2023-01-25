import { Collection } from "@prisma/client";
import { z } from "zod";

import { protectedProcedure, router } from "./../trpc";

export const collectionsRouter = router({
  getCollectionsByUser: protectedProcedure
    .meta({ openapi: { method: "GET", path: "/collection/user/{userId}" } })
    .input(
      z.object({
        userId: z.string().optional(),
        limit: z.number().min(1).max(100).optional(),
        cursor: z.string().optional(),
      })
    )
    .output(
      z.object({
        data: z.custom<Collection>().array(),
        pagination: z.object({
          nextCursor: z.string().nullish(),
          prevCursor: z.string().nullish(),
          hasMore: z.boolean(),
          count: z.number(),
          totalCount: z.number(),
        }),
      })
    )
    .query(async ({ ctx, input }) => {
      const take = input.limit ?? 25;
      const skip = input.cursor ? 1 : 0; //skip cursor if it exists

      const userId = input.userId ?? ctx.user.id;

      const userCollections = ctx.prisma.collection.findMany({
        take,
        skip,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        where: {
          creatorId: userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          photos: true,
        },
      });

      const userCollectionCount = ctx.prisma.collection.count({
        where: {
          creatorId: userId,
        },
      });

      const [collections, count] = await ctx.prisma.$transaction([
        userCollections,
        userCollectionCount,
      ]);
      const lastCollection = collections[collections.length - 1];
      const nextCursor = lastCollection ? lastCollection.id : undefined;
      return {
        data: collections,
        pagination: {
          nextCursor,
          prevCursor: input.cursor,
          hasMore: nextCursor ? true : false,
          count: collections.length,
          totalCount: count,
        },
      };
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
          collections: {
            connect: {
              id: input.collectionId,
            },
          },
          interactions: {
            create: {
              type: "SAVE",
              userId: ctx.user.id,
            },
          },
        },
      });
    }),

  removePhotoFromCollection: protectedProcedure
    .input(
      z.object({
        collectionId: z.string(),
        photoId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.photo.update({
        where: {
          id: input.photoId,
        },
        data: {
          interactions: {
            deleteMany: {
              type: "SAVE",
              userId: ctx.user.id,
            },
          },
        },
      });

      return await ctx.prisma.collection.update({
        where: {
          id: input.collectionId,
        },
        data: {
          photos: {
            disconnect: {
              id: input.photoId,
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
