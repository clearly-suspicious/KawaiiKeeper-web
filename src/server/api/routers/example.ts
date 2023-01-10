import { PrismaClient } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const prisma = new PrismaClient();

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      console.log("bleh: ", input);
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  create: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input }) => {
      console.log("sendin deeznuts data");
      console.log("here: ", input);
      await prisma.test.create({
        data: { name: input.name },
      });
    }),

  delete: publicProcedure.mutation(async () => {
    console.log("deleting stuff");
    await prisma.test.deleteMany({});
  }),

  read: publicProcedure.query(async () => {
    const allUsers = await prisma.test.findMany();
    console.log("all: ", allUsers);
    return allUsers;
  }),
});
