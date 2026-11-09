---
description: "Use when implementing or changing data mutations, Server Actions, or database write helpers. Covers typed inputs, Zod validation, authentication, and the /data boundary."
applyTo: "app/**/*.ts, app/**/*.tsx, components/**/*.ts, components/**/*.tsx, data/**/*.ts, db/**/*.ts"
---
# Data Mutation Guidelines

- Perform every application data mutation through a Next.js Server Action. Invoke Server Actions from Client Components; do not mutate data directly from client code, Server Components, route handlers, or other paths.
- Put Server Actions in a file named `actions.ts`, colocated with the Client Component that calls them. Mark the module with `"use server"` and export only async Server Action functions.
- Give every Server Action argument an explicit TypeScript type. Do not use the `FormData` type; define typed input objects for action arguments instead.
- Treat action arguments as untrusted. Validate every input with a Zod schema in the Server Action before using it or passing it to a database helper.
- At the start of every Server Action, verify that a user is logged in using the project's authentication provider. Reject unauthenticated calls before any database operation. Derive the user ID from the authenticated session; never trust a client-supplied user ID.
- Every Server Action must return a typed result object: use a `success` property for successful outcomes and an `error` property for failures. Do not throw errors from Server Actions; convert validation, authentication, database, and unexpected failures into returned error results, using a safe message for unexpected failures.
- Keep Drizzle queries out of Server Actions. Put all database reads and writes in helper functions under `/data`, and call those helpers from Server Actions only after authentication and input validation.
- Pass the authenticated user ID to helpers and scope user-owned mutations to that user. Helpers must not rely on client-provided ownership or authorization data.