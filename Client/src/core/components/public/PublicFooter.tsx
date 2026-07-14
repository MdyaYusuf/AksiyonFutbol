import { NavLink } from "react-router-dom";

const footerLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "text-body-sm transition-colors",
    isActive
      ? "font-bold text-primary"
      : "text-on-surface-variant hover:text-on-surface",
  ].join(" ");

export const PublicFooter = () => {
  return (
    <footer className="relative z-20 mt-auto border-t border-surface-variant bg-surface-container-lowest px-8 py-8 lg:px-16">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
        <span className="text-body-sm text-on-surface-variant">
          © {new Date().getFullYear()} AksiyonFutbol. A Persistent Football Universe.
        </span>
        <nav className="flex gap-6">
          <NavLink to="/terms" className={footerLinkClass}>
            Terms
          </NavLink>
          <NavLink to="/privacy" className={footerLinkClass}>
            Privacy
          </NavLink>
          <NavLink to="/support" className={footerLinkClass}>
            Support
          </NavLink>
        </nav>
      </div>
    </footer>
  );
};
