import { z } from "zod";

import { publicProcedure, router } from "./../trpc";

export const paymentsRouter = router({
  aggregateDonations: publicProcedure
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
