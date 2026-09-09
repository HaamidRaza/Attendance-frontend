import { Check, X } from "lucide-react";
import StatusToggle from "./StatusToggle";

function AttendanceCircle({ status, onChange, disabled }) {
  const isPresent = status === "present";
  const isAbsent = status === "absent";

  function handleTap() {
    if (disabled) return;
    // One tap → present. Next tap → absent. Cycles from there.
    onChange(isPresent ? "absent" : "present");
  }

  return (
    <button
      type="button"
      onClick={handleTap}
      disabled={disabled}
      aria-pressed={isPresent}
      aria-label={
        isPresent
          ? "Marked present — tap to mark absent"
          : isAbsent
            ? "Marked absent — tap to mark present"
            : "Tap to mark present"
      }
      className={[
        "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2",
        "transition-all duration-200 ease-out active:scale-90",
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer hover:border-brand-500/60",
        isPresent
          ? "bg-brand-500 border-brand-500"
          : isAbsent
            ? "bg-absent-50 border-absent-600"
            : "bg-surface border-line-strong",
      ].join(" ")}
    >
      {/* key remounts the icon on status change so it replays the pop-in */}
      <span
        key={status || "empty"}
        className="flex items-center justify-center animate-scale-in"
      >
        {isPresent && <Check className="h-5 w-5 text-white" strokeWidth={3} />}
        {isAbsent && <X className="h-5 w-5 text-absent-600" strokeWidth={3} />}
      </span>
    </button>
  );
}

export default function AttendanceTable({
  students,
  statuses,
  onStatusChange,
  disabled,
}) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto rounded-xl border border-line bg-surface">
        <table className="w-full text-sm text-center">
          <thead>
            <tr className="border-b border-line text-slate">
              <th className="font-medium px-4 py-3">Student</th>
              <th className="font-medium px-4 py-3">Roll No.</th>
              <th className="font-medium px-4 py-3">Attendance</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr
                key={student.id}
                className="border-b border-line last:border-0"
              >
                <td className="px-4 py-3 font-medium text-ink">
                  {student.name}
                </td>
                <td className="px-4 py-3 text-slate">{student.rollNumber}</td>
                <td className="px-4 py-3">
                  <StatusToggle
                    status={statuses[student.id]}
                    onChange={(status) => onStatusChange(student.id, status)}
                    disabled={disabled}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden flex flex-col gap-2.5">
        <div className="flex items-center justify-end gap-3 px-1 text-xs text-mist">
          <span className="flex items-center gap-1">
            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-brand-500">
              <Check className="h-2.5 w-2.5 text-white" strokeWidth={4} />
            </span>
            Present
          </span>
          <span className="flex items-center gap-1">
            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-absent-600 bg-absent-50">
              <X className="h-2.5 w-2.5 text-absent-600" strokeWidth={4} />
            </span>
            Absent
          </span>
        </div>

        {students.map((student, index) => (
          <div
            key={student.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface p-4 animate-fade-up"
            style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}
          >
            <div className="min-w-0">
              <p className="font-medium text-ink m-0 truncate">
                {student.name}
              </p>
              <p className="text-sm text-slate mt-0.5 m-0">
                Roll No: {student.rollNumber}
              </p>
            </div>
            <AttendanceCircle
              status={statuses[student.id]}
              onChange={(status) => onStatusChange(student.id, status)}
              disabled={disabled}
            />
          </div>
        ))}
      </div>
    </>
  );
}
