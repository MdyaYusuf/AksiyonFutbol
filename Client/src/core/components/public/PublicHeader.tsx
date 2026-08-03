import { Link, NavLink } from "react-router-dom";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "text-body-lg transition-opacity",
    isActive
      ? "border-b-2 border-primary pb-1 text-primary"
      : "text-on-surface-variant hover:text-primary",
  ].join(" ");

export const PublicHeader = () => {
  return (
    <header className="sticky top-0 z-40 w-full bg-surface-container-lowest shadow-sm">
      <div className="flex w-full items-center justify-between px-8 py-4">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="text-headline-md font-extrabold tracking-tight text-primary"
          >
            AksiyonFutbol
          </Link>
          <nav className="hidden gap-6 md:flex">
            <NavLink to="/login" className={navLinkClass}>
              Login
            </NavLink>
            <NavLink to="/register" className={navLinkClass}>
              Register
            </NavLink>
          </nav>
        </div>
        <Link
          to="/register"
          className="rounded bg-primary-container px-6 py-2 text-headline-sm text-on-primary-container transition-opacity hover:opacity-90"
        >
          Join Now
        </Link>
      </div>
    </header>
  );
};
