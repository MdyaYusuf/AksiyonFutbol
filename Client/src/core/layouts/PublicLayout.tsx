import { Outlet } from "react-router-dom";
import { PublicFooter } from "@/core/components/public/PublicFooter";
import { PublicHeader } from "@/core/components/public/PublicHeader";

export const PublicLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex flex-grow flex-col">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};
