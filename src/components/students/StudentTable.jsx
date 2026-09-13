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

function RowActions({ student, onEdit, onDelete, size = "md" }) {
  const pad = size === "lg" ? "p-2.5" : "p-2";
  const icon = size === "lg" ? "w-4.5 h-4.5" : "w-4 h-4";
  return (
    <>
      <Link
        to={`/students/${student.id}`}
        aria-label={`View ${student.name}`}
        title="View"
        className={`${pad} rounded-lg text-slate transition-colors duration-150 hover:text-brand-600 hover:bg-brand-50 active:scale-90`}
      >
        <Eye className={icon} />
      </Link>
      <button
        onClick={() => onEdit(student)}
        aria-label={`Edit ${student.name}`}
        title="Edit"
        className={`${pad} rounded-lg text-slate transition-colors duration-150 hover:text-brand-600 hover:bg-brand-50 active:scale-90`}
      >
        <Pencil className={icon} />
      </button>
      <button
        onClick={() => onDelete(student)}
        aria-label={`Delete ${student.name}`}
        title="Delete"
        className={`${pad} rounded-lg text-slate transition-colors duration-150 hover:text-absent-600 hover:bg-absent-50 active:scale-90`}
      >
        <Trash2 className={icon} />
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
            <div className="flex items-start gap-3 p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 font-display font-semibold text-brand-700">
                {initials(student.name) || "?"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-ink m-0 truncate">
                    {student.name}
                  </p>
                  <span className="shrink-0 text-xs text-slate bg-canvas rounded-md px-1.5 py-0.5">
                    Roll {student.rollNumber}
                  </span>
                </div>
                {/* Full width, wraps instead of truncating — class + time
                    is exactly the info a parent/teacher scans for. */}
                <p className="text-xs text-slate mt-1.5 m-0 leading-snug">
                  {classLabel(student.classId)}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-3 py-2 border-t border-line bg-canvas/40">
              <RowActions
                student={student}
                onEdit={onEdit}
                onDelete={onDelete}
                size="lg"
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
