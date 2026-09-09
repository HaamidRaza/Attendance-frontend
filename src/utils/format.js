export function formatDate(dateInput) {
  if (!dateInput) return "";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function todayISO() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 10);
}

export function formatPercentage(present, total) {
  if (!total) return "0.0%";
  return `${((present / total) * 100).toFixed(1)}%`;
}

export function classLabel(cls) {
  if (!cls) return "";
  return cls.section ? `${cls.name} - ${cls.section}` : cls.name;
}
