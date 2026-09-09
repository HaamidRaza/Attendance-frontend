import { AlertTriangle, X } from "lucide-react";

export default function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div
      className="animate-fade-up flex items-start gap-2.5 rounded-lg border border-absent-600/30 bg-absent-50 text-absent-600 px-4 py-3 text-sm"
      style={{ animationDuration: "220ms" }}
    >
      <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
      <p className="m-0 flex-1">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          className="shrink-0 text-absent-600/70 hover:text-absent-600 transition-colors duration-150"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}