import { generateOpenApiDocument, OpenApiRouter } from "trpc-openapi";

import { appRouter } from "./api/root";

// Generate OpenAPI schema document
export const openApiDocument = generateOpenApiDocument(
  appRouter as OpenApiRouter,
  {
    title: "Kawaii Keeper API",
    description: "OpenAPI compliant REST API built using tRPC with Next.js",
    version: "1.0.0",
    baseUrl: process.env.API_BASE_URL ?? "http://localhost:3000/api",
    // docsUrl: "https://github.com/jlalmes/trpc-openapi",
    // tags: ["auth", "users", "posts"],
  }
);
