import { Photo } from "@prisma/client";
import { z } from "zod";

import { protectedProcedure, router } from "./../trpc";

export const photosRouter = router({
  getAllPhotos: protectedProcedure
    .meta({ openapi: { method: "GET", path: "/photo/get-all" } })
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
    .meta({ openapi: { method: "GET", path: "/photo/get-by-id" } })
    .input(z.void())
    .output(z.custom<Photo>().array())
    .query(async ({ ctx }) => {
      return await ctx.prisma.photo.findMany({
        where: {
          creatorId: ctx.user.id,
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  likePhoto: protectedProcedure
    .input(z.object({ photoId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.photo.update({
        where: {
          id: input.photoId,
        },
        data: {
          likes: {
            increment: 1,
          },
        },
      });
    }),

  addPhoto: protectedProcedure
    .meta({ openapi: { method: "POST", path: "/photo/insert" } })
    .input(
      z.object({
        link: z.string(),
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
