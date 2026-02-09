import { Outlet, Link, NavLink } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import { useAuthStore } from "../store/authStore.js";

const PublicLayout = () => {
  const { token, role } = useAuthStore();
  return (
    <div className="relative min-h-screen">
      <div className="noise-overlay" />
      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-xl font-semibold text-white">
            Lumen
          </Link>
          <div className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <NavLink to="/courses" className="hover:text-white">
              Courses
            </NavLink>
            <NavLink to="/" className="hover:text-white">
              Why Us
            </NavLink>
            <NavLink to="/pricing" className="hover:text-white">
              Pricing
            </NavLink>
          </div>
          <div className="flex items-center gap-3">
            {token ? (
              <Link to={role === "admin" ? "/dashboard/admin" : "/dashboard/student"}>
                <Button size="sm">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Get started</Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Outlet />
      </main>
      <footer className="mx-auto max-w-6xl px-6 py-10 text-sm text-slate-400">
        Built for creators and learners. Ship courses faster with Lumen.
      </footer>
    </div>
  );
};

export default PublicLayout;
