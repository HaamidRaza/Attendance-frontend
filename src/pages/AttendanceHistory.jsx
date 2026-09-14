import { useEffect, useState, useCallback } from "react";
import { History, Download } from "lucide-react";
import { downloadBlob } from "../utils/downloadBlob";
import Select from "../components/common/Select";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";
import ErrorBanner from "../components/common/ErrorBanner";
import HistoryTable from "../components/attendance/HistoryTable";
import { classService } from "../services/classService";
import { attendanceService } from "../services/attendanceService";
import { classLabel } from "../utils/format";

export default function AttendanceHistory() {
  const [classes, setClasses] = useState([]);
  const [classFilter, setClassFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [exportClassId, setExportClassId] = useState("");
  const [exportMonth, setExportMonth] = useState(() =>
    new Date().toISOString().slice(0, 7),
  );
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState("");

  async function handleExport() {
    if (!exportClassId || !exportMonth) return;
    setIsExporting(true);
    setExportError("");
    try {
      const blob = await attendanceService.exportMonthly(
        exportClassId,
        exportMonth,
      );
      downloadBlob(blob, `attendance-${exportMonth}.xlsx`);
    } catch (err) {
      setExportError(err?.message || "Couldn't generate the report.");
    } finally {
      setIsExporting(false);
    }
  }

  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    classService
      .list()
      .then((data) => setClasses(data?.classes || data || []))
      .catch(() => setClasses([]));
  }, []);

  const loadHistory = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await attendanceService.history({
        classId: classFilter || undefined,
        date: dateFilter || undefined,
      });
      const raw = data?.records || data || [];
      const sorted = Array.isArray(raw)
        ? raw.slice().sort((a, b) => new Date(b.date) - new Date(a.date))
        : raw;
      setRecords(sorted);
    } catch (err) {
      setError(err?.message || "Couldn't load attendance history.");
    } finally {
      setIsLoading(false);
    }
  }, [classFilter, dateFilter]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const classOptions = classes.map((c) => ({
    value: c.id,
    label: classLabel(c),
  }));
  const hasFilters = Boolean(classFilter || dateFilter);

  return (
    <div className="flex flex-col gap-5">
      <div className="animate-fade-up">
        <h1 className="text-xl font-semibold font-display m-0">
          Attendance History
        </h1>
        <p className="text-sm text-slate mt-1 m-0">
          Browse and review past attendance records.
        </p>
      </div>

      <div
        className="flex flex-col sm:flex-row gap-3 sm:max-w-md animate-fade-up"
        style={{ animationDelay: "60ms" }}
      >
        <Select
          placeholder="Filter by class"
          options={[{ value: "", label: "All classes" }, ...classOptions]}
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
        />
        <Input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>

      <div className="rounded-xl border border-line bg-surface p-4 flex flex-col sm:flex-row sm:items-end gap-3">
        <div className="flex-1">
          <Select
            label="Class"
            placeholder="Select class to export"
            options={classOptions}
            value={exportClassId}
            onChange={(e) => setExportClassId(e.target.value)}
          />
        </div>
        <div className="sm:w-48">
          <Input
            label="Month"
            type="month"
            max={new Date().toISOString().slice(0, 7)}
            value={exportMonth}
            onChange={(e) => setExportMonth(e.target.value)}
          />
        </div>
        <Button
          icon={Download}
          onClick={handleExport}
          disabled={!exportClassId}
          isLoading={isExporting}
          loadingText="Generating…"
        >
          Download Excel
        </Button>
      </div>
      {exportError && (
        <ErrorBanner
          message={exportError}
          onDismiss={() => setExportError("")}
        />
      )}

      {error && (
        <div className="animate-fade-up">
          <ErrorBanner message={error} onDismiss={() => setError("")} />
        </div>
      )}

      {isLoading ? (
        <LoadingSpinner label="Loading attendance…" />
      ) : records.length === 0 ? (
        <div
          className="rounded-xl border border-line bg-surface animate-fade-up"
          style={{ animationDelay: "100ms" }}
        >
          <EmptyState
            icon={History}
            title={
              hasFilters
                ? "No records match your filters."
                : "No attendance recorded."
            }
            description={
              hasFilters
                ? "Try a different class or date."
                : "Take attendance to see it appear here."
            }
          />
        </div>
      ) : (
        <div className="animate-fade-up" style={{ animationDelay: "100ms" }}>
          <HistoryTable records={records} />
        </div>
      )}
    </div>
  );
}
