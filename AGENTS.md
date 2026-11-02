# FinTech Platform — Agent Context

## Stack

- **Backend:** ASP.NET Core 10.0 Web API, EF Core (SQL Server — LocalDB in dev), Hangfire (memory storage in dev, SQL Server in prod), Serilog, Swagger+Scalar
- **Web:** TanStack Start (React 19.2), TanStack Router, TanStack Query, Tailwind v4, shadcn/ui (New York), motion v13, Zod v4, Zustand v5
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
└── BankSystem/              # ASP.NET Core backend (single .NET project: fintech-backend.sln/.csproj)
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

User-role support section: files in `dashboard/support/` (`index` = tickets, `help` = FAQ, `messages` = bank inbox) → URLs `/dashboard/support/*`; mobile mirrors at `(drawer)/support/*.tsx`. Distinct from the Support-role folder `support/` above (URLs `/support/*`).

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

## User feature parity matrix (web ↔ mobile)

Track wiring progress for the authenticated **User** role. Status legend:

- ✅ **Wired** — reads/writes real backend data via hooks
- 🟡 **Partial** — real data but with mock fallback / inert buttons / local-only state
- ❌ **Mock / placeholder** — hardcoded data, no backend hook
- ⛔ **Missing** — feature absent on that platform (route does not exist)
- — **N/A** — no equivalent page

`Backend` column = endpoint(s) exist in `BankSystem/` for this feature.

| # | Feature | Backend | Web page | Web | Mobile page | Mobile |
|---|---|---|---|---|---|---|
| 1 | Dashboard / balances | ✅ wallets | `/dashboard` (`routes/(dashboard)/dashboard/index.tsx`) | ✅ | `(tabs)/home.tsx` | ✅ |
| 2 | Wallets / accounts | ✅ wallets | `/dashboard/accounts` | ✅ | `(drawer)/accounts.tsx` | ✅ |
| 3 | Transaction history | ✅ | `/dashboard/transactions` | ✅ | `(drawer)/transactions.tsx` | ✅ |
| 4 | Transaction detail | ✅ | `/dashboard/transactions/$id` | ✅ | `(drawer)/transactions/[id].tsx` | ✅ |
| 5 | Send money / transfer | ✅ | `/dashboard/send-money` | ✅ | `(tabs)/transfers.tsx` | ✅ |
| 6 | Request money (create) | ✅ | inside `/dashboard/top-up` | ✅ | `(drawer)/top-up.tsx` | ✅ |
| 7 | Incoming money requests (accept/decline) | ✅ | inside `/dashboard/top-up` | ✅ (accept + decline) | `(drawer)/top-up.tsx` | ✅ |
| 8 | Outgoing request history | ✅ | inside `/dashboard/top-up` | ✅ | `(drawer)/top-up.tsx` | ✅ |
| 9 | Top-up / deposit | ✅ | `/dashboard/top-up` | ✅ | `(drawer)/top-up.tsx` | ✅ |
| 10 | Cards | ✅ | `/dashboard/cards` | ✅ (freeze/unfreeze/delete/order/limits wired) | `(tabs)/cards.tsx` | ✅ (freeze/unfreeze/delete/limits wired; add inert, no mock) |
| 11 | Recipient lookup | ✅ | ✅ (in send-money) | ✅ | ✅ (in transfers) | ✅ |
| 12 | Transaction search | ✅ (search param) | not applicable | ⛔ | ⛔ (removed `(drawer)/search.tsx`) | ⛔ |
| 13 | Bills & utilities | ✅ bills | `/dashboard/bills` | ✅ (quick-pay/add/delete wired) | `(drawer)/bills.tsx` | ✅ (quick-pay/add/pay wired; no delete) |
| 14 | Analytics | ✅ analytics | `/dashboard/analytics` | ✅ | `(drawer)/analytics.tsx` | ✅ |
| 15 | Reports | ✅ CSV export | `/dashboard/reports` | ✅ | `(drawer)/reports.tsx` (linked from More) | ✅ |
| 16 | Statements | ✅ CSV export | `/dashboard/statements` | ✅ | `(drawer)/statements.tsx` | ✅ |
| 17 | Settings / preferences | ✅ settings | `/dashboard/settings` | ✅ | `(drawer)/settings.tsx` | ✅ |
| 18 | Security / 2FA | ✅ pw-change + settings + 2FA (TOTP) | (inside settings) | ✅ (password change + 2FA setup/enable/disable + sign-in 2FA step) | `(drawer)/settings.tsx` (security card; `security.tsx` just redirects) | ✅ (login alerts + 2FA wired; biometrics/PIN device-local) |
| 19 | Profile / KYC | ✅ profile | `/dashboard/profile` | ✅ (KYC preview badge) | `(drawer)/profile.tsx` | ✅ (KYC preview badge) |
| 20 | Support tickets | ✅ | `/dashboard/support` | ✅ (threaded conversations) | `(drawer)/support/index.tsx` | ✅ (threaded conversations) |
| 21 | Help center / FAQ | ✅ | `/dashboard/support/help` | ✅ | `(drawer)/support/help.tsx` | ✅ |
| 22 | Inbox / messages | ✅ | `/dashboard/support/messages` | ✅ | `(drawer)/support/messages.tsx` | ✅ |
| 23 | Notifications | ✅ | `/dashboard/notifications` | ✅ | `(drawer)/notifications.tsx` | ✅ |
| 24 | Invest / portfolio | ❌ | not applicable | ⛔ | ⛔ (removed `(drawer)/invest.tsx`) | ⛔ |
| 25 | Exchange / FX | ❌ | QuickAction disabled | ⛔ | ⛔ (removed `(drawer)/exchange.tsx`) | ⛔ |
| 26 | Auth (sign-in, sign-up, reset, verify) | ✅ | `(auth)/*` | ✅ | `(auth)/*` | ✅ |

