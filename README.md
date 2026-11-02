# FinTech Platform

A digital payments platform with P2P transfers, multi-currency wallets, virtual cards, and spending analytics, built as a monorepo with an **ASP.NET Core** API, a **React** web app, and an **Expo** mobile app.

> Status: the **User** role is wired end-to-end (web ↔ mobile ↔ API). Admin, Support, and Merchant consoles exist as web UI only.

## Tech stack

| Layer | Technology |
| --- | --- |
| **API** | ASP.NET Core 10.0, EF Core 10 (SQL Server LocalDB in dev), JWT auth with refresh tokens, Hangfire background jobs, Serilog, Swagger + Scalar |
| **Web** | React, TanStack Router + Query, shadcn/ui (New York), Tailwind v4, Zustand, Zod, motion |
| **Mobile** | Expo SDK 57 (React Native 0.86), Expo Router, React Native Reusables, Uniwind (Tailwind v4), Zustand, Zod |
| **Tooling** | Turborepo, pnpm workspaces, Biome (lint + format) |

## Repository structure

```text
FinTech/
├── web/                          # TanStack Start web app (port 3000)
│   └── src/
│       ├── routes/
│       │   ├── (landing)/        # public pages (home, features, about, legal…)
│       │   ├── (auth)/           # sign-in, sign-up, password reset, verify
│       │   └── (dashboard)/
│       │       ├── dashboard/    # User role accounts, send-money, top-up,
│       │       │                  # transactions, cards, analytics, support, settings
│       │       ├── admin/        # Admin console (UI only)
│       │       ├── support/      # Support console (UI only)
│       │       └── merchant/     # Merchant console (UI only)
│       ├── components/           # shadcn/ui + feature components
│       ├── hooks/                # TanStack Query hooks
│       └── lib/                  # api client, auth store, schemas
│
├── mobile/                       # Expo React Native app
│   └── app/
│       ├── (auth)/               # sign-in, sign-up, reset, verify
│       └── (drawer)/             # custom drawer
│           ├── (tabs)/           # Home, Cards, Transfers, More
│           └── *.tsx             # accounts, transactions, top-up, analytics,
│                                 # cards detail, support, profile, settings…
│
├── BankSystem/                   # ASP.NET Core 10 API (port 5182 via dotnet run)
│   ├── Controllers/              # AuthController + UserDashboard/* (User role)
│   ├── Services/                 # transactions, deposits, cards, support, analytics…
│   ├── Models/                   # entities, enums, DTOs
│   ├── Data/                     # AppDbContext + dev seeding
│   └── Migrations/
│
├── AGENTS.md                     # agent context + web ↔ mobile parity matrix
├── turbo.json                    # Turborepo task config
├── biome.json                    # lint/format config
└── pnpm-workspace.yaml           # workspace root (web + mobile)
```

## Features

**User role wired to the API on both platforms:**

- Multi-currency wallets and account overview
- Send / request money P2P transfers, money requests with accept & decline
- Top-up / deposit flow (initiate + processor callback)
- Virtual cards create, freeze/unfreeze, delete, spend limits
- Bill payments (biller categories, scheduled bills, wallet debit)
- Transaction history, search, and detail view
- Spending analytics income vs. spending trend, spending breakdown, weekly view
- Support tickets (threaded conversations), help center, bank inbox
- Notifications and full auth flow (sign-up, sign-in, reset, email verification)
- Two-factor authentication (TOTP authenticator app, sign-in code step, code-or-password disable)
- Account statements + financial reports (CSV export, date/direction filters)

**Preview / mocked (no backend yet):**

- Budget tracking

**Other roles:** the `Admin`, `Support`, and `Merchant` dashboards are UI-only. The API currently exposes `Auth` + `UserDashboard` controllers (all user endpoints are `[Authorize(Roles = "User")]`).

## Getting started

**Prerequisites:** .NET 10 SDK, Node.js 20+, pnpm 11, SQL Server LocalDB.

```bash
pnpm install                # install JS dependencies

# Terminal 1 API (auto-migrates and seeds demo data on startup)
cd BankSystem
dotnet run                  # http://localhost:5182

# Terminal 2 Web
pnpm dev:web                # http://localhost:3000

# Terminal 3 Mobile
pnpm dev:mobile              # Expo dev server
```

API docs while running: Scalar at `/scalar`, Hangfire dashboard at `/hangfire`.

## Environment variables

No production value is hardcoded — every deploy surface reads config:

| Surface | Variable | Where it is set | Example |
| --- | --- | --- | --- |
| Web (Vite) | `VITE_API_BASE_URL` | `web/.env.local` for dev (template: `web/.env.example`); **Vercel dashboard** → Project → Settings → Environment Variables (inlined at build) | `http://localhost:5182` / `http://YOUR-ORACLE-BACKEND-IP:5182` |
| Mobile (Expo) | `EXPO_PUBLIC_API_BASE_URL` | `mobile/eas.json` → `build.<profile>.env` (baked into the APK by EAS) | `http://YOUR-ORACLE-BACKEND-IP:5182/api` |
| API (prod) | `ConnectionStrings__DefaultConnection`, `Jwt__Key`, `Encryption__Key`, `App__FrontendUrl`, `Email__*` | server `~/fintech-backend/shared/app.env` (systemd EnvironmentFile) — template: `BankSystem/deploy/app.env.example` | see template |
| API (dev) | same keys | defaults in `BankSystem/appsettings.json` (LocalDB + placeholder keys, dev only) | — |
| CI/CD | `ORACLE_SSH_KEY`, `ORACLE_CLOUD_IP`, `ORACLE_CLOUD_USER`, `EXPO_TOKEN` | GitHub repo secrets | — |

**Three placeholders to fill when deploying:**

1. `VITE_API_BASE_URL` in the Vercel dashboard → backend origin (web calls the API directly).
2. `EXPO_PUBLIC_API_BASE_URL` in `mobile/eas.json` (all three build profiles) → backend origin + `/api`.
3. `ConnectionStrings__*` / `Jwt__Key` / `Encryption__Key` / `App__FrontendUrl` in the server's `app.env`.

CORS: the API allows origins from `App__FrontendUrl` (set it to your Vercel URL) plus `localhost:3000`/`5173` for dev — configured in `Program.cs`, nothing hardcoded for production.

## Commands

Run from the repository root unless noted:

| Command | What it does |
| --- | --- |
| `pnpm dev` | Run all apps (Turborepo) |
| `pnpm dev:web` / `pnpm dev:mobile` | Run a single app |
| `pnpm build` | Build all apps |
| `pnpm check` | Biome lint + format (write mode) |
| `pnpm exec tsc --noEmit` | Typecheck (run from `web/` or `mobile/`) |
| `dotnet run` | Start the API (from `BankSystem/`) |
| `dotnet ef migrations add <name>` | Add an EF Core migration (from `BankSystem/`) |

## API conventions

- JWT bearer auth with refresh-token rotation; user endpoints require the `User` role.
- Success responses use an envelope: `{ "success": true, "data": … }`; failures carry an error message.
- Mutating requests take an idempotency key (GUID) to prevent duplicate processing.
- User dashboard base path: `api/user/…` e.g. `GET /api/user/analytics/summary`.

## Documentation

WIP