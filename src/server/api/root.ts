import { apiKeysRouter } from "./routers/apiKey";
import { collectionsRouter } from "./routers/collections";
import { photosRouter } from "./routers/photos";
import { mergeRouters, router } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = mergeRouters(
  router({ apiKeys: apiKeysRouter, photos: photosRouter, collections: collectionsRouter })
);

// export type definition of API
export type AppRouter = typeof appRouter;
