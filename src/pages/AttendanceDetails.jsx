import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import Button from "../components/common/Button";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorBanner from "../components/common/ErrorBanner";
import StatCard from "../components/common/StatCard";
import { attendanceService } from "../services/attendanceService";
import { formatDate, formatPercentage, classLabel } from "../utils/format";

export default function AttendanceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [record, setRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    attendanceService
      .getById(id)
      .then((data) => {
        if (isMounted) setRecord(data);
      })
      .catch((err) => {
        if (isMounted)
          setError(err?.message || "Couldn't load this attendance record.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [id]);

  function handleEdit() {
    if (!record) return;
    // Ensure we pass the class id (not whole object) and a plain
    // YYYY-MM-DD date string that the `<input type="date" />` expects.
    const classIdValue = record.classId?.id || record.classId;
    const toISODate = (d) => {
      if (!d) return "";
      if (typeof d === "string") return d.slice(0, 10);
      const parsed = new Date(d);
      if (Number.isNaN(parsed.getTime())) return "";
      const offset = parsed.getTimezoneOffset();
      const local = new Date(parsed.getTime() - offset * 60 * 1000);
      return local.toISOString().slice(0, 10);
    };

    navigate("/attendance", {
      state: { classId: classIdValue, date: toISODate(record.date) },
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <Link
        to="/attendance/history"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate hover:text-ink w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to history
      </Link>

      {error && <ErrorBanner message={error} onDismiss={() => setError("")} />}

      {isLoading ? (
        <LoadingSpinner label="Loading attendance…" />
      ) : record ? (
        <>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold m-0">
                {classLabel(record.classId)}
              </h1>
              <p className="text-sm text-slate mt-1 m-0">
                {formatDate(record.date)}
                {(record.takenByName || record.takenBy?.name) &&
                  ` · Taken by ${record.takenByName || record.takenBy?.name}`}
              </p>
            </div>
            <Button variant="secondary" icon={Pencil} onClick={handleEdit}>
              Edit
            </Button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard
              label="Present"
              value={record.statistics.present}
              tone="brand"
            />
            <StatCard
              label="Absent"
              value={record.statistics.absent}
              tone="absent"
            />
            <StatCard label="Total" value={record.statistics.total} />
            <StatCard
              label="Attendance %"
              value={record.statistics.percentage}
            />
          </div>

          <div className="overflow-x-auto rounded-xl border border-line bg-surface">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-slate">
                  <th className="font-medium px-4 py-3">Student</th>
                  <th className="font-medium px-4 py-3">Roll No.</th>
                  <th className="font-medium px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {(record.records || []).map((student) => (
                  <tr
                    key={student.studentId.id}
                    className="border-b border-line last:border-0"
                  >
                    <td className="px-4 py-3 font-medium text-ink">
                      {student.studentId.name}
                    </td>
                    <td className="px-4 py-3 text-slate">
                      {student.studentId.rollNumber}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                          student.status === "absent"
                            ? "bg-absent-50 text-absent-600"
                            : "bg-present-50 text-present-600"
                        }`}
                      >
                        {student.status === "absent" ? "Absent" : "Present"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </div>
  );
}
