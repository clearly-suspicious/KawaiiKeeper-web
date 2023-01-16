import { Photo } from "@prisma/client";
import { z } from "zod";

import { protectedProcedure, router } from "./../trpc";

export const interactionTypeEnum = z.enum(["LIKE"]);

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
    .input(z.object({ id: z.string(), type: interactionTypeEnum }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.photo.update({
        where: {
          id: input.id,
        },
        data: {
          interactions: {
            create: {
              type: input.type,
              userId: ctx.user.id,
            },
          },
        },
      });
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
