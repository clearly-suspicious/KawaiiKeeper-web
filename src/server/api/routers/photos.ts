import { z } from "zod";

import { protectedProcedure, publicProcedure, router } from "./../trpc";

export const photosRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.photo.findMany({
      where: {
        creatorId: ctx.user.id,
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  addPhoto: protectedProcedure
    .meta({ openapi: { method: "POST", path: "/photo" } })
    .input(
      z.object({
        link: z.string(),
        prompt: z.string(),
        nsfw: z.boolean(),
      })
    )
    .output(z.void())
    .mutation(async ({ ctx, input }) => {
      console.log("adding image");
      const createdPhoto = await ctx.prisma.photo.create({
        data: {
          ...input,
          link: "https://picsum.photos/200/300",
          prompt: "star courtesan ✨is a clown",
          creatorId: ctx.user.id,
        },
      });

      const userAndPosts = await ctx.prisma.user.update({
        where: {
          id: ctx.user.id,
        },
        data: {
          tokens: 0,
          photos: {
            connect: {
              id: createdPhoto.id,
            },
          },
        },
      });

      console.log("created: ", userAndPosts, createdPhoto);
    }),

  getAllPhotos: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.photo.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  getPhotosByUser: protectedProcedure.query(async ({ ctx }) => {
    const photos = await ctx.prisma.photo.findMany({
      where: {
        creatorId: ctx.user.id,
      },
    });
    console.log(photos);
    return photos;
  }),

  deletePhoto: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      console.log(input.id);
      const deletedPhoto = await ctx.prisma.photo.delete({
        where: {
          id: input.id,
        },
      });

      console.log(deletedPhoto);
      return deletedPhoto;
    }),
});
