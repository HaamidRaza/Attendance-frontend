import { useEffect, useState, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Users, CheckCheck, XCircle } from "lucide-react";
import Button from "../components/common/Button";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";
import ErrorBanner from "../components/common/ErrorBanner";
import Toast from "../components/common/Toast";
import ClassDateSelector from "../components/attendance/ClassDateSelector";
import AttendanceTable from "../components/attendance/AttendanceTable";
import SummaryBar from "../components/attendance/SummaryBar";
import { classService } from "../services/classService";
import { attendanceService } from "../services/attendanceService";
import { useToast } from "../hooks/useToast";
import { todayISO, classLabel } from "../utils/format";

const ATTENDANCE_EDIT_WINDOW_DAYS = 30; // keep in sync with the backend limit

function earliestAllowedISO() {
  const d = new Date();
  d.setDate(d.getDate() - ATTENDANCE_EDIT_WINDOW_DAYS);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 10);
}

export default function Attendance() {
  const location = useLocation();
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState(location.state?.classId || "");
  const [date, setDate] = useState(location.state?.date || todayISO());

  const [students, setStudents] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [existingRecordId, setExistingRecordId] = useState(null);

  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const { toast, showToast, clearToast } = useToast();

  useEffect(() => {
    classService
      .list()
      .then((data) => setClasses(data?.classes || data || []))
      .catch((err) => setError(err?.message || "Couldn't load classes."))
      .finally(() => setIsLoadingClasses(false));
  }, []);

  const classOptions = classes.map((c) => ({
    value: c.id,
    label: classLabel(c),
  }));

  const loadStudentsAndAttendance = useCallback(async () => {
    if (!classId || !date) return;
    setIsLoadingStudents(true);
    setError("");
    setExistingRecordId(null);
    try {
      const [studentData, attendanceData] = await Promise.all([
        classService.students(classId),
        attendanceService.getForClassAndDate(classId, date).catch(() => null),
      ]);

      const studentList = studentData?.students || studentData || [];
      setStudents(studentList);

      const existingRecords = attendanceData?.records || [];
      const existingMap = Object.fromEntries(
        existingRecords.map((r) => [r.studentId, r.status]),
      );

      // Default every student to Present unless an existing record says otherwise.
      const initialStatuses = {};
      studentList.forEach((student) => {
        initialStatuses[student.id] = existingMap[student.id] || "present";
      });
      setStatuses(initialStatuses);

      if (attendanceData?.id) {
        setExistingRecordId(attendanceData.id);
      }
    } catch (err) {
      setError(err?.message || "Couldn't load students for this class.");
      setStudents([]);
    } finally {
      setIsLoadingStudents(false);
    }
  }, [classId, date]);

  useEffect(() => {
    loadStudentsAndAttendance();
  }, [loadStudentsAndAttendance]);

  function handleStatusChange(studentId, status) {
    setStatuses((prev) => ({ ...prev, [studentId]: status }));
  }

  function markAll(status) {
    setStatuses((prev) => {
      const next = { ...prev };
      students.forEach((s) => {
        next[s.id] = status;
      });
      return next;
    });
  }

  const { presentCount, absentCount } = useMemo(() => {
    let present = 0;
    let absent = 0;
    students.forEach((s) => {
      if (statuses[s.id] === "absent") absent += 1;
      else present += 1;
    });
    return { presentCount: present, absentCount: absent };
  }, [students, statuses]);

  async function handleSave() {
    if (!classId || !date || students.length === 0 || isSaving) return;
    setIsSaving(true);
    setError("");
    const records = students.map((s) => ({
      studentId: s.id,
      status: statuses[s.id] || "present",
    }));

    try {
      if (existingRecordId) {
        await attendanceService.update(existingRecordId, {
          classId,
          date,
          records,
        });
      } else {
        await attendanceService.save({ classId, date, records });
      }
      showToast("Attendance saved successfully.");
      loadStudentsAndAttendance();
    } catch (err) {
      showToast(err?.message || "Couldn't save attendance.", "error");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-5 pb-40 sm:pb-6">
      <div className="hidden md:block animate-fade-up">
        <h1 className="text-xl font-semibold font-display m-0">
          Take Attendance
        </h1>
        <p className="text-sm text-slate mt-1 m-0">
          Students default to Present — tap to mark anyone absent.
        </p>
      </div>

      {isLoadingClasses ? (
        <LoadingSpinner label="Loading classes…" />
      ) : (
        <div className="animate-fade-up" style={{ animationDelay: "60ms" }}>
          <ClassDateSelector
            classOptions={classOptions}
            classId={classId}
            date={date}
            onClassChange={setClassId}
            onDateChange={setDate}
            maxDate={todayISO()}
            minDate={earliestAllowedISO()}
          />
        </div>
      )}

      {error && (
        <div className="animate-fade-up">
          <ErrorBanner message={error} onDismiss={() => setError("")} />
        </div>
      )}

      {!classId ? (
        <div className="rounded-xl border border-line bg-surface animate-fade-up">
          <EmptyState
            icon={Users}
            title="Select a class to begin."
            description="Choose a class and date above to load its students."
          />
        </div>
      ) : isLoadingStudents ? (
        <LoadingSpinner label="Loading students…" />
      ) : students.length === 0 ? (
        <div className="rounded-xl border border-line bg-surface animate-fade-up">
          <EmptyState
            icon={Users}
            title="No students in this class."
            description="Add students to this class before taking attendance."
          />
        </div>
      ) : (
        <>
          {existingRecordId && (
            <div className="animate-fade-up">
              <ErrorBanner message="Attendance already exists for this class and date. Saving will update it." />
            </div>
          )}

          <div
            className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between animate-fade-up"
            style={{ animationDelay: "100ms" }}
          >
            <SummaryBar
              present={presentCount}
              absent={absentCount}
              total={students.length}
            />
            <div className="flex md:flex-col items-center gap-2 w-auto">
              <Button
                variant="secondary"
                size="sm"
                icon={CheckCheck}
                onClick={() => markAll("present")}
                className="w-full sm:w-auto justify-center"
              >
                <span className="sm:hidden">All Present</span>
                <span className="hidden sm:inline">Mark All Present</span>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                icon={XCircle}
                onClick={() => markAll("absent")}
                className="w-full sm:w-auto justify-center"
              >
                <span className="sm:hidden">All Absent</span>
                <span className="hidden sm:inline">Mark All Absent</span>
              </Button>
            </div>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: "140ms" }}>
            <AttendanceTable
              students={students}
              statuses={statuses}
              onStatusChange={handleStatusChange}
              disabled={isSaving}
            />
          </div>

          {/* Desktop save button */}
          <div className="hidden sm:flex justify-end">
            <Button
              size="lg"
              onClick={handleSave}
              isLoading={isSaving}
              loadingText="Saving…"
            >
              {existingRecordId ? "Update Attendance" : "Save Attendance"}
            </Button>
          </div>

          {/* Sticky mobile save bar */}
          <div
            className="sm:hidden fixed bottom-16 left-0 right-0 p-4 bg-surface/95 backdrop-blur-sm border-t border-line animate-sheet-up"
            style={{
              paddingBottom: "calc(1rem + env(safe-area-inset-bottom))",
            }}
          >
            <Button
              size="lg"
              className="w-full"
              onClick={handleSave}
              isLoading={isSaving}
              loadingText="Saving…"
            >
              {existingRecordId ? "Update Attendance" : "Save Attendance"}
            </Button>
          </div>
        </>
      )}

      <Toast toast={toast} onClose={clearToast} />
    </div>
  );
}
