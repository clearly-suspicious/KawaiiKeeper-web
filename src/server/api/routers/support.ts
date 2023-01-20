import { SupportRequests } from "@prisma/client";
import { z } from "zod";

import { protectedProcedure, router } from "./../trpc";

export const supportRouter = router({
  createSupportTicket: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        emailId: z.string(),
        concern: z.string(),
      })
    )
    .output(z.custom<SupportRequests>())
    .mutation(async ({ ctx, input }) => {
      const bleh = await ctx.prisma.supportRequests.create({
        data: {
          ...input,
        },
      });

      console.log("bleh: ", bleh);
      return bleh;
    }),
});
