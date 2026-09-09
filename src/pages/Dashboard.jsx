import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  GraduationCap,
  CalendarCheck2,
  Percent,
  ClipboardList,
  UserCog,
  Layers,
  History,
} from "lucide-react";
import StatCard from "../components/common/StatCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorBanner from "../components/common/ErrorBanner";
import { dashboardService } from "../services/dashboardService";

const QUICK_ACTIONS = [
  {
    to: "/attendance",
    label: "Take Attendance",
    icon: ClipboardList,
    primary: true,
  },
  { to: "/students", label: "Manage Students", icon: UserCog },
  { to: "/classes", label: "Manage Classes", icon: Layers },
  { to: "/attendance/history", label: "View Attendance", icon: History },
];

const TODAY = new Date().toLocaleDateString(undefined, {
  weekday: "long",
  month: "long",
  day: "numeric",
});

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    dashboardService
      .getStats()
      .then((data) => {
        if (isMounted) setStats(data);
      })
      .catch((err) => {
        if (isMounted)
          setError(err?.message || "Couldn't load dashboard statistics.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="animate-fade-up flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold m-0">Dashboard</h1>
          <p className="text-sm text-slate mt-1 m-0">
            Today's overview across your classes.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-medium text-slate">
          <CalendarCheck2
            className="w-3.5 h-3.5 text-brand-600"
            strokeWidth={2}
          />
          {TODAY}
        </span>
      </div>

      {error && <ErrorBanner message={error} onDismiss={() => setError("")} />}

      {isLoading ? (
        <LoadingSpinner label="Loading dashboard…" />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            label="Total Students"
            value={stats?.totalStudents ?? 0}
            icon={Users}
            style={{ animationDelay: "40ms" }}
          />
          <StatCard
            label="Total Classes"
            value={stats?.totalClasses ?? 0}
            icon={GraduationCap}
            style={{ animationDelay: "90ms" }}
          />
          <StatCard
            label="Today's Attendance"
            value={stats?.todayAttendanceTaken ? "Taken" : "Not taken"}
            icon={CalendarCheck2}
            style={{ animationDelay: "140ms" }}
          />
          <StatCard
            label="Attendance %"
            value={
              stats?.todayAttendancePercentage != null
                ? `${stats.todayAttendancePercentage}%`
                : "—"
            }
            icon={Percent}
            tone="brand"
            style={{ animationDelay: "190ms" }}
          />
        </div>
      )}

      <div className="animate-fade-up" style={{ animationDelay: "220ms" }}>
        <h2 className="text-base font-semibold mb-3">Quick actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map(({ to, label, icon: Icon, primary }) => (
            <button
              key={to}
              onClick={() => navigate(to)}
              className={`group flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-4 text-left transition-all duration-200 active:scale-[0.98] ${
                primary
                  ? "border-brand-500 bg-brand-500 text-white shadow-[0_1px_2px_rgba(15,17,8,0.06)] hover:bg-brand-600 hover:border-brand-600 hover:shadow-[0_6px_16px_-6px_rgba(42,114,33,0.4)]"
                  : "border-line bg-surface hover:border-line-strong hover:bg-canvas hover:-translate-y-0.5"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  primary ? "bg-white/15" : "bg-brand-50"
                }`}
              >
                <Icon
                  className={`w-4.5 h-4.5 ${primary ? "text-white" : "text-brand-600"}`}
                  strokeWidth={1.75}
                />
              </div>
              <span
                className={`text-sm font-medium ${primary ? "text-white" : "text-ink"}`}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
