import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import BottomNav from "../components/layout/BottomNav";
import MoreSheet from "../components/layout/MoreSheet";
import { navItems } from "../components/layout/navConfig";

function pageTitle(pathname) {
  const match = navItems.find((item) =>
    item.to === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(item.to),
  );
  if (match)
    return match.label === "Take Attendance" && pathname !== "/attendance"
      ? "Attendance"
      : match.label;
  return "Attendance";
}

export default function DashboardLayout() {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar />
      <MoreSheet isOpen={isMoreOpen} onClose={() => setIsMoreOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title={pageTitle(location.pathname)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      <BottomNav
        onMoreClick={() => setIsMoreOpen(true)}
        isMoreOpen={isMoreOpen}
      />
    </div>
  );
}
