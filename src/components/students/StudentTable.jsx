// StudentTable.jsx
import { Link } from "react-router-dom";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { classLabel } from "../../utils/format";

function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function RowActions({ student, onEdit, onDelete }) {
  return (
    <>
      <Link
        to={`/students/${student.id}`}
        aria-label={`View ${student.name}`}
        className="p-2 rounded-lg text-slate transition-colors duration-150 hover:text-brand-600 hover:bg-brand-50 active:scale-90"
      >
        <Eye className="w-4 h-4" />
      </Link>
      <button
        onClick={() => onEdit(student)}
        aria-label={`Edit ${student.name}`}
        className="p-2 rounded-lg text-slate transition-colors duration-150 hover:text-brand-600 hover:bg-brand-50 active:scale-90"
      >
        <Pencil className="w-4 h-4" />
      </button>
      <button
        onClick={() => onDelete(student)}
        aria-label={`Delete ${student.name}`}
        className="p-2 rounded-lg text-slate transition-colors duration-150 hover:text-absent-600 hover:bg-absent-50 active:scale-90"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </>
  );
}

export default function StudentTable({ students, onEdit, onDelete }) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto rounded-xl border border-line bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-slate">
              <th className="font-medium px-4 py-3">Name</th>
              <th className="font-medium px-4 py-3">Roll Number</th>
              <th className="font-medium px-4 py-3">Class</th>
              <th className="font-medium px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr
                key={student.id}
                className="border-b border-line last:border-0 transition-colors duration-150 hover:bg-canvas/60"
              >
                <td className="px-4 py-3 font-medium text-ink">
                  {student.name}
                </td>
                <td className="px-4 py-3 text-slate">{student.rollNumber}</td>
                <td className="px-4 py-3 text-slate">
                  {classLabel(student.classId)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <RowActions
                      student={student}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden flex flex-col gap-2.5">
        {students.map((student, index) => (
          <div
            key={student.id}
            className="rounded-xl border border-line bg-surface overflow-hidden animate-fade-up"
            style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}
          >
            <div className="flex items-center gap-3 p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 font-display font-semibold text-brand-700">
                {initials(student.name) || "?"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-ink m-0 truncate">
                  {student.name}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                  <span className="text-xs text-slate bg-canvas rounded-md px-1.5 py-0.5">
                    Roll {student.rollNumber}
                  </span>
                  <span className="text-xs text-slate bg-canvas rounded-md px-1.5 py-0.5 truncate max-w-[9rem]">
                    {classLabel(student.classId)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-1 px-3 py-2 border-t border-line bg-canvas/40">
              <RowActions
                student={student}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
