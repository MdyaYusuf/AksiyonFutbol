# AksiyonFutbol ⚽🏛️

AksiyonFutbol is a fictional football club-president management game built with a feature-first vertical slice architecture. Players create a president and club, draft a squad, climb divisions, and shape a career along Integrity or Cunning paths in a persistent, satirical football world.

The solution is powered by a **.NET 10 Web API** backend and a **React 19 + TypeScript + Vite 8** frontend.

## 🌐 Overview

AksiyonFutbol turns club presidency into a season-long management sandbox:

- **Build a Club:** Create a president identity, found a club, draft a starting squad, and grow facilities over time.
- **Compete in Divisions:** Play weekly fixtures in a live match engine, climb tables, and progress through season transitions with promotion and relegation.
- **Morality & Influence:** Spend cash on club actions and match influence, balance Legitimacy against Infamy, and chase objectives and titles.
- **Admin Control Center:** A dedicated console for divisions, clubs, players, referees, fixtures, and season-end processing.

The solution is organized by feature rather than technical layer, with each slice owning its entity, repository, service, business rules, DTOs, mapper, and controller.

## ✨ Features

- 🏛️ **President & club career**
  - President creation with attribute allocation, Legitimacy, Infamy, and equippable career titles.
  - Club onboarding, financial overview, facilities upgrades, and squad atmosphere.
  - Tutorial seating into competitive divisions once the club is ready.

- 👥 **Squad building**
  - Catalog-driven draft board with budgets, quotas, and bot draft opponents.
  - Squad and player instance views with attribute breakdowns.
  - Tactics board and match-day lineups with formations, mentality, and injury-aware selection.
  - Transfer market, free agents, and deal negotiation flows.

- ⚽ **Matches & seasons**
  - Fixture calendar with live match commentary, pitch view, and post-match reports.
  - Division standings, match-week orchestration, and bot club competition.
  - Season-end processing with promotion, relegation, and admin preflight tools.
  - Division press desk generating scandal, club, placement, and results headlines.

- ⚡ **Actions, influence & objectives**
  - Club actions with cooldowns, success chances, cash costs, and morality deltas.
  - Match influence / referee approach stakes with confirmation flows.
  - Objective catalog with progress settling, claimable rewards, and title unlocks.
  - Dashboard snapshots for next match, form, standings, and objectives.

- 👤 **Authentication & security**
  - Custom JWT authentication with refresh token rotation.
  - Dual-platform token delivery driven by an `X-Client-Platform` header.
  - Web clients receive HttpOnly, SameSite=Strict cookies with raw tokens stripped from the response body.
  - Role-based access control separating player and admin surfaces.
  - Compile-time DTO mapping via **Riok.Mapperly**.
  - **FluentValidation** for strict request DTO validation.
  - Global exception handler mapping custom exceptions to standard HTTP status codes.
  - Age gate and fictional-world disclaimers on public and in-game surfaces.

- 🛠️ **Admin console**
  - Dashboard glance at divisions and recent activity.
  - CRUD-style management for league divisions, clubs, base players, player instances, referees, and matches.
  - Season-end execution with movers preview and guarded processing.

- 🧬 **Frontend client**
  - React 19 + TypeScript SPA with Vite 8.
  - Responsive dark UI built with **Tailwind CSS 4** and Material Symbols iconography.
  - Layout-driven routing via React Router 7 with public, onboarding, protected, and admin wrappers.
  - Redux Toolkit slices per feature for centralized state management.
  - Custom fetch-based API client handling credentials, global toasts, and 401 refresh queueing.

## 🛠️ Tech Stack

- **Backend**
  - .NET 10 (ASP.NET Core Web API)
  - Entity Framework Core 10
  - SQL Server
  - Custom JWT Authentication (JwtBearer)
  - Riok.Mapperly (Source-generated mapping)
  - FluentValidation
  - HybridCache

- **Frontend**
  - React 19 + TypeScript
  - Vite 8
  - Redux Toolkit
  - React Router 7
  - Tailwind CSS 4
  - Native Fetch API client
  - React Toastify

## 📂 Project Structure

