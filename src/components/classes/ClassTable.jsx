import { Pencil, Trash2, GraduationCap } from "lucide-react";
import { classLabel } from "../../utils/format";

export default function ClassTable({ classes, onEdit, onDelete }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {classes.map((cls, index) => (
        <div
          key={cls.id}
          className="group rounded-xl border border-line bg-surface p-4 flex items-start justify-between gap-3 animate-fade-up transition-all duration-150 hover:border-line-strong hover:shadow-sm"
          style={{ animationDelay: `${Math.min(index * 40, 320)}ms` }}
        >
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center shrink-0 transition-transform duration-150 group-hover:scale-105">
              <GraduationCap className="w-4.5 h-4.5 text-brand-600" strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-ink m-0 truncate">{classLabel(cls)}</p>
              <p className="text-sm text-slate mt-0.5 m-0">
                {cls.studentCount ?? 0} student{cls.studentCount === 1 ? "" : "s"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onEdit(cls)}
              aria-label={`Edit ${classLabel(cls)}`}
              className="p-2 rounded-lg text-slate transition-colors duration-150 hover:text-brand-600 hover:bg-brand-50 active:scale-90"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(cls)}
              aria-label={`Delete ${classLabel(cls)}`}
              className="p-2 rounded-lg text-slate transition-colors duration-150 hover:text-absent-600 hover:bg-absent-50 active:scale-90"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}