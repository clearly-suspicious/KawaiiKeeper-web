import { protectedProcedure, router } from "./../trpc";

export const photosRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.photo.findMany({
      where: {
        creatorId: ctx.user.id,
      },
      orderBy: { createdAt: "desc" },
    });
  }),
  hello: protectedProcedure.query(async ({ ctx }) => {
    return "hello";
  }),
});
