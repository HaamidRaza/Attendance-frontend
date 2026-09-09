import { useEffect } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isError = toast.type === "error";

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0 z-50">
      <div
        className={`flex items-center gap-2.5 rounded-lg border px-4 py-3 text-sm shadow-lg bg-surface ${
          isError ? "border-absent-600/30 text-absent-600" : "border-brand-500/30 text-brand-600"
        }`}
      >
        {isError ? (
          <XCircle className="w-4 h-4 shrink-0" />
        ) : (
          <CheckCircle2 className="w-4 h-4 shrink-0" />
        )}
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
