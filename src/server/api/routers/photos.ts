import { Photo } from "@prisma/client";
import { z } from "zod";

import { protectedProcedure, publicProcedure, router } from "./../trpc";

export const interactionTypeEnum = z.enum(["LIKE", "UNLIKE"]);

export const photosRouter = router({
  getMostLikedPhotos: publicProcedure
    .meta({ openapi: { method: "GET", path: "/photo/most-liked" } })
    .input(
      z.object({
        limit: z.number().min(1).max(100).optional(),
        cursor: z.string().optional(),
      })
    )
    .output(
      z.object({
        data: z.custom<Photo>().array(),
        pagination: z.object({
          nextCursor: z.string().nullish(),
          prevCursor: z.string().nullish(),
          hasMore: z.boolean(),
          count: z.number(),
        }),
      })
    )
    .query(async ({ ctx, input }) => {
      const take = input.limit ?? 25;
      const skip = input.cursor ? 1 : 0; //skip cursor if it exists

      const photos = await ctx.prisma.photo.findMany({
        take,
        skip,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: {
          likes: "desc",
        },
        // if logged in get the  user's interactions with the photos so we can display their like status
        include: ctx.user
          ? {
              interactions: { where: { userId: ctx.user.id } },
            }
          : undefined,
      });
      const lastPhoto = photos[photos.length - 1];
      const nextCursor = lastPhoto ? lastPhoto.id : undefined;
      return {
        data: photos,
        pagination: {
          nextCursor,
          prevCursor: input.cursor,
          hasMore: nextCursor ? true : false,
          count: photos.length,
        },
      };
    }),
  //TODO add pagination to below procedures
  getAllPhotos: protectedProcedure
    .meta({ openapi: { method: "GET", path: "/photo" } })
    .input(z.void())
    .output(z.custom<Photo>().array())
    .query(async ({ ctx }) => {
      return await ctx.prisma.photo.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  getPhotosByUser: protectedProcedure
    .meta({ openapi: { method: "GET", path: "/photo/user/{userId}" } })
    .input(
      z.object({
        userId: z.string().optional(),
        limit: z.number().min(1).max(100).optional(),
        cursor: z.string().optional(),
      })
    )
    .output(
      z.object({
        data: z.custom<Photo>().array(),
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

      const userPhotos = ctx.prisma.photo.findMany({
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
          interactions: { where: { userId } },
        },
      });

      const userPhotosCount = ctx.prisma.photo.count({
        where: {
          creatorId: userId,
        },
      });

      const [photos, count] = await ctx.prisma.$transaction([
        userPhotos,
        userPhotosCount,
      ]);
      const lastPhoto = photos[photos.length - 1];
      const nextCursor = lastPhoto ? lastPhoto.id : undefined;
      return {
        data: photos,
        pagination: {
          nextCursor,
          prevCursor: input.cursor,
          hasMore: nextCursor ? true : false,
          count: photos.length,
          totalCount: count,
        },
      };
    }),

  getPhotoById: protectedProcedure
    .meta({ openapi: { method: "GET", path: "/photo/{id}" } })
    .input(z.object({ id: z.string() }))
    .output(z.custom<Photo>().nullable())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.photo.findFirst({
        where: {
          id: input.id,
        },
      });
    }),

  likePhoto: protectedProcedure
    .meta({ openapi: { method: "PATCH", path: "/photo/{interaction}" } })
    .input(
      z.object({
        url: z.string().optional(),
        id: z.string().optional(),
        interaction: interactionTypeEnum,
      })
    )
    .output(z.custom<Photo>().nullable())
    .mutation(async ({ ctx, input }) => {
      if (!input.url && !input.id) return null;
      let photoId = input.id ?? null;
      const interactionType = input.interaction.toUpperCase();
      if (input.url) {
        const url = decodeURIComponent(input.url);

        const photo = await ctx.prisma.photo.findFirst({
          where: {
            url,
          },
        });

        if (photo) photoId = photo.id;
      }
      if (!photoId) return null;

      if (interactionType === "UNLIKE") {
        const deletedLikes = await ctx.prisma.interaction.deleteMany({
          where: {
            photoId,
            userId: ctx.user.id,
            type: "LIKE",
          },
        });
        return await ctx.prisma.photo.update({
          where: input.url
            ? { url: decodeURIComponent(input.url) }
            : { id: photoId },

          data: {
            likes: { decrement: deletedLikes.count },
          },
        });
      } else if (interactionType === "LIKE") {
        return await ctx.prisma.photo.update({
          where: input.url
            ? { url: decodeURIComponent(input.url) }
            : { id: photoId },
          data: {
            interactions: {
              create: {
                type: interactionType,
                userId: ctx.user.id,
              },
            },
            likes: { increment: 1 },
          },
        });
      } else return null;
    }),

  addPhoto: protectedProcedure
    .meta({ openapi: { method: "POST", path: "/photo" } })
    .input(
      z.object({
        url: z.string(),
        prompt: z.string(),
        nsfw: z.boolean(),
        tags: z.string().array().optional(),
      })
    )
    .output(z.custom<Photo>())
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.photo.create({
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

  deletePhoto: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.photo.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
