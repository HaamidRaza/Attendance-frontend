import { NavLink } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { navItems } from "./navConfig";
import { useAuth } from "../../context/AuthContext";

const MAX_VISIBLE = 3;

export default function BottomNav({ onMoreClick, isMoreOpen }) {
  const { user } = useAuth();
  const visibleItems = navItems.filter((item) =>
    item.roles.includes(user?.role),
  );
  const primary = visibleItems.slice(0, MAX_VISIBLE);

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-surface border-t border-line
                 pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="flex items-stretch justify-around">
        {primary.map(({ to, label, mobileLabel, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === "/dashboard" || to === "/attendance"}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors duration-150 ${
                  isActive ? "text-brand-600" : "text-mist hover:text-slate"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`absolute top-0 h-0.5 w-8 rounded-full bg-brand-500 transition-all duration-200 ${
                      isActive
                        ? "opacity-100 scale-x-100"
                        : "opacity-0 scale-x-0"
                    }`}
                  />
                  <Icon
                    className={`w-5 h-5 transition-transform duration-150 ${isActive ? "scale-105" : ""}`}
                    strokeWidth={isActive ? 2.25 : 1.75}
                  />
                  <span className="leading-none">{mobileLabel || label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}

        <li className="flex-1">
          <button
            onClick={onMoreClick}
            className={`w-full relative flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors duration-150 ${
              isMoreOpen ? "text-brand-600" : "text-mist hover:text-slate"
            }`}
          >
            <span
              className={`absolute top-0 h-0.5 w-8 rounded-full bg-brand-500 transition-all duration-200 ${
                isMoreOpen ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
              }`}
            />
            <MoreHorizontal
              className={`w-5 h-5 transition-transform duration-150 ${isMoreOpen ? "scale-105" : ""}`}
              strokeWidth={isMoreOpen ? 2.25 : 1.75}
            />
            <span className="leading-none">More</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
