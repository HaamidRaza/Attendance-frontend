import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary:
    "bg-brand-500 text-white border border-brand-500 shadow-[0_1px_2px_rgba(15,17,8,0.06)] hover:bg-brand-600 hover:border-brand-600 hover:shadow-[0_4px_12px_-4px_rgba(42,114,33,0.4)] disabled:bg-brand-500/50 disabled:border-brand-500/50 disabled:shadow-none",
  secondary:
    "bg-surface text-ink border border-line hover:border-line-strong hover:bg-canvas disabled:opacity-50",
  danger:
    "bg-surface text-absent-600 border border-absent-600/40 hover:bg-absent-50 disabled:opacity-50",
  ghost:
    "bg-transparent text-slate border border-transparent hover:bg-canvas disabled:opacity-50",
};

const SIZES = {
  sm: "text-sm px-3 py-1.5 gap-1.5",
  md: "text-sm px-4 py-2.5 gap-2",
  lg: "text-base px-5 py-3 gap-2",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  loadingText,
  icon: Icon,
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center cursor-pointer rounded-lg font-medium transition-all duration-150 active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100 whitespace-nowrap ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {loadingText || "Please wait…"}
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4" strokeWidth={2} />}
          {children}
        </>
      )}
    </button>
  );
}