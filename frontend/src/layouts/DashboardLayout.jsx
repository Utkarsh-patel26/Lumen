import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";
import Button from "../components/ui/Button.jsx";

const DashboardLayout = () => {
  const { role, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const navItems = role === "admin"
    ? [
        { to: "/dashboard/admin", label: "Overview" },
        { to: "/admin/courses/new", label: "Create Course" }
      ]
    : [
        { to: "/dashboard/student", label: "Overview" },
        { to: "/my-courses", label: "My Courses" },
        { to: "/courses", label: "Browse" }
      ];

  const onLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen">
      <div className="noise-overlay" />
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8 lg:flex-row">
        <aside className="glass w-full rounded-3xl p-6 lg:w-64">
          <div className="mb-6">
            <p className="text-xs uppercase text-slate-400">Account</p>
            <h2 className="text-lg font-semibold text-white">{user?.name || "Creator"}</h2>
            <p className="text-xs text-slate-400">{role}</p>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center rounded-2xl px-4 py-2 text-sm ${
                    isActive ? "bg-white/10 text-white" : "text-slate-300 hover:text-white"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-6">
            <Button variant="ghost" className="w-full" onClick={onLogout}>
              Log out
            </Button>
          </div>
        </aside>
        <section className="flex-1">
          <Outlet />
        </section>
      </div>
    </div>
  );
};

export default DashboardLayout;
