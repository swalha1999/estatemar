# Agent Guidelines for Estatemar

## Commands
- **Build**: `pnpm build` (monorepo-wide), `turbo build` for all workspaces, `turbo -F <workspace> build` for single workspace
- **Lint**: `pnpm lint` (uses Biome), `pnpm lint:fix` for auto-fix, `turbo -F <workspace> lint` for single workspace
- **Type Check**: `pnpm check-types` (runs `tsc` for each workspace), `turbo -F <workspace> check-types` for single workspace
- **Test**: `pnpm test` (Jest in packages), `turbo -F <workspace> test` for single workspace (e.g., `turbo -F cloudflare-r2 test`)
- **Dev**: `pnpm dev` (builds then starts dev servers), `pnpm dev:web`, `pnpm dev:server`
- **Database**: `pnpm db:push`, `pnpm db:studio`, `pnpm db:migrate`, `pnpm db:start` (Docker), `pnpm db:stop`

## Code Style (Biome Configuration)
- **Formatting**: Tab indentation, double quotes, self-closing elements, organize imports automatically
- **Imports**: ALWAYS use absolute imports from `@/`, include full file paths (e.g., `import { foo } from "@/components/ui/button"`)
- **Types**: Use `type` for type-only imports, avoid inferrable types, NO `any` types (write typesafe code)
- **Naming**: Use camelCase for variables/functions, PascalCase for components/types, sorted Tailwind classes
- **Error Handling**: Return structured objects with `success: boolean` and `error` fields
- **CSS**: NO deprecated properties like `display: box`

## API Integration Rules
- **oRPC + TanStack Query**: ALWAYS use oRPC with TanStack Query for all API calls in the UI
- **No Direct Fetch**: NEVER use fetch() directly or any other HTTP client in UI components
- **Query Usage**: Use `useQuery(orpc.organization.getUserOrganizations.queryOptions());` for GET requests
- **Mutation Usage**: Use `useMutation(orpc.organization.getUserOrganizations.queryOptions());` for POST/PUT/DELETE requests
- **Example**: `const {
		data: userOrgs = [],
		isLoading: orgsLoading,
		refetch: refetchOrganizations,
	} = useQuery(orpc.organization.getUserOrganizations.queryOptions());`
- **Headers**: manage dynamic headers (like org context)

## Next.js Rules (from .cursorrules)
- **Server Actions**: ALWAYS use server actions, NOT API routes
- **Data Access**: Use data access layer to interact with database
- **Params**: Make page params a promise (Next.js 15 requirement)
- **Imports**: ALWAYS use absolute paths in imports

## Architecture
- **Monorepo**: Turborepo with pnpm workspaces (apps/server, apps/web, packages/*), use `workspace:*` protocol for internal deps
- **Server**: Hono + oRPC, Better Auth, Cloudflare R2 storage, PostgreSQL with Drizzle ORM
- **Web**: Next.js 15 + React 19, Tailwind CSS, shadcn/ui components, oRPC with TanStack Query
- **Database**: PostgreSQL with Drizzle ORM, Docker Compose for development
- **Authentication**: Better Auth with session-based auth

## Chcek the cursor rules before you do any thing @.cursor/rules