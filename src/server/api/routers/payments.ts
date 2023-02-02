import Stripe from "stripe";
import { z } from "zod";

import { protectedProcedure, publicProcedure, router } from "./../trpc";
import { TOKENS_PER_DOLLAR } from "../../constants";
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

  createPayment: publicProcedure
    .input(z.custom<Stripe.Charge & { userId?: string }>())
    .mutation(async ({ input, ctx }) => {
      const userId = input.userId;
      delete input.userId;
      const charge = input;
      const payment = await ctx.prisma.payments.create({
        data: {
          name: charge.billing_details.name as string,
          emailId: charge.billing_details.email as string,
          amount: (charge.amount as number) / 100,
        },
      });

      const user = await ctx.prisma.user.findFirst({
        where: {
          OR: [{ email: payment.emailId }, { id: userId }],
        },
      });

      if (user) {
        await ctx.prisma.internalUser.update({
          where: {
            id: user.id,
          },
          data: {
            tokens: {
              increment: payment.amount * TOKENS_PER_DOLLAR,
            },
          },
        });
      }
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
