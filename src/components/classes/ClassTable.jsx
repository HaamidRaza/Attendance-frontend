import { Pencil, Trash2, GraduationCap, Users } from "lucide-react";
import { classLabel } from "../../utils/format";

function ClassActions({
  cls,
  onEdit,
  onDelete,
  onManageTeachers,
  size = "md",
}) {
  const pad = size === "lg" ? "p-2.5" : "p-2";
  const icon = size === "lg" ? "w-4.5 h-4.5" : "w-4 h-4";
  return (
    <>
      <button
        onClick={() => onManageTeachers(cls)}
        aria-label={`Manage teachers for ${classLabel(cls)}`}
        title="Manage teachers"
        className={`${pad} rounded-lg text-slate transition-colors duration-150 hover:text-brand-600 hover:bg-brand-50 active:scale-90`}
      >
        <Users className={icon} />
      </button>
      <button
        onClick={() => onEdit(cls)}
        aria-label={`Edit ${classLabel(cls)}`}
        title="Edit"
        className={`${pad} rounded-lg text-slate transition-colors duration-150 hover:text-brand-600 hover:bg-brand-50 active:scale-90`}
      >
        <Pencil className={icon} />
      </button>
      <button
        onClick={() => onDelete(cls)}
        aria-label={`Delete ${classLabel(cls)}`}
        title="Delete"
        className={`${pad} rounded-lg text-slate transition-colors duration-150 hover:text-absent-600 hover:bg-absent-50 active:scale-90`}
      >
        <Trash2 className={icon} />
      </button>
    </>
  );
}

export default function ClassTable({
  classes,
  onEdit,
  onDelete,
  onManageTeachers,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {classes.map((cls, index) => {
        const studentCount = cls.studentCount ?? 0;
        const teacherCount = cls.teachers?.length ?? 0;
        return (
          <div
            key={cls.id}
            className="rounded-xl border border-line bg-surface overflow-hidden animate-fade-up"
            style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}
          >
            <div className="flex items-start gap-3 p-4">
              <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                <GraduationCap
                  className="w-5 h-5 text-brand-600"
                  strokeWidth={1.75}
                />
              </div>
              <div className="min-w-0 flex-1">
                {/* Full name, wraps instead of truncating */}
                <p className="font-medium text-ink m-0 leading-snug break-words">
                  {classLabel(cls)}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-xs text-slate bg-canvas rounded-md px-1.5 py-0.5">
                    {studentCount} student{studentCount === 1 ? "" : "s"}
                  </span>
                  <span className="text-xs text-slate bg-canvas rounded-md px-1.5 py-0.5">
                    {teacherCount} teacher{teacherCount === 1 ? "" : "s"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-3 py-2 border-t border-line bg-canvas/40">
              <ClassActions
                cls={cls}
                onEdit={onEdit}
                onDelete={onDelete}
                onManageTeachers={onManageTeachers}
                size="lg"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
