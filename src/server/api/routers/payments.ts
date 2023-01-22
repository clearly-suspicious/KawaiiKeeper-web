import { z } from "zod";

import { protectedProcedure, router } from "./../trpc";

export const paymentsRouter = router({
  aggregateDonations: protectedProcedure
    .output(z.number())
    .query(async ({ ctx }) => {
      const aggregations = await ctx.prisma.payments.aggregate({
        _sum: {
          amount: true,
        },
      });
      return aggregations._sum.amount as number;
    }),
});
