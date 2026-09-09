import { NavLink } from "react-router-dom";
import { ClipboardCheck, LogOut } from "lucide-react";
import { navItems } from "./navConfig";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const visibleItems = navItems.filter((item) =>
    item.roles.includes(user?.role),
  );

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 border-r border-line bg-surface h-screen sticky top-0">
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-line">
        <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center shrink-0">
          <ClipboardCheck className="w-4.5 h-4.5 text-white" strokeWidth={2} />
        </div>
        <span className="font-display font-semibold text-[15px] tracking-tight">
          Attendance
        </span>
      </div>

      <nav className="flex-1 flex flex-col gap-1 p-3 overflow-y-auto">
        {visibleItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/dashboard" || to === "/attendance"}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-50 text-brand-600"
                  : "text-slate hover:bg-canvas hover:text-ink"
              }`
            }
          >
            <Icon className="w-4.5 h-4.5" strokeWidth={1.75} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-line">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-semibold shrink-0">
            {(user?.name || "U").slice(0, 1).toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium truncate">
              {user?.name || "Account"}
            </span>
            <span className="text-xs text-slate truncate">
              {user?.email || ""}
            </span>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full mt-1 flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-slate hover:bg-canvas hover:text-absent-600 transition-colors"
        >
          <LogOut className="w-4.5 h-4.5" strokeWidth={1.75} />
          Log out
        </button>
      </div>
    </aside>
  );
}
