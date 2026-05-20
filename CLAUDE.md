# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server at localhost:3000
npm run build        # Production build (also runs next-sitemap postbuild)
npm run lint         # ESLint via Next.js lint

# E2E tests (Playwright — requires dev server running or will auto-start it)
npm run test:e2e             # Run all tests (Chromium + Firefox)
npm run test:e2e:ui          # Interactive Playwright UI
npm run test:e2e:debug       # Debug mode
npm run test:e2e:login       # Auth login tests only
npm run test:e2e:admin       # Admin dashboard tests only
npm run test:e2e:report      # Open last HTML report
```

Run a single test file: `npx playwright test e2e/auth.login.spec.ts`

## Architecture

**ScholarsPoint** is a Next.js 15 App Router application for discovering international academic opportunities. Backend is entirely Supabase (Postgres + Auth).

### Data Model

All opportunity types (scholarships, internships, fellowships, competitions, conferences, workshops, exchange programs, jobs, online courses) live in a **single unified `opportunities` table**. Type is discriminated by the `type` column; type-specific fields go in a polymorphic JSONB `details` column. Canonical types and their `details` interfaces are in `src/types/database.ts`.

Separate tables exist for `posts` (blog), `visa_guides`, and `banners`.

### Supabase Client Pattern

Two clients must be used in the right context:

- `src/lib/supabaseClient.ts` — browser singleton (`createClient`), use in Client Components and `src/lib/fetchOpportunities.ts`
- `src/lib/supabaseServer.ts` — async factory (`createSupabaseServerClient()`), use in Server Components, API routes, and middleware. Also exports `getServerSession()`, `getServerUserProfile()`, and `isServerAdmin()`.

### Auth & Roles

- `src/lib/useAuth.ts` — client-side hook wrapping Supabase auth with a 5-minute profile cache. Returns `{ user, session, isLoading, isAdmin, profile, signOut, signInWithGoogle, signInWithEmail, signUpWithEmail }`.
- `src/middleware.ts` — protects `/admin/*` (requires `profiles.role === "admin"`) and redirects logged-in users away from `/login` and `/signup`.
- Role is stored in the `profiles` table (columns: `id`, `email`, `full_name`, `role`).

### Page Structure

- **Public opportunity pages**: `src/app/<type>/page.tsx` (list) and `src/app/<type>/[id]/page.tsx` (detail). All detail pages render `<OpportunityDetailView>` from `src/components/OpportunityDetailView.tsx`.
- **Admin panel**: `src/app/admin/` with sub-routes for `opportunities/`, `blogs/`, `visa_guides/`, and `banners/`. Each has `new/` and `[id]/` sub-routes for create/edit.
- `src/components/ClientLayoutWrapper.tsx` conditionally hides the Navbar and Footer on `/admin` paths.

### Key Utilities

- `src/lib/opportunityHelpers.ts` — `isExpired()`, `getDaysRemaining()`, `getDeadlineStatus()`, `formatDeadline()`, `sortByDeadline()` for all deadline display logic.
- `src/lib/fetchOpportunities.ts` — homepage data fetch (featured + latest, deduped).
- UI components in `src/components/ui/` are shadcn/ui primitives (Radix-based).

### Markdown

Rich text fields (`description`, `content`, `scholars_point_tips`, `who_should_apply` on opportunities; `content` on blogs and visa guides) are stored as Markdown and rendered with `react-markdown` + `remark-gfm`.

### Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### Other Integrations

- **Google AdSense** (`ca-pub-6531423360862071`) loaded in root layout via `next/script`
- **Vercel Analytics** loaded in root layout
- **next-sitemap** generates sitemap on every production build (`next-sitemap.config.js`)
- **Sonner** toast at `top-center` in root layout — use `toast.success()` / `toast.error()` from `sonner`
