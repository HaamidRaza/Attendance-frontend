export default function Input({
  label,
  error,
  icon: Icon,
  rightIcon: RightIcon,
  onRightIconClick,
  rightIconLabel,
  className = "",
  id,
  ...props
}) {
  const inputId = id || props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="w-4 h-4 text-mist absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors" />
        )}
        <input
          id={inputId}
          className={`w-full rounded-lg border bg-surface text-ink placeholder:text-mist px-3.5 py-2.5 text-sm outline-none transition-all duration-150 ${
            Icon ? "pl-9" : ""
          } ${RightIcon ? "pr-10" : ""} ${
            error
              ? "border-absent-600/60 focus:border-absent-600 focus:ring-4 focus:ring-absent-600/10"
              : "border-line focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
          } ${className}`}
          {...props}
        />
        {RightIcon && (
          <button
            type="button"
            tabIndex={-1}
            onClick={onRightIconClick}
            aria-label={rightIconLabel}
            className="absolute right-3 top-1/2 cursor-pointer -translate-y-1/2 text-mist hover:text-slate
                       transition-colors duration-150 focus-visible:outline-none focus-visible:text-brand-600"
          >
            <RightIcon className="w-4 h-4" strokeWidth={2} />
          </button>
        )}
      </div>
      {error && (
        <span className="text-xs text-absent-600 animate-fade-up" style={{ animationDuration: "180ms" }}>
          {error}
        </span>
      )}
    </div>
  );
}