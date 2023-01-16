import { Photo } from "@prisma/client";
import { z } from "zod";

import { protectedProcedure, router } from "./../trpc";

export const interactionTypeEnum = z.enum(["LIKE", "UNLIKE"]);

export const photosRouter = router({
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
        console.log(deletedLikes);
        return photo;
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
