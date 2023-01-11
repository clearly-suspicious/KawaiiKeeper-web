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
});
