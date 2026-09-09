import { ChevronDown } from "lucide-react";

export default function Select({
  label,
  error,
  options = [],
  placeholder = "Select…",
  className = "",
  id,
  ...props
}) {
  const selectId = id || props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={`w-full appearance-none rounded-lg border bg-surface text-ink px-3.5 py-2.5 pr-9 text-sm outline-none transition-colors ${
            error
              ? "border-absent-600/60 focus:border-absent-600"
              : "border-line focus:border-brand-500"
          } ${className}`}
          {...props}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-mist absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
      {error && <span className="text-xs text-absent-600">{error}</span>}
    </div>
  );
}
