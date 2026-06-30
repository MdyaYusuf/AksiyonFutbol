import { Link, Outlet } from "react-router-dom";

export const PublicLayout = () => {
  return (
    <section>
      <nav>
        <Link to="/">AksiyonFutbol</Link>{" | "}
        <Link to="/login">Login</Link>{" | "}
        <Link to="/register">Register</Link>
      </nav>
      <Outlet />
    </section>
  );
};
