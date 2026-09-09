export default function StatCard({
  label,
  value,
  icon: Icon,
  tone = "default",
  style,
}) {
  const toneClasses = {
    default: "text-ink",
    brand: "text-brand-600",
    present: "text-present-600",
    absent: "text-absent-600",
  };

  return (
    <div
      className="animate-fade-up group flex items-center justify-between gap-4 rounded-xl border border-line
                 bg-surface px-5 py-4 transition-all duration-200
                 hover:border-line-strong hover:shadow-[0_4px_16px_-8px_rgba(15,17,8,0.12)] hover:-translate-y-0.5"
      style={style}
    >
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-sm text-slate truncate">{label}</span>
        <span
          className={`text-2xl font-semibold font-display ${toneClasses[tone]}`}
        >
          {value}
        </span>
      </div>
      {Icon && (
        <div
          className="hidden w-9 h-9 rounded-lg bg-brand-50 md:flex items-center justify-center shrink-0
                     transition-transform duration-200 group-hover:scale-110"
        >
          <Icon className="w-4.5 h-4.5 text-brand-600" strokeWidth={1.75} />
        </div>
      )}
    </div>
  );
}
