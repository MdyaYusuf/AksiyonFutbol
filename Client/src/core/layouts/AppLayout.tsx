import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AppHeader } from "../components/app/AppHeader";
import { AppSidebar } from "../components/app/AppSidebar";
import { useGetCurrentUserClubPresidentQuery } from "../../features/clubPresidents/clubPresidentsApiSlice";
import { useGetCurrentUserClubQuery } from "../../features/clubs/clubsApiSlice";

export const AppLayout = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { data: club } = useGetCurrentUserClubQuery();
  const { data: president } = useGetCurrentUserClubPresidentQuery();

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <AppSidebar
        divisionName={club?.divisionName}
        mobileOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      <div className="flex min-h-screen flex-col lg:pl-[280px]">
        <AppHeader
          cash={club?.cash}
          cashSpendLocked={club?.cashSpendLocked}
          reputation={president?.reputationPoints}
          onMenuClick={() => setMobileNavOpen(true)}
        />
        <main className="min-h-[calc(100vh-64px)] flex-1 p-gutter md:p-container-padding">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
