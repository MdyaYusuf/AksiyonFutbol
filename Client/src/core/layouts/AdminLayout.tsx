import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AdminHeader } from "@/core/components/admin/AdminHeader";
import { AdminSidebar } from "@/core/components/admin/AdminSidebar";

export const AdminLayout = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-on-surface">
      <AdminSidebar
        mobileOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      <div className="flex min-h-0 flex-1 flex-col lg:ml-64">
        <AdminHeader onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden p-container-padding">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
