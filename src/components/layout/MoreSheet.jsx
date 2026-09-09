import { NavLink } from "react-router-dom";
import { LogOut, X } from "lucide-react";
import { navItems } from "./navConfig";
import { useAuth } from "../../context/AuthContext";

const MAX_VISIBLE = 3;

export default function MoreSheet({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const visibleItems = navItems.filter((item) =>
    item.roles.includes(user?.role),
  );
  const overflowItems = visibleItems.slice(MAX_VISIBLE);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-ink/40 animate-fade-up"
        style={{ animationDuration: "180ms" }}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="absolute left-0 right-0 bottom-0 bg-surface border-t border-line rounded-t-2xl
                   flex flex-col max-h-[75vh] animate-sheet-up"
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-line shrink-0">
          <span className="font-display font-semibold text-[15px] tracking-tight">
            Menu
          </span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-1.5 -mr-1.5 text-slate hover:text-ink rounded-lg hover:bg-canvas transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto">
          {overflowItems.length > 0 && (
            <nav className="flex flex-col gap-1 p-3">
              {overflowItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
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
          )}

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
              className="w-full mt-1 flex items-center gap-2.5 rounded-lg px-3 py-3 text-sm font-medium text-slate hover:bg-canvas hover:text-absent-600 transition-colors"
            >
              <LogOut className="w-4.5 h-4.5" strokeWidth={1.75} />
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
