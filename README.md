# Defined Academy

Greenfield frontend for **Defined Academy** — a multi-tenant professional development workspace. The first tenant is the **RE-Quest Professional Growth Initiative** (`re-quest-academy`).

This is **not** a traditional LMS or course marketplace. The product emphasizes practical guidance, reusable materials, templates, checklists, and professional growth.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4 + RE-Quest design tokens
- Apollo Client 4
- GraphQL Code Generator
- React Hook Form + Zod
- Lucide Icons
- Vitest + Playwright

## Getting started

```bash
pnpm install
cp .env.example .env.local
pnpm codegen
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/academy/re-quest-academy`.

### Environment

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_GRAPHQL_URL` | boxhub-nest-api GraphQL endpoint |
| `NEXT_PUBLIC_API_BASE_URL` | Optional REST origin for `/academy/upload/*` (defaults to GraphQL host) |
| `ACADEMY_API_ORIGIN` | Optional server-only override for `/uploads/*` rewrites |
| `NEXT_PUBLIC_DEFAULT_ACADEMY_SLUG` | Default tenant slug (`re-quest-academy`) |
| `NEXT_PUBLIC_APP_NAME` | App metadata title |

Uploads call `{API_ORIGIN}/academy/upload/...` directly. In production, Nginx on `discart.me` must allow CORS for the frontend origin on `/academy/upload` (see `boxhub-nest-api/nginx-template.conf`).

Do **not** hardcode academy IDs — resolve via `definedAcademyBySlug`.

### GraphQL codegen

Uses a local schema stub by default (`src/graphql/schema/schema.graphql`).

To introspect the live API:

```bash
GRAPHQL_SCHEMA_URL=http://localhost:3000/graphql pnpm codegen
```

## Architecture

```
src/
  app/(public|auth|workspace|admin)/   # Route groups
  components/ui/                       # Shared primitives
  features/                            # Domain logic (auth, referrals, …)
  graphql/{operations,generated}/
  lib/{apollo,auth,env,tenant,validation}/
  styles/{globals.css,tokens.css}
```

### Surfaces

| Surface | Path prefix | Auth |
|---------|-------------|------|
| Public Academy | `/academy/[slug]`, `/l/[code]` | Optional JWT |
| Auth | `/login`, `/register`, `/verify-email`, `/forgot-password`, `/reset-password` | Public |
| Workspace | `/workspace/*` | JWT |
| Admin | `/admin/*` | JWT + `DEFINED` app |

### Multi-tenant theming

`lib/tenant/theme.ts` resolves `AcademyTheme` from academy API data (`name`, `logoUrl`, `settings.colors`) with RE-Quest Brand Guidelines as the default fallback. Public routes under `/academy/[slug]` apply theme CSS variables via `AcademyThemeScope`.

### Typography

- **Display / UI:** DM Sans (Fractul Variable is brand-preferred but not bundled without licensing approval)
- **Long-form:** Source Serif 4

Approved RE-Quest logo PNGs live in `public/brand/re-quest/`.

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` / `yarn dev` | Development server (port **3000**, or **3001** if 3000 is busy) |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint |
| `pnpm test` | Vitest unit tests |
| `pnpm test:e2e` | Playwright smoke tests |
| `pnpm codegen` | Generate GraphQL types |

## Implementation phases

- **Phase 0:** Project foundation, tokens, Apollo, auth store, route shells, testing
- **Phase 1:** Public academy, partners, resources, short links, referrals, auth forms, enroll CTA
- **Phase 2:** Authenticated workspace, program player, lesson progress, toolkit/downloads
- **Phase 3:** DEFINED admin workspace (programs, resources, partners, short links, campaigns, analytics)
- **Phase 4 (done):** Polish — tenant theme scope, toast feedback, password reset, academy settings, course/lesson edit, module/lesson reorder

### Phase 3–4 admin routes (JWT + `DEFINED` app)

| Route | Behavior |
|-------|----------|
| `/admin` | Analytics overview + quick links |
| `/admin/courses` | List / create / publish / archive programs |
| `/admin/courses/[id]` | Edit program, modules/lessons, content, reorder, publish/preview |
| `/admin/resources` | Create / archive practical materials |
| `/admin/partners` | Create / feature / archive partners |
| `/admin/short-links` | Create / disable tracked links |
| `/admin/campaigns` | Create / activate / archive referral campaigns |
| `/admin/settings` | Academy branding, status, theme colors |

Academy selector in the admin header persists the active tenant (`localStorage`).

Auth polish: `/forgot-password` and `/reset-password?token=…` complete the password reset flow.
## Backend reference

See `boxhub-nest-api` docs:

- `DEFINED_ACADEMY_FRONTEND_IMPLEMENTATION_REPORT.md`
- `defined-auth-contract-for-frontend.md`
- `RE-Quest_BrandGuide.pdf`
