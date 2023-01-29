import { z } from "zod";

import { protectedProcedure, publicProcedure, router } from "./../trpc";
import { checkEligibility } from "../../../utils/transactions";

const TransactionType = z.enum(["TXT2IMG", "IMG2IMG", "CHATBOT"]);

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

  checkEligibility: protectedProcedure
    .meta({
      openapi: { method: "GET", path: "/eligibility/{transactionType}" },
    })
    .input(
      z.object({
        transactionType: TransactionType,
      })
    )
    .output(
      z.object({
        transactionType: TransactionType,
        eligible: z.boolean(),
        tokens: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      const userInfo = await ctx.prisma.internalUser.findUniqueOrThrow({
        where: {
          id: ctx.user.id,
        },
      });

      const eligible = checkEligibility(input.transactionType, userInfo.tokens);
      return {
        transactionType: input.transactionType,
        eligible,
        tokens: userInfo.tokens,
      };
    }),
});
