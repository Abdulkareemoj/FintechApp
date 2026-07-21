# FinTech Platform — Agent Context

## Stack

- **Backend:** ASP.NET Core 9.0 Web API, EF Core, Npgsql (PostgreSQL via Neon.tech), Hangfire, Serilog, Swagger+Scalar
- **Web:** TanStack Start (React 19.2), TanStack Router, TanStack Query, Tailwind v4, shadcn/ui (New York), motion v12, Zod v4, Zustand v5
- **Mobile:** Expo SDK 57 (React Native 0.86), Expo Router, React Native Reusables (rn-primitives), Tailwind v4 via Uniwind, Zustand v5, Zod v4
- **Monorepo:** Turborepo 2.9 + pnpm 11.1, Biome 2.5 (lint/format)

## Structure

```
FinTech/
├── pnpm-workspace.yaml     # workspace root (mobile/ + web/)
├── turbo.json               # Turborepo config (web + mobile)
├── package.json             # root scripts (dev, build, check)
├── AGENTS.md
│
├── web/                     # TanStack Start web app
│   ├── src/routes/          # File-based routing (TanStack Router)
│   │   ├── (landing)/       # Public pages
│   │   ├── (auth)/          # Sign-in, sign-up, password reset
│   │   ├── (dashboard)/     # Authenticated sections
│   │   │   ├── dashboard/   # User dashboard
│   │   │   ├── admin/       # Admin panel
│   │   │   ├── support/     # Support dashboard
│   │   │   └── merchant/    # Merchant portal
│   │   └── docs/            # Fumadocs MDX docs
│   └── src/components/      # shadcn/ui (ui/), shared/, *-dashboard/, landing/
│
├── mobile/                  # Expo React Native app
│   ├── app/                 # File-based routing (Expo Router)
│   │   ├── (auth)/          # Auth screens
│   │   └── (drawer)/        # Authenticated (drawer → tabs)
│   │       ├── (tabs)/      # Bottom tabs: Home, Cards, Transfers, More
│   │       └── transactions/# Transaction list + detail
│   └── components/ui/       # React Native Reusables (shadcn-style)
│
└── BankSystem/              # Backend monorepo (standalone pnpm workspace)
        ├── Controllers/     # AuthController, UserDashboard/*
        ├── Models/          # User, Wallet, Transaction, Card, Enums, DTOs
        ├── Services/        # AuthService, JwtService, UserDashboard/*
        ├── Data/            # AppDbContext
        └── Migrations/      # EF Core migrations
```

## Routes & role layout convention

Route groups match the auth guard type:
- `(landing)/` — public, uses `LandingLayout`
- `(auth)/` — unauthenticated only, uses `AuthLayout`
- `(dashboard)/` — requires auth, further split by role:
  - `dashboard/` — `User` role → `DashboardLayout`
  - `admin/` — `Admin` role → `AdminLayout`
  - `support/` — `Support` role → `SupportLayout`
  - `merchant/` — `Merchant` role → `MerchantLayout`

All role layouts check auth state and redirect on unauthorized access.

## State management

- **Auth state** (user, tokens) → Zustand store in `lib/authStore.ts`
- **Server data** (wallets, transactions, cards) → TanStack Query hooks in `hooks/` (web) or `hooks/` (mobile)
- **Forms** → React Hook Form + Zod resolvers

## API patterns

- Web: Axios instance in `lib/apiClient.ts` with JWT interceptor (auto-refresh on 401)
- Mobile: typed `request<T>` function in `lib/api/index.ts` with built-in token refresh
- Both: typed API modules under `lib/api/` (wallets.ts, transactions.ts, cards.ts)
- Backend: Controllers → Services → DbContext via DI. Try-catch with structured error responses.
- Idempotency keys (GUID) on transactions to prevent duplicate processing.

## Mobile navigation architecture

`_layout.tsx` (root) → auth guard → `(drawer)/_layout.tsx` (custom drawer) → `(tabs)/_layout.tsx` (animated bottom tabs) → screen components. Custom drawer content, custom animated tab bar. See `mobile/app/(drawer)/_layout.tsx` and `mobile/app/(drawer)/(tabs)/_layout.tsx`.

## Conventions

- **Naming:** PascalCase for components, camelCase for hooks/functions, kebab-case for files
- **Imports:** Use `~/` alias for web (`src/`), absolute paths for mobile
- **CSS:** Tailwind v4 utility classes. Dark mode by default (`defaultTheme="dark"`).
- **Validation:** Zod schemas defined in `lib/schemas.ts` (web) or inline (mobile), shared patterns
- **UI components:** shadcn/ui (web) / React Native Reusables (mobile). Use `cva` for variants, `tailwind-merge` + `clsx` for class merging. Lucide icons.
- **Typography:** Use the existing component primitives (not raw HTML tags for buttons, inputs, cards etc.)

## Common commands

```bash
# Monorepo (from project root — web + mobile)
pnpm dev                # Start all apps (turbo dev)
pnpm build              # Build all apps
pnpm check              # Biome lint + format

# Web only (from web/)
pnpm dev                # Vite dev server (port 3000)
pnpm build              # Build for production

# Mobile (from mobile/)
pnpm dev                # Expo dev server
pnpm android            # Expo Android build
pnpm ios                # Expo iOS build

# Backend (from BankSystem/)
cd BankSystem
pnpm dev                # Turbo dev (starts backend)
cd apps/backend
dotnet run              # Start API on port 5182
dotnet ef migrations add <name>
```

## Related files

- `turbo.json` — Turborepo config (web + mobile tasks)
- `biome.json` — Lint/format rules
- `web/src/router.tsx` — Route tree definition
- `BankSystem.code-workspace` — VS Code workspace config
- `BankSystem/Program.cs` — App startup (DI, CORS, JWT, Hangfire, Serilog)
- `BankSystem/appsettings.json` — Connection string, JWT config
