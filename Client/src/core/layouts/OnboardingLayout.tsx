import { Outlet } from "react-router-dom";
import { MaterialIcon } from "../components/ui/MaterialIcon";

export const OnboardingLayout = () => {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(4,14,31,0.5)_0%,_#081425_50%,_#081425_100%)]" />
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary opacity-5 blur-[120px]" />
        <div className="absolute right-1/4 bottom-1/4 h-[500px] w-[500px] rounded-full bg-secondary opacity-5 blur-[140px]" />
      </div>

      <header className="sticky top-0 z-40 flex h-16 w-full items-center border-b border-outline-variant/30 bg-surface/50 px-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <MaterialIcon name="sports_soccer" className="text-primary" filled />
          <span className="text-headline-sm font-black tracking-tight text-primary">
            AksiyonFutbol
          </span>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  );
};