**Parity targets (backend-backed, next wiring pass):** rows 10 and 14 and 20–23 are wired — freeze/unfreeze + delete + order/limits (row 10), analytics summary via `GET /user/analytics/summary` (row 14: dashboard SpendingChart, `/dashboard/analytics`, mobile `(drawer)/analytics.tsx`; KPI cards show the last calendar month with real vs-previous-month deltas on both platforms), and support/help/inbox/notifications (rows 20–23) call the real API on both platforms. Rows 12, 24, 25 are ⛔ on both platforms (mobile mock routes removed in favor of web-first parity). Rows 15 and 16 are wired — CSV statement/report export via `GET /api/user/statements/export?startDate&endDate&direction=all|incoming|outgoing` (rows 15/16; web `/dashboard/statements` + `/dashboard/reports` with preset periods, custom range/type and blob download, mobile `(drawer)/statements.tsx` + `(drawer)/reports.tsx` — reports now linked from the More tab — with OS share sheet; 6-month/YTD presets, last-full-month for monthly reports; budgets/savings/investment report cards stay Preview, no budgets backend). Row 13 is wired — bills backend (`GET/POST/DELETE /api/user/bills`, `POST /api/user/bills/{id}/pay`, `POST /api/user/bills/pay` one-off; `bills` table + `20260929231725_AddBillsTable`): web `/dashboard/bills` has category quick-pay dialog, scheduled Pay Now (idempotency key), add + delete (`window.confirm`); mobile `(drawer)/bills.tsx` has biller quick-pay, add, and scheduled pay (pays from the first wallet, no delete). Bill payments post `TransactionType.Withdrawal` transactions (deliberately no new enum value — analytics/statements/transactions UIs treat them as outflow for free); categories are a shared allowlist of 10 strings (Electricity, Water, Gas, Internet, Phone, TV & Cable, Insurance, Airtime, Data, Other). Rows 17 and 19 are wired end-to-end (profile + preferences persist via `GET/PUT /api/user/profile` and `/api/user/settings`: web settings saves the profile form and auto-saves toggles/selects, both profile pages show real data with edit flows). Row 18: password change works on web (`POST /api/auth/change-password` — fixed a latent bug where the password `RegularExpression` pattern lacked `+` and `RegularExpressionAttribute` requires a full-string match, so every change/reset-password failed with 400), 2FA is now real TOTP on both platforms — `TotpService` (RFC 6238, hand-rolled, no QR lib: manual secret entry + otpauth:// URI), `user_two_factor` table, `GET/POST /api/user/security/2fa{,/setup,/enable,/disable}` (disable accepts a current code OR password to avoid lockout), `POST /api/auth/2fa/login` exchanges a 5-min `purpose=2fa` pending token for real tokens; login flows on both platforms switch to a 6-digit code step when `requiresTwoFactor` comes back, and mobile still has no password-change form (login alerts + device-local biometrics/PIN only). Note: send money/deposits/money requests were silently failing at runtime — `EnableRetryOnFailure` + explicit `BeginTransactionAsync(Serializable)` threw on every call; fixed by wrapping in `Database.CreateExecutionStrategy().ExecuteAsync` (`TransactionService.CreateTransferAsync`, `DepositService.SimulateCallbackAsync`), verified E2E.

**Known data gaps:** the mobile "More" tab (`(tabs)/more.tsx`) links "Profile & verification" to `/(drawer)/profile` (reads real profile data via `GET /api/user/profile` with an inline edit form; KYC remains a Preview; the old `/(drawer)/account` was deleted → intentional). Money requests (rows 6-8) live inside the top-up page on both platforms (web `/dashboard/top-up`, mobile `(drawer)/top-up.tsx`); web `/dashboard/send-money` also shows pending incoming requests. Recharge is absent from the web sidebar while the web `/dashboard/request-money` page was merged into top-up. Mobile cards (`(tabs)/cards.tsx`) show a real "Your cards" list only when the API returns data; on error it now shows a Retry state (mock fallback removed). Analytics breakdown groups expenses by `TransactionType` (there is no Category column — UI keeps the "Spending by Category" label to match the transactions table, which shows type in its Category column); the analytics "Budget Progress" card is still a Preview mock (no budgets backend).

**Pinned — may change:** Inbox messages (row 22) are defined as **one-way bank→user** communications (statements, security alerts, promotions, support replies to tickets; `InboxMessageType` enum) — users can read/mark-as-read/delete but do not send messages through it. If product direction shifts toward user-authored messages or an admin-side composer, revisit this model + both UIs. **Support tickets (row 20) are threaded conversations** — `SupportTicket` has a `Messages` collection (`support_messages` table, `SupportMessage` model: `ticket_id`, `sender_id`, `is_from_user`, `body`); the user's description seeds the first message, `POST /api/user/support/{id}/messages` appends user replies (reopens `Resolved` tickets), and both UIs render the kit-based conversation UI (`web/src/components/messages/*`, `mobile/components/messages/*`). Support-side replies (admin console) don't exist yet — `IsFromUser=false` messages have nullable `SenderId` ready for that.

**Dead code removed:** `nav-documents.tsx` (orphaned sidebar component), the dead "Search" item in the web sidebar (`app-sidebar.tsx`, pointed to removed `/dashboard/search`), six orphaned `landing/` components (`CTA`, `Features`, `Hero`, `HowItWorks`, `Security`, `Testimonials` — replaced by inline animated sections in routes), debug `console.log`s in `mobile/lib/api/index.ts`, and the root-level message kit reference files (`messages.tsx`, `MessageBubble.tsx`, `MessageComposer.tsx`, `ChatList.tsx`, `ChatListItem.tsx`, `ConversationView.tsx`, `ConversationHeader.tsx` — the originals the support-ticket thread UI was ported from into `web/src/components/messages/` and `mobile/components/messages/`). Kept unused UI primitives (shadcn/RN-Reusables sets), unused hook exports, and `getSpending` — reserved for future features.

## Conventions

- **Naming:** PascalCase for components, camelCase for hooks/functions, kebab-case for files
- **Imports:** Use `~/` alias for web (`src/`), absolute paths for mobile
- **CSS:** Tailwind v4 utility classes. Dark mode by default (`defaultTheme="dark"`).
- **Validation:** Zod schemas defined in `lib/schemas.ts` (web) or inline (mobile), shared patterns
- **UI components:** shadcn/ui (web) / React Native Reusables (mobile). Use `cva` for variants, `tailwind-merge` + `clsx` for class merging. Lucide icons.
- **Typography:** Use the existing component primitives (not raw HTML tags for buttons, inputs, cards etc.)

## Web UI transitions (transitions-dev)

Micro-interactions on the web app are built from the `transitions-dev` skill (`.agents/skills/transitions-dev/`). Motion tokens + all transition CSS live in `web/src/styles.css` under the `transitions-dev` comment block; every snippet reads from semantic `:root` variables (e.g. `--digit-dur`, `--modal-ease`) and is zeroed out under `prefers-reduced-motion`.

Implemented patterns:

| Pattern | Reusable piece | Wired into |
|---|---|---|
| Number pop-in | `components/shared/AnimatedNumber.tsx` (`t-digit-group` / `t-digit`, stagger on last 2 digits) | `BalanceCard` total balance, `KPICard` values, `accounts.tsx` total + per-account balances, `AccountsList` balances, `top-up.tsx` deposit amounts — replays whenever the value changes |
| Icon swap | `.t-icon-swap` / `.t-icon` (pure CSS, `data-state="a"`/`"b"`) | `BalanceCard` eye / eye-off toggle |
| Success check | `components/shared/SuccessCheck.tsx` (fade + rotate + Y-bob + SVG stroke draw, replays on key change) | `send-money.tsx` after a successful transfer, `top-up.tsx` completed deposit status |
| Menu dropdown | `.t-dropdown` in `components/ui/dropdown-menu.tsx` (origin-aware via `--radix-dropdown-menu-content-transform-origin`, open/close durations) | every `DropdownMenu*` usage |
| Modal open/close | `.t-modal` + `.t-modal-overlay` in `components/ui/dialog.tsx` (center scale-up/down) | every `Dialog*` usage |
| Page side-by-side | `.t-page-exit` / `.t-page-enter` (slide + blur) | transaction list row exit → `/transactions/$id` entrance (`useNavigate` is deferred by ~200ms to let the exit animation finish) |
| Tabs sliding | `SlidingTabsList` in `components/ui/tabs.tsx` (animated pill measured from the active trigger; resize-aware) | recipient-type tabs in `send-money.tsx` and `request-money.tsx` |
| Staggered text reveal | `StaggerText` in `routes/(landing)/index.tsx` (`.t-stagger` / `.t-stagger-line`, keyed lines, replays via classList toggle) | hero carousel slides (promo/title/subtitle/CTA stagger in on mount + slide change) |
| Scroll stagger / panel reveal | `components/landing/Reveal.tsx` (IntersectionObserver + `data-open`, auto `.t-stagger` vs `.t-panel-slide`) | landing sections: Category, Features, Stats, Testimonial, CTA headings + cards |

Rules when adding a new transition:
- Paste the CSS verbatim from the skill into `web/src/styles.css` (tokens + snippet + reduced-motion guard together) before touching components.
- Prefer a reusable component in `components/shared/` over inline JSX when the pattern may be reused.
- Do not add new animation libraries for these patterns — the skill CSS + Radix `data-state` is the mechanism.

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
pnpm android            # Expo dev server (Android)
pnpm ios                # Expo dev server (iOS)

# Typecheck (from web/ or mobile/)
pnpm exec tsc --noEmit

# Backend (from BankSystem/ — standalone .NET project, outside the pnpm workspace)
cd BankSystem
dotnet run              # Start API on port 5182 (auto-migrates + seeds dev data on startup)
dotnet ef migrations add <name>   # Repo-local EF tool (dotnet-tools.json pins dotnet-ef 10.0.12 to match the EF Core 10.0.12 packages — keep tool and package versions in sync when bumping)
```

## Deployment

- **Web** → Vercel (dashboard-configured, no CI workflow). The app calls the backend **directly**: set `VITE_API_BASE_URL` in the Vercel dashboard (Project → Settings → Environment Variables) to the backend origin (e.g. `http://<ORACLE-IP>:5182`) — Vite inlines it at build time. `web/vercel.json` carries no API rewrite (rewrites can't read env vars, so the old proxy forced a hardcoded IP). Template: `web/.env.example` (dev uses `web/.env.local`). CORS: the API allows origins from `App__FrontendUrl` + `localhost:3000/5173` (`Program.cs`) — set `App__FrontendUrl` to the Vercel URL in the server's `app.env`.
- **Backend** → `.github/workflows/backend.yml`: build + framework-dependent publish + self-contained EF migration bundle (`dotnet ef migrations bundle`, RID `linux-arm64`, must run with `ASPNETCORE_ENVIRONMENT=Production` and needs no live DB) → tarball → `~/fintech-backend/releases/<sha>` → `efbundle --connection` (connection string sourced from `shared/app.env`) → `live` symlink swap → systemd restart → `/health` check. One-time server setup: `BankSystem/deploy/README.md`. Prod migrations are NOT automatic on startup (dev-only in Program.cs) — the bundle applies them during deploy. Secrets: `ORACLE_SSH_KEY`, `ORACLE_CLOUD_IP`, `ORACLE_CLOUD_USER`.
- **Mobile** → `.github/workflows/mobile.yml`: Biome lint (non-blocking until pre-existing violations are fixed) → EAS `preview` + `development` APK builds → APKs SCP'd to the Oracle box under `~/mobile/android-output/` with `latest-*.apk` symlinks. Profiles in `mobile/eas.json` (no `expo-dev-client` installed, so no `developmentClient` build). Backend URL is baked at build time from `build.<profile>.env.EXPO_PUBLIC_API_BASE_URL` in `eas.json` (placeholder `YOUR-ORACLE-BACKEND-IP` must be replaced, or the APKs default to localhost and can't reach the API). Secrets: `EXPO_TOKEN` + the ORACLE_* set.

