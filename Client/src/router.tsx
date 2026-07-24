import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import { ProtectedRoute } from "./ProtectedRoute";
import { AdminLayout } from "./core/layouts/AdminLayout";
import { AppLayout } from "./core/layouts/AppLayout";
import { OnboardingLayout } from "./core/layouts/OnboardingLayout";
import { PublicLayout } from "./core/layouts/PublicLayout";
import { OnboardingGuard } from "./core/routes/OnboardingGuard";
import { OnboardingRedirect } from "./core/routes/OnboardingRedirect";
import { AdminDashboardPage } from "./features/admin/pages/AdminDashboardPage";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { RegisterPage } from "./features/auth/pages/RegisterPage";
import { AdminBasePlayersPage } from "./features/basePlayers/pages/AdminBasePlayersPage";
import { CreatePresidentPage } from "./features/clubPresidents/pages/CreatePresidentPage";
import { PresidentProfilePage } from "./features/clubPresidents/pages/PresidentProfilePage";
import { AdminClubsPage } from "./features/clubs/pages/AdminClubsPage";
import { ClubOverviewPage } from "./features/clubs/pages/ClubOverviewPage";
import { CreateClubPage } from "./features/clubs/pages/CreateClubPage";
import { DashboardPage } from "./features/dashboard/pages/DashboardPage";
import { AdminLeagueDivisionsPage } from "./features/leagueDivisions/pages/AdminLeagueDivisionsPage";
import { LeaguePage } from "./features/leagueDivisions/pages/LeaguePage";
import { AdminMatchesPage } from "./features/matches/pages/AdminMatchesPage";
import { FixturesPage } from "./features/matches/pages/FixturesPage";
import { MatchDetailPage } from "./features/matches/pages/MatchDetailPage";
import { AdminPlayerInstancesPage } from "./features/playerInstances/pages/AdminPlayerInstancesPage";
import { PlayerDetailPage } from "./features/playerInstances/pages/PlayerDetailPage";
import { SquadPage } from "./features/playerInstances/pages/SquadPage";
import { AdminRefereesPage } from "./features/referees/pages/AdminRefereesPage";
import { AccountSettingsPage } from "./features/users/pages/AccountSettingsPage";
import { MatchDayLineupPage } from "./features/clubLineups/pages/MatchDayLineupPage";
import { TacticsBoardPage } from "./features/clubLineups/pages/TacticsBoardPage";
import { TransferMarketPage } from "./features/transfers/pages/TransferMarketPage";
import { MakeOfferPage } from "./features/transfers/pages/MakeOfferPage";
import { MyDealsPage } from "./features/transfers/pages/MyDealsPage";
import { MatchInfluencePage } from "./features/bribery/pages/MatchInfluencePage";
import { ConfirmBribePage } from "./features/bribery/pages/ConfirmBribePage";
import { FacilitiesHubPage } from "./features/facilities/pages/FacilitiesHubPage";
import { FacilityUpgradeDetailPage } from "./features/facilities/pages/FacilityUpgradeDetailPage";
import { EndOfSeasonMovementsPage } from "./features/seasonTransitions/pages/EndOfSeasonMovementsPage";
import { LandingPage } from "./pages/public/LandingPage";
import { PrivacyPolicyPage } from "./pages/public/PrivacyPolicyPage";
import { SupportPage } from "./pages/public/SupportPage";
import { TermsOfServicePage } from "./pages/public/TermsOfServicePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          {
            index: true,
            element: <LandingPage />,
          },
          {
            path: "login",
            element: <LoginPage />,
          },
          {
            path: "register",
            element: <RegisterPage />,
          },
          {
            path: "terms",
            element: <TermsOfServicePage />,
          },
          {
            path: "privacy",
            element: <PrivacyPolicyPage />,
          },
          {
            path: "support",
            element: <SupportPage />,
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "app",
            children: [
              {
                index: true,
                element: <OnboardingRedirect />,
              },
              {
                element: <OnboardingLayout />,
                children: [
                  {
                    path: "onboarding",
                    children: [
                      {
                        index: true,
                        element: <OnboardingRedirect />,
                      },
                      {
                        path: "president",
                        element: <CreatePresidentPage />,
                      },
                      {
                        path: "club",
                        element: <CreateClubPage />,
                      },
                    ],
                  },
                ],
              },
              {
                element: <AppLayout />,
                children: [
                  {
                    path: "settings",
                    element: <AccountSettingsPage />,
                  },
                  {
                    element: <OnboardingGuard />,
                    children: [
                      {
                        path: "dashboard",
                        element: <DashboardPage />,
                      },
                      {
                        path: "president",
                        element: <PresidentProfilePage />,
                      },
                      {
                        path: "club",
                        element: <ClubOverviewPage />,
                      },
                      {
                        path: "facilities",
                        element: <FacilitiesHubPage />,
                      },
                      {
                        path: "facilities/:facilityType",
                        element: <FacilityUpgradeDetailPage />,
                      },
                      {
                        path: "squad",
                        element: <SquadPage />,
                      },
                      {
                        path: "squad/:id",
                        element: <PlayerDetailPage />,
                      },
                      {
                        path: "tactics",
                        element: <TacticsBoardPage />,
                      },
                      {
                        path: "transfers",
                        element: <TransferMarketPage />,
                      },
                      {
                        path: "transfers/deals",
                        element: <MyDealsPage />,
                      },
                      {
                        path: "transfers/:listingId/offer",
                        element: <MakeOfferPage />,
                      },
                      {
                        path: "league",
                        element: <LeaguePage />,
                      },
                      {
                        path: "season-end",
                        element: <EndOfSeasonMovementsPage />,
                      },
                      {
                        path: "fixtures",
                        element: <FixturesPage />,
                      },
                      {
                        path: "influence",
                        element: <MatchInfluencePage />,
                      },
                      {
                        path: "influence/confirm",
                        element: <ConfirmBribePage />,
                      },
                      {
                        path: "matches/:id/lineup",
                        element: <MatchDayLineupPage />,
                      },
                      {
                        path: "matches/:id",
                        element: <MatchDetailPage />,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={["Admin"]} />,
        children: [
          {
            path: "admin",
            element: <AdminLayout />,
            children: [
              {
                index: true,
                element: <AdminDashboardPage />,
              },
              {
                path: "league-divisions",
                element: <AdminLeagueDivisionsPage />,
              },
              {
                path: "base-players",
                element: <AdminBasePlayersPage />,
              },
              {
                path: "referees",
                element: <AdminRefereesPage />,
              },
              {
                path: "clubs",
                element: <AdminClubsPage />,
              },
              {
                path: "player-instances",
                element: <AdminPlayerInstancesPage />,
              },
              {
                path: "matches",
                element: <AdminMatchesPage />,
              },
              {
                path: "settings",
                element: <AccountSettingsPage />,
              },
            ],
          },
        ],
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
