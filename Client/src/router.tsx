import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import { ProtectedRoute } from "./ProtectedRoute";
import { AdminLayout } from "./core/layouts/AdminLayout";
import { AppLayout } from "./core/layouts/AppLayout";
import { PublicLayout } from "./core/layouts/PublicLayout";
import { OnboardingGuard } from "./core/routes/OnboardingGuard";
import { OnboardingRedirect } from "./core/routes/OnboardingRedirect";
import { PlaceholderPage } from "./pages/PlaceholderPage";

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
            element: (
              <PlaceholderPage
                title="AksiyonFutbol"
                description="Public landing page placeholder."
              />
            ),
          },
          {
            path: "login",
            element: (
              <PlaceholderPage
                title="Login"
                description="Login form placeholder."
              />
            ),
          },
          {
            path: "register",
            element: (
              <PlaceholderPage
                title="Register"
                description="Registration form placeholder."
              />
            ),
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
                    element: (
                      <PlaceholderPage
                        title="Create Club President"
                        description="President onboarding placeholder."
                      />
                    ),
                  },
                  {
                    path: "club",
                    element: (
                      <PlaceholderPage
                        title="Create Club"
                        description="Club onboarding placeholder."
                      />
                    ),
                  },
                ],
              },
              {
                element: <OnboardingGuard />,
                children: [
                  {
                    path: "dashboard",
                    element: (
                      <PlaceholderPage
                        title="Dashboard"
                        description="Authenticated game dashboard placeholder."
                      />
                    ),
                  },
                  {
                    path: "president",
                    element: (
                      <PlaceholderPage
                        title="My President"
                        description="Current president profile placeholder."
                      />
                    ),
                  },
                  {
                    path: "club",
                    element: (
                      <PlaceholderPage
                        title="My Club"
                        description="Current club overview placeholder."
                      />
                    ),
                  },
                  {
                    path: "squad",
                    element: (
                      <PlaceholderPage
                        title="Squad"
                        description="Current club squad placeholder."
                      />
                    ),
                  },
                  {
                    path: "league",
                    element: (
                      <PlaceholderPage
                        title="League"
                        description="League division table placeholder."
                      />
                    ),
                  },
                  {
                    path: "fixtures",
                    element: (
                      <PlaceholderPage
                        title="Fixtures & Results"
                        description="Club fixtures and match results placeholder."
                      />
                    ),
                  },
                  {
                    path: "matches/:id",
                    element: (
                      <PlaceholderPage
                        title="Match Detail"
                        description="Match score and event log placeholder."
                      />
                    ),
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
                element: (
                  <PlaceholderPage
                    title="Admin Dashboard"
                    description="Admin overview placeholder."
                  />
                ),
              },
              {
                path: "league-divisions",
                element: (
                  <PlaceholderPage
                    title="League Division Management"
                    description="Admin league division management placeholder."
                  />
                ),
              },
              {
                path: "base-players",
                element: (
                  <PlaceholderPage
                    title="Base Player Management"
                    description="Admin base player template management placeholder."
                  />
                ),
              },
              {
                path: "referees",
                element: (
                  <PlaceholderPage
                    title="Referee Management"
                    description="Admin referee management placeholder."
                  />
                ),
              },
              {
                path: "clubs",
                element: (
                  <PlaceholderPage
                    title="Club Management"
                    description="Admin club management placeholder."
                  />
                ),
              },
              {
                path: "player-instances",
                element: (
                  <PlaceholderPage
                    title="Player Instance Management"
                    description="Admin player instance management placeholder."
                  />
                ),
              },
              {
                path: "matches",
                element: (
                  <PlaceholderPage
                    title="Match Scheduling"
                    description="Admin match scheduling and simulation placeholder."
                  />
                ),
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
