export default function SummaryBar({ present, absent, total }) {
  return (
    <div className="flex items-center justify-center px-3.5 py-2 gap-5 md:gap-8 md:px-5 md:py-4 rounded-xl border border-line bg-surface">
      <div className="flex flex-col items-center">
        <span className="text-xs text-slate">Present</span>
        <span className="text-lg font-semibold font-display text-present-600">
          {present}
        </span>
      </div>
      <div className="w-px h-8 bg-line" />
      <div className="flex flex-col  items-center">
        <span className="text-xs text-slate">Absent</span>
        <span className="text-lg font-semibold font-display text-absent-600">
          {absent}
        </span>
      </div>
      <div className="w-px h-8 bg-line" />
      <div className="flex flex-col items-center">
        <span className="text-xs text-slate">Total</span>
        <span className="text-lg font-semibold font-display text-ink">
          {total}
        </span>
      </div>
    </div>
  );
}