**Env rule:** no deploy-time value is hardcoded — web gets `VITE_API_BASE_URL` (Vercel dashboard), mobile gets `EXPO_PUBLIC_API_BASE_URL` (`eas.json` env blocks), backend gets `ConnectionStrings__*` / `Jwt__Key` / `Encryption__Key` / `App__FrontendUrl` / `Email__*` (server `app.env`, template `BankSystem/deploy/app.env.example`). Dev defaults live in `BankSystem/appsettings.json` and `web/.env.local`. Full table: README → Environment variables.

## Related files

- `turbo.json` — Turborepo config (web + mobile tasks)
- `biome.json` — Lint/format rules
- `web/src/router.tsx` — Route tree definition
- `BankSystem/Program.cs` — App startup (DI, CORS, JWT, Hangfire, Serilog)
- `BankSystem/appsettings.json` — Connection string, JWT config
- `BankSystem/Services/UserDashboard/AnalyticsService.cs` + `Controllers/UserDashboard/AnalyticsController.cs` — `GET /api/user/analytics/summary`
- `web/src/lib/api/analytics.ts` / `web/src/hooks/useAnalytics.ts` and `mobile/lib/api/analytics.ts` / `mobile/hooks/useAnalytics.ts` — analytics API + query hooks
- `BankSystem/Services/UserDashboard/ProfileService.cs` + `Controllers/UserDashboard/ProfileController.cs` / `SettingsController.cs` — `GET/PUT /api/user/profile` and `/api/user/settings`
- `web/src/lib/api/profile.ts` / `web/src/hooks/useProfile.ts` and `mobile/lib/api/profile.ts` / `mobile/hooks/useProfile.ts` — profile/settings API + query hooks
- `BankSystem/Controllers/UserDashboard/StatementsController.cs` — `GET /api/user/statements/export` (CSV, UTF-8 BOM, wallet-scoped, date + direction filters)
- `web/src/lib/api/statements.ts` / `mobile/lib/api/statements.ts` — CSV download/blob save (web), fetch + share sheet (mobile), shared period helpers
- `BankSystem/Services/UserDashboard/BillService.cs` + `Controllers/UserDashboard/BillsController.cs` — `GET/POST/DELETE /api/user/bills`, `POST /api/user/bills/{id}/pay`, `POST /api/user/bills/pay`
- `web/src/lib/api/bills.ts` / `web/src/hooks/useBills.ts` and `mobile/lib/api/bills.ts` / `mobile/hooks/useBills.ts` — bills API + query/mutation hooks
- `BankSystem/Services/TotpService.cs` — hand-rolled RFC 6238 TOTP (SHA-1/30s/6-digit) + Base32 + otpauth:// URI (no third-party OTP/QR lib); validated against RFC 6238 test vectors
- `BankSystem/Models/UserTwoFactor.cs` + `Controllers/UserDashboard/SecurityController.cs` — `user_two_factor` table and `GET/POST /api/user/security/2fa{,/setup,/enable,/disable}`
- `BankSystem/Controllers/AuthController.cs` (`POST /api/auth/2fa/login`) + `Services/AuthService.cs` / `Services/JwtService.cs` (`GenerateTwoFactorToken`, `purpose=2fa` claim) — login step-2 token exchange
- `web/src/lib/api/security.ts` / `web/src/hooks/useTwoFactor.ts` and `mobile/lib/api/security.ts` / `mobile/hooks/useTwoFactor.ts` — 2FA API + query/mutation hooks; wired in `web/src/lib/authStore.ts` + `web/src/routes/(auth)/signin.tsx` + settings page, and `mobile/app/(auth)/sign-in.tsx` + `mobile/app/(drawer)/settings.tsx`
