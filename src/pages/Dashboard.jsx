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
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";
import StatCard from "../components/common/StatCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorBanner from "../components/common/ErrorBanner";
import EmptyState from "../components/common/EmptyState";
import { dashboardService } from "../services/dashboardService";
import { useAttendanceOverview } from "../hooks/useAttendanceOverview";

const CHART_COLORS = {
  brand: "#3f7d33",
  absent: "#dc2626",
  amber: "#d97706",
  grid: "#e5e7eb",
};

const QUICK_ACTIONS = [
  { to: "/attendance", label: "Take Attendance", icon: ClipboardList, primary: true },
  { to: "/students", label: "Manage Students", icon: UserCog },
  { to: "/classes", label: "Manage Classes", icon: Layers },
  { to: "/attendance/history", label: "View Attendance", icon: History },
];

const TODAY = new Date().toLocaleDateString(undefined, {
  weekday: "long",
  month: "long",
  day: "numeric",
});

function ChartCard({ title, subtitle, children, delay = 0 }) {
  return (
    <div
      className="rounded-xl border border-line bg-surface p-4 sm:p-5 animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-ink m-0">{title}</h3>
        {subtitle && <p className="text-xs text-slate mt-0.5 m-0">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function TrendTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-line bg-surface px-3 py-2 shadow-sm text-xs">
      <p className="font-medium text-ink m-0">{label}</p>
      <p className="text-slate m-0">
        Attendance: <span className="text-ink font-medium">{payload[0].value}%</span>
      </p>
    </div>
  );
}

function ClassBarTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-lg border border-line bg-surface px-3 py-2 shadow-sm text-xs">
      <p className="font-medium text-ink m-0">
        {p.className}
        {p.section ? ` · ${p.section}` : ""}
      </p>
      <p className="text-slate m-0">
        {p.percentage}% on {new Date(p.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
      </p>
    </div>
  );
}

function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-line bg-surface px-3 py-2 shadow-sm text-xs">
      <p className="text-ink font-medium m-0">
        {payload[0].name}: {payload[0].value}
      </p>
    </div>
  );
}

function classBarColor(percentage) {
  if (percentage >= 90) return CHART_COLORS.brand;
  if (percentage >= 75) return CHART_COLORS.amber;
  return CHART_COLORS.absent;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const {
    weeklyTrend,
    todayBreakdown,
    classBreakdown,
    isLoading: isOverviewLoading,
    error: overviewError,
  } = useAttendanceOverview();

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    dashboardService
      .getStats()
      .then((data) => {
        if (isMounted) setStats(data);
      })
      .catch((err) => {
        if (isMounted) setError(err?.message || "Couldn't load dashboard statistics.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const pieData = todayBreakdown
    ? [
        { name: "Present", value: todayBreakdown.present, color: CHART_COLORS.brand },
        { name: "Absent", value: todayBreakdown.absent, color: CHART_COLORS.absent },
      ].filter((d) => d.value > 0)
    : [];

  const trendDelta =
    weeklyTrend.length >= 2
      ? weeklyTrend[weeklyTrend.length - 1].percentage - weeklyTrend[weeklyTrend.length - 2].percentage
      : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="animate-fade-up flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold m-0">Dashboard</h1>
          <p className="text-sm text-slate mt-1 m-0">Today's overview across your classes.</p>
        </div>
        <span className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-medium text-slate">
          <CalendarCheck2 className="w-3.5 h-3.5 text-brand-600" strokeWidth={2} />
          {TODAY}
        </span>
      </div>

      {error && <ErrorBanner message={error} onDismiss={() => setError("")} />}
      {overviewError && <ErrorBanner message={overviewError} onDismiss={() => {}} />}

      {isLoading ? (
        <LoadingSpinner label="Loading dashboard…" />
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard label="Total Students" value={stats?.totalStudents ?? 0} icon={Users} style={{ animationDelay: "40ms" }} />
            <StatCard label="Total Classes" value={stats?.totalClasses ?? 0} icon={GraduationCap} style={{ animationDelay: "90ms" }} />
            <StatCard
              label="Today's Attendance"
              value={stats?.todayAttendanceTaken ? "Taken" : "Not taken"}
              icon={CalendarCheck2}
              style={{ animationDelay: "140ms" }}
            />
            <StatCard
              label="Attendance %"
              value={stats?.todayAttendancePercentage != null ? `${stats.todayAttendancePercentage}%` : "—"}
              icon={Percent}
              tone="brand"
              style={{ animationDelay: "190ms" }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <ChartCard title="Attendance trend" subtitle="By day, most recent 7 days with records" delay={230}>
                {trendDelta !== null && (
                  <div className={`inline-flex items-center gap-1 text-xs font-medium mb-2 ${trendDelta >= 0 ? "text-brand-600" : "text-absent-600"}`}>
                    {trendDelta >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    {Math.abs(trendDelta)}% vs previous day
                  </div>
                )}
                {isOverviewLoading ? (
                  <LoadingSpinner label="Loading trend…" />
                ) : weeklyTrend.length < 2 ? (
                  <EmptyState icon={CalendarCheck2} title="Not enough data yet" description="Trend appears once a few days of attendance are recorded." />
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={weeklyTrend} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={CHART_COLORS.brand} stopOpacity={0.3} />
                          <stop offset="100%" stopColor={CHART_COLORS.brand} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
                      <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} width={36} />
                      <Tooltip content={<TrendTooltip />} />
                      <Area type="monotone" dataKey="percentage" stroke={CHART_COLORS.brand} strokeWidth={2} fill="url(#trendFill)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </ChartCard>
            </div>

            <ChartCard title="Today's breakdown" delay={260}>
              {isOverviewLoading ? (
                <LoadingSpinner label="Loading…" />
              ) : pieData.length === 0 ? (
                <EmptyState icon={Percent} title="No attendance yet" description="Take today's attendance to see the breakdown." />
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={75} paddingAngle={2}>
                      {pieData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                    <Legend verticalAlign="bottom" height={28} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </ChartCard>
          </div>

          <ChartCard title="Attendance by class" subtitle="Most recent session per class · red under 75%, amber under 90%" delay={290}>
            {isOverviewLoading ? (
              <LoadingSpinner label="Loading…" />
            ) : classBreakdown.length === 0 ? (
              <EmptyState icon={Layers} title="No class data yet" description="Take attendance for a class to see it here." />
            ) : (
              <ResponsiveContainer width="100%" height={Math.max(180, classBreakdown.length * 40)}>
                <BarChart data={classBreakdown} layout="vertical" margin={{ top: 0, right: 24, left: -30, bottom: 0 }}>
                  <CartesianGrid stroke={CHART_COLORS.grid} horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="className" tick={{ fontSize: 12, fill: "#374151" }} axisLine={false} tickLine={false} width={110} />
                  <Tooltip content={<ClassBarTooltip />} />
                  <Bar dataKey="percentage" radius={[0, 4, 4, 0]} barSize={18}>
                    {classBreakdown.map((entry) => (
                      <Cell key={entry.className + entry.date} fill={classBarColor(entry.percentage)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <div className="animate-fade-up" style={{ animationDelay: "320ms" }}>
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
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110 ${primary ? "bg-white/15" : "bg-brand-50"}`}>
                    <Icon className={`w-4.5 h-4.5 ${primary ? "text-white" : "text-brand-600"}`} strokeWidth={1.75} />
                  </div>
                  <span className={`text-sm font-medium ${primary ? "text-white" : "text-ink"}`}>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}