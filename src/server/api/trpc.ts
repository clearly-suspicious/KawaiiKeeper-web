/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1)
 * 2. You want to create a new middleware or type of procedure (see Part 3)
 *
 * tl;dr - this is where all the tRPC server stuff is created and plugged in.
 * The pieces you will need to use are documented accordingly near the end
 */
/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API
 *
 * These allow you to access things like the database, the session, etc, when
 * processing a request
 *
 */
import { InternalUser, User } from "@prisma/client";
import { initTRPC, Maybe, TRPCError } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import * as trpcNext from "@trpc/server/adapters/next";
import { GetServerSidePropsContext } from "next";
import { type Session } from "next-auth";
import superjson from "superjson";
import { OpenApiMeta } from "trpc-openapi";

import { hashAPIKey } from "./routers/apiKey";
import { getServerAuthSession } from "../auth";
import { prisma } from "../db";

type CreateContextOptionsBase =
  | trpcNext.CreateNextContextOptions
  | GetServerSidePropsContext;

type CreateContextOptions = CreateContextOptionsBase & {
  session: Session | null;
  user: InternalUser | null;
  authedUser: User | null;
};

async function getUserFromSession({
  session,
  req,
}: {
  session: Maybe<Session>;
  req: CreateContextOptions["req"];
}) {
  if (!session?.user?.id) {
    return null;
  }
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) {
    return null;
  }
  const { email } = user;
  if (!email) {
    return null;
  }

  return user;
}

/**
 * This is the actual context you'll use in your router. It will be used to
 * process every request that goes through your tRPC endpoint
 * @link https://trpc.io/docs/context
 */
export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;
  let user: InternalUser | null = null;
  let authedUser: User | null = null;
  const session = await getServerAuthSession({ req, res });
  const token = req.headers.authorization;

  if (token) {
    const hashedKey = hashAPIKey(
      token.substring(process.env.API_KEY_PREFIX?.length || 3)
    );

    const apiKey = await prisma.apiKey.findUnique({
      where: {
        hashedKey,
      },
    });

    //if its a valid apiKey, get the user from the discord-id in the header
    if (apiKey && req.headers["discord-id"]) {
      user = await prisma.internalUser.findUnique({
        where: {
          discordId: req.headers["discord-id"] as string,
        },
      });
      if (!user) {
        const createdUser = await prisma.internalUser.create({
          data: {
            discordId: req.headers["discord-id"] as string,
            name: decodeURIComponent(req.headers["discord-username"] as string),
            collections: {
              create: {
                name: "All Saved",
              },
            },
          },
        });
        user = createdUser;
        console.log("created user", createdUser);
      }
    }
  } else {
    // Get the session from the server using the unstable_getServerSession wrapper function

    authedUser = await getUserFromSession({ session, req });
    if (authedUser)
      user = await prisma.internalUser.findUnique({
        where: {
          discordId: authedUser?.discordId as string,
        },
      });
  }

  return {
    session,
    authedUser,
    user,
    prisma,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the trpc api is initialized, connecting the context and
 * transformer
 */

const t = initTRPC
  .context<Awaited<ReturnType<typeof createTRPCContext>>>()
  .meta<OpenApiMeta>()
  .create({
    transformer: superjson,
    errorFormatter({ shape }) {
      return shape;
    },
  });

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these
 * a lot in the /src/server/api/routers folder
 */

/**
 * This is how you create new routers and subrouters in your tRPC API
 * @see https://trpc.io/docs/router
 */
export const router = t.router;
export const mergeRouters = t.mergeRouters;

/**
 * Public (unauthed) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in
 */
export const publicProcedure = t.procedure;

/**
 * Reusable middleware that enforces users are logged in before running the
 * procedure
 */
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: ctx.session,
      user: ctx.user,
    },
  });
});

/**
 * Protected (authed) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use
 * this. It verifies the session is valid and guarantees ctx.session.user is not
 * null
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
