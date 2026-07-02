import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import { ProtectedRoute } from "./ProtectedRoute";
import { AdminLayout } from "./core/layouts/AdminLayout";
import { AppLayout } from "./core/layouts/AppLayout";
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
import { SquadPage } from "./features/playerInstances/pages/SquadPage";
import { AdminRefereesPage } from "./features/referees/pages/AdminRefereesPage";
import { LandingPage } from "./pages/public/LandingPage";

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
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "app",
            element: <AppLayout />,
            children: [
              {
                index: true,
                element: <OnboardingRedirect />,
              },
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
                    path: "squad",
                    element: <SquadPage />,
                  },
                  {
                    path: "league",
                    element: <LeaguePage />,
                  },
                  {
                    path: "fixtures",
                    element: <FixturesPage />,
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
