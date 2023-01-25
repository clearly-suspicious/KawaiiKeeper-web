import { z } from "zod";

import { publicProcedure, router } from "./../trpc";

export const openaiRouter = router({
  getPersonalityResponse: publicProcedure
    .input(
      z.object({
        prompt: z.string(),
        personality: z.string(),
      })
    )
    .output(z.string())
    .query(async ({ ctx, input }) => {
      console.log("here buddy: ", input, ctx);
      return "Fake response";
    }),
});
