import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { User as PrismaUser } from "@prisma/client";
import NextAuth, { type NextAuthOptions, DefaultSession } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.discordId = user.discordId;
      }
      return session;
    },
    jwt({ token, user, account, profile, isNewUser }) {
      console.log(token, user, account, profile, isNewUser, " In jwt");
      return token;
    },
    redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
      profile(profile) {
        if (profile.avatar === null) {
          const defaultAvatarNumber = parseInt(profile.discriminator) % 5;
          profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
        } else {
          const format = profile.avatar.startsWith("a_") ? "gif" : "png";
          profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
        }

        return {
          id: profile.id,
          discordId: profile.id,
          name: profile.username,
          email: profile.email,
          image: profile.image_url,
          verified: profile.verified,
        };
      },
    }),
  ],
  events: {
    createUser: async (message) => {
      const existingUser = await prisma.internalUser.findUnique({
        where: {
          discordId: message.user.discordId,
        },
      });

      if (!existingUser)
        await prisma.internalUser.create({
          data: {
            discordId: message.user.discordId,
            name: message.user.name,
            collections: {
              create: {
                name: "All Saved",
              },
            },
          },
        });
    },
  },
};

export default NextAuth(authOptions);

declare module "next-auth" {
  interface User extends Partial<PrismaUser> {
    discordId: string;
  }
  interface Session extends DefaultSession {
    user?: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      discordId: string;
    };
  }
}
