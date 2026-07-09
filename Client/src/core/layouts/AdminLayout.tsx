import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AdminHeader } from "../components/admin/AdminHeader";
import { AdminSidebar } from "../components/admin/AdminSidebar";

export const AdminLayout = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <AdminSidebar
        mobileOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      <div className="flex min-h-screen flex-col lg:ml-64">
        <AdminHeader onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1 overflow-y-auto p-container-padding">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