```text
AksiyonFutbol/
├── AksiyonFutbol.slnx              # .NET 10 Solution
├── Api/                            # ASP.NET Core Web API (Vertical Slice Architecture)
│   ├── Core/                       # Cross-cutting infrastructure
│   │   ├── Controllers/            # CustomBaseController (claims extraction)
│   │   ├── Entities/               # Generic base class (Entity.cs)
│   │   ├── Exceptions/             # Business, NotFound, Forbidden, Authorization
│   │   ├── Helpers/                # Shared helpers & cache utilities
│   │   ├── Middlewares/            # GlobalExceptionHandler
│   │   ├── Options/                # Typed configuration options
│   │   ├── Repositories/           # IRepository, EfBaseRepository, IUnitOfWork
│   │   ├── Requests/               # Shared request contracts
│   │   ├── Responses/              # ReturnModel & paged response wrappers
│   │   ├── Security/               # HashingHelper & TokenOptions
│   │   ├── Serialization/          # JSON serialization helpers
│   │   └── Validation/             # Shared validation plumbing
│   ├── Data/                       # BaseDbContext, UnitOfWork, DI registration
│   ├── Features/                   # One cohesive folder per feature slice
│   │   ├── Authentication/         # Login, register, refresh token rotation
│   │   ├── Users/                  # Profile & account endpoints
│   │   ├── Roles/                  # Role definitions
│   │   ├── ClubPresidents/         # President identity, morality & titles
│   │   ├── Clubs/                  # Club lifecycle, finances & scandals
│   │   ├── BaseBotClubs/           # Bot club templates
│   │   ├── BasePlayers/            # Player catalog templates
│   │   ├── PlayerInstances/        # Club-owned player instances
│   │   ├── ClubDrafts/             # Draft board, budgets & bot picks
│   │   ├── ClubLineups/            # Tactics & match-day squads
│   │   ├── Facilities/             # Facility levels & upgrades
│   │   ├── Transfers/              # Listings, offers & free agents
│   │   ├── LeagueDivisions/        # Divisions, standings & match weeks
│   │   ├── Matches/                # Fixtures, simulation & live play
│   │   ├── Referees/               # Referee catalog
│   │   ├── Actions/                # Club actions & media spin
│   │   ├── Bribery/                # Match influence stakes
│   │   ├── Objectives/             # Career goals, claims & title unlocks
│   │   ├── LeaguePress/            # Generated division news
│   │   ├── CompetitiveSeating/     # Tutorial graduation into leagues
│   │   └── SeasonTransitions/      # Season-end promotion & relegation
│   ├── Migrations/                 # EF Core 10 migration history
│   ├── wwwroot/                    # Static assets & uploaded media
│   └── Program.cs                  # Service registration & HTTP pipeline
└── Client/                         # React 19 + Vite 8 Frontend
    ├── public/                     # Static assets
    └── src/
        ├── core/                   # Shared application shell
        │   ├── api/                # Custom fetch client with 401 refresh queue
        │   ├── components/         # App, admin, public, legal & UI shared pieces
        │   ├── layouts/            # Public, Onboarding, App & Admin layouts
        │   ├── routes/             # Onboarding guards & path helpers
        │   ├── store/              # Redux store configuration & hooks
        │   ├── types/              # Shared response contracts
        │   └── utils/              # Cash, media, dates & presentation helpers
        ├── pages/public/           # Landing, terms, privacy & support
        ├── ProtectedRoute.tsx      # Role-based route wrapper
        ├── router.tsx              # createBrowserRouter tree
        └── features/               # Feature slices mirroring the backend
            ├── admin/              # Admin dashboard overview
            ├── auth/               # Login, register & session restore
            ├── dashboard/          # Career home & snapshots
            ├── clubPresidents/     # President profile & creation
            ├── clubs/              # Club overview & admin clubs
            ├── clubDrafts/         # Draft board UI
            ├── clubLineups/        # Tactics & match-day lineup
            ├── facilities/         # Facilities hub & upgrade detail
            ├── playerInstances/    # Squad & admin player instances
            ├── basePlayers/        # Admin base player catalog
            ├── transfers/          # Market, free agents & deals
            ├── leagueDivisions/    # Standings & admin divisions
            ├── matches/            # Fixtures, live match & admin matches
            ├── referees/           # Admin referees
            ├── actions/            # Actions hub
            ├── bribery/            # Match influence flows
            ├── objectives/         # Objectives hub & titles
            ├── news/               # Division press feed
            ├── competitiveSeating/ # Seating / graduation hooks
            ├── seasonTransitions/  # Season-end admin tools
            ├── users/              # Account settings
            └── roles/              # Role API slice
```
