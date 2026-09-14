/**
 * Aggregates raw attendance history (from attendanceService.history())
 * into the shapes the dashboard charts need. Pure function — no fetching.
 */
export function aggregateAttendance(history = []) {
  // --- Weekly trend: sum present/total per calendar day ---
  const byDate = new Map();
  for (const session of history) {
    const dayKey = session.date?.slice(0, 10); // "2026-09-13"
    if (!dayKey) continue;
    const stats = session.statistics || {};
    const existing = byDate.get(dayKey) || { present: 0, total: 0 };
    existing.present += stats.present || 0;
    existing.total += stats.total || 0;
    byDate.set(dayKey, existing);
  }

  const weeklyTrend = Array.from(byDate.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-7)
    .map(([dayKey, { present, total }]) => ({
      date: new Date(dayKey).toLocaleDateString(undefined, {
        weekday: "short",
      }),
      percentage: total > 0 ? Math.round((present / total) * 100) : 0,
    }));

  // --- Today's breakdown: sum present/absent across sessions dated today ---
  const todayKey = new Date().toISOString().slice(0, 10);
  const todaysSessions = history.filter(
    (s) => s.date?.slice(0, 10) === todayKey,
  );
  const todayBreakdown = todaysSessions.reduce(
    (acc, s) => ({
      present: acc.present + (s.statistics?.present || 0),
      absent: acc.absent + (s.statistics?.absent || 0),
    }),
    { present: 0, absent: 0 },
  );

  // --- Per-class breakdown: each class's most recent session, worst first ---
  const latestByClass = new Map();
  for (const session of history) {
    const classId = session.classId?._id || session.classId?.id;
    if (!classId) continue;
    const existing = latestByClass.get(classId);
    if (!existing || new Date(session.date) > new Date(existing.date)) {
      latestByClass.set(classId, session);
    }
  }

  const classBreakdown = Array.from(latestByClass.values())
    .map((session) => ({
      className: session.classId?.name || "Unnamed class",
      section: session.classId?.section || "",
      percentage: Math.round(session.statistics?.percentage ?? 0),
      date: session.date,
    }))
    .sort((a, b) => a.percentage - b.percentage);

  return { weeklyTrend, todayBreakdown, classBreakdown };
}
