import { ClipboardCheck } from "lucide-react";

export default function Navbar({ title }) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-2.5 h-16 px-4 sm:px-6 border-b border-line bg-surface/95 backdrop-blur">
      <div className="w-6 h-6 rounded-md bg-brand-500 flex items-center justify-center shrink-0 lg:hidden">
        <ClipboardCheck className="w-3.5 h-3.5 text-white" strokeWidth={2} />
      </div>
      <h1 className="text-[15px] font-semibold m-0 font-display">{title}</h1>
    </header>
  );
}
