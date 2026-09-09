import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ label = "Loading…", className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-2 py-12 text-slate ${className}`}>
      <Loader2 className="w-5 h-5 animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
