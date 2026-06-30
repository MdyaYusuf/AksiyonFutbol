import { Link, Outlet } from "react-router-dom";

export const AppLayout = () => {
  return (
    <section>
      <nav>
        <Link to="/app/dashboard">Dashboard</Link>{" | "}
        <Link to="/app/president">President</Link>{" | "}
        <Link to="/app/club">Club</Link>{" | "}
        <Link to="/app/squad">Squad</Link>{" | "}
        <Link to="/app/league">League</Link>{" | "}
        <Link to="/app/fixtures">Fixtures</Link>{" | "}
        <Link to="/admin">Admin</Link>
      </nav>
      <Outlet />
    </section>
  );
};
