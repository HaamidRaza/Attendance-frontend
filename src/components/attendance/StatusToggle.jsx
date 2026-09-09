export default function StatusToggle({ status, onChange, disabled }) {
  return (
    <div className="inline-flex rounded-lg border border-line p-0.5 bg-canvas">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange("present")}
        className={`px-3.5 py-2 sm:py-1.5 text-sm cursor-pointer font-medium rounded-md transition-colors ${
          status === "present"
            ? "bg-present-600 text-white"
            : "text-slate hover:text-ink"
        }`}
      >
        Present
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange("absent")}
        className={`px-3.5 py-2 sm:py-1.5 text-sm font-medium cursor-pointer rounded-md transition-colors ${
          status === "absent"
            ? "bg-absent-600 text-white"
            : "text-slate hover:text-ink"
        }`}
      >
        Absent
      </button>
    </div>
  );
}
