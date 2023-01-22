import { Photo } from "@prisma/client";
import { z } from "zod";

import { protectedProcedure, router } from "./../trpc";

export const interactionTypeEnum = z.enum(["LIKE", "UNLIKE"]);

export const photosRouter = router({
  getMostLikedPhotos: protectedProcedure
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
      console.log(ctx.user.id);
      const photos = await ctx.prisma.photo.findMany({
        take,
        skip,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: {
          likes: "desc",
        },
        include: {
          interactions: { where: { type: "LIKE", userId: ctx.user.id } },
        },
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
    .meta({ openapi: { method: "GET", path: "/photo" } })
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
        where: {
          creatorId: ctx.user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          interactions: { where: { type: "LIKE", userId: ctx.user.id } },
        },
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
        url: z.string(),
        interaction: interactionTypeEnum,
      })
    )
    .output(z.custom<Photo>().nullable())
    .mutation(async ({ ctx, input }) => {
      console.log(input);
      const url = decodeURIComponent(input.url);
      const interactionType = input.interaction.toUpperCase();

      const photo = await ctx.prisma.photo.findFirst({
        where: {
          url,
        },
      });

      if (!photo) return null;

      if (interactionType === "UNLIKE") {
        const deletedLikes = await ctx.prisma.interaction.deleteMany({
          where: {
            photoId: photo.id,
            userId: ctx.user.id,
            type: "LIKE",
          },
        });
        return await ctx.prisma.photo.update({
          where: {
            url,
          },
          data: {
            likes: { decrement: deletedLikes.count },
          },
        });
      } else if (interactionType === "LIKE") {
        return await ctx.prisma.photo.update({
          where: {
            url,
          },
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
