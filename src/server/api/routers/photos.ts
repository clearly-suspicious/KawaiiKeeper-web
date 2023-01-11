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

  addPhoto: protectedProcedure.mutation(async ({ ctx }) => {
    console.log("adding image");
    const userAndPosts = await ctx.prisma.user.update({
      where: {
        id: ctx.user.id,
      },
      data: {
        tokens: 0,
        photos: {
          create: [
            { link: "https://picsum.photos/200/300", prompt: "deeznuts" },
            {
              link: "https://picsum.photos/200/300",
              prompt: "star courtesan ✨is a clown",
            },
          ],
        },
      },
    });

    console.log("created: ", userAndPosts);
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
