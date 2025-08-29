# Agent Guidelines for Estatemar

## Commands
- **Build**: `pnpm build` (monorepo-wide), `turbo build` for all workspaces
- **Lint**: `pnpm lint` (uses Biome), `pnpm lint:fix` for auto-fix
- **Type Check**: `pnpm check-types` (runs `tsc` for each workspace)
- **Test**: `pnpm test` (no test framework currently configured)
- **Dev**: `pnpm dev` (builds then starts dev servers), `pnpm dev:web`, `pnpm dev:server`
- **Database**: `pnpm db:push`, `pnpm db:studio`, `pnpm db:migrate`

## Code Style (Biome Configuration)
- **Formatting**: Tab indentation, double quotes, self-closing elements
- **Imports**: Use absolute imports from `@/`, organize imports automatically
- **Types**: Use `type` for type-only imports, avoid inferrable types
- **Naming**: Use camelCase for variables/functions, PascalCase for components/types
- **Error Handling**: Return structured objects with `success: boolean` and `error` fields
- **Database**: Use Drizzle ORM with PostgreSQL, follow existing schema patterns

## Architecture
- **Monorepo**: Turborepo with pnpm workspaces (apps/server, apps/web, packages/*)
- **Server**: Hono + oRPC, Better Auth, Cloudflare R2 storage
- **Web**: Next.js 15 + React 19, Tailwind CSS, shadcn/ui components, oRPC with tanstack query
- **Database**: PostgreSQL with Drizzle ORM, Docker Compose for development
- **Authentication**: Better Auth with session-based auth