// HistoryTable.jsx
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { formatDate, classLabel } from "../../utils/format";

export default function HistoryTable({ records }) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto rounded-xl border border-line bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-slate">
              <th className="font-medium px-4 py-3">Date</th>
              <th className="font-medium px-4 py-3">Class</th>
              <th className="font-medium px-4 py-3">Present</th>
              <th className="font-medium px-4 py-3">Absent</th>
              <th className="font-medium px-4 py-3">Total</th>
              <th className="font-medium px-4 py-3">Percentage</th>
              <th className="font-medium px-4 py-3">Taken By</th>
              <th className="font-medium px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr
                key={record.id}
                className="border-b border-line last:border-0 transition-colors duration-150 hover:bg-canvas/60"
              >
                <td className="px-4 py-3 text-ink">
                  {formatDate(record.date)}
                </td>
                <td className="px-4 py-3 text-slate">
                  {classLabel(record.classId)}
                </td>
                <td className="px-4 py-3 text-present-600 font-medium">
                  {record.statistics.present}
                </td>
                <td className="px-4 py-3 text-absent-600 font-medium">
                  {record.statistics.absent}
                </td>
                <td className="px-4 py-3 text-slate">
                  {record.statistics.total}
                </td>
                <td className="px-4 py-3 text-ink font-medium">
                  {record.statistics.percentage}%
                </td>
                <td className="px-4 py-3 text-slate">
                  {record.takenBy?.name || "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to={`/attendance/${record.id}`}
                    className="text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden flex flex-col gap-2.5">
        {records.map((record, index) => (
          <Link
            key={record.id}
            to={`/attendance/${record.id}`}
            className="group rounded-xl border border-line bg-surface p-4 flex items-center justify-between gap-3 animate-fade-up transition-all duration-150 active:scale-[0.98] active:bg-canvas/60"
            style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}
          >
            <div className="min-w-0">
              <p className="font-medium text-ink m-0 truncate">
                {classLabel(record.classId)}
              </p>
              <p className="text-sm text-slate mt-0.5 m-0">
                {formatDate(record.date)}
              </p>
              <p className="text-sm mt-1.5 m-0">
                <span className="text-present-600 font-medium">
                  {record.statistics.present} present
                </span>
                {" · "}
                <span className="text-absent-600 font-medium">
                  {record.statistics.absent} absent
                </span>
              </p>
              <p className="text-xs text-slate mt-1 m-0">
                Taken by {record.takenBy?.name || "—"}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-slate shrink-0">
              <span className="text-sm font-medium text-ink">
                {record.statistics.percentage}%
              </span>
              <ChevronRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
