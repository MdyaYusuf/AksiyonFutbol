import { Link, Outlet } from "react-router-dom";

export const AdminLayout = () => {
  return (
    <section>
      <nav>
        <Link to="/app/dashboard">App</Link>{" | "}
        <Link to="/admin">Admin Dashboard</Link>{" | "}
        <Link to="/admin/league-divisions">League Divisions</Link>{" | "}
        <Link to="/admin/base-players">Base Players</Link>{" | "}
        <Link to="/admin/referees">Referees</Link>{" | "}
        <Link to="/admin/clubs">Clubs</Link>{" | "}
        <Link to="/admin/player-instances">Player Instances</Link>{" | "}
        <Link to="/admin/matches">Matches</Link>
      </nav>
      <Outlet />
    </section>
  );
};
