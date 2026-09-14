import { useState, useMemo } from "react";
import { X } from "lucide-react";
import Modal from "../common/Modal";
import Select from "../common/Select";
import Button from "../common/Button";
import ErrorBanner from "../common/ErrorBanner";
import { classService } from "../../services/classService";
import { classLabel } from "../../utils/format";

export default function ManageTeachersModal({
  cls,
  allTeachers,
  isOpen,
  onClose,
  onChanged,
}) {
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const assignedIds = new Set((cls?.teachers || []).map((t) => t.id));
  const availableOptions = useMemo(
    () =>
      allTeachers
        .filter((t) => !assignedIds.has(t.id))
        .map((t) => ({ value: t.id, label: `${t.name} (${t.email})` })),
    [allTeachers, cls],
  );

  async function handleAssign() {
    if (!selectedTeacherId) return;
    setIsSubmitting(true);
    setError("");
    try {
      await classService.assignTeacher(cls.id, selectedTeacherId);
      setSelectedTeacherId("");
      onChanged();
    } catch (err) {
      setError(err?.message || "Couldn't assign teacher.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRemove(teacherId) {
    setIsSubmitting(true);
    setError("");
    try {
      await classService.unassignTeacher(cls.id, teacherId);
      onChanged();
    } catch (err) {
      setError(err?.message || "Couldn't remove teacher.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!cls) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Teachers — ${classLabel(cls)}`}
    >
      <div className="flex flex-col gap-4">
        {error && (
          <ErrorBanner message={error} onDismiss={() => setError("")} />
        )}

        <div className="flex flex-col gap-2">
          {(cls.teachers || []).length === 0 ? (
            <p className="text-sm text-slate m-0">No teachers assigned yet.</p>
          ) : (
            cls.teachers.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between gap-2 rounded-lg border border-line px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium text-ink m-0">{t.name}</p>
                  <p className="text-xs text-slate m-0">{t.email}</p>
                </div>
                <button
                  onClick={() => handleRemove(t.id)}
                  disabled={isSubmitting}
                  aria-label={`Remove ${t.name}`}
                  className="p-1.5 rounded-md text-slate hover:text-absent-600 hover:bg-absent-50 disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="h-px bg-line" />

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Select
              label="Assign a teacher"
              placeholder={
                availableOptions.length
                  ? "Select teacher"
                  : "All teachers assigned"
              }
              options={availableOptions}
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              disabled={availableOptions.length === 0}
            />
          </div>
          <Button
            onClick={handleAssign}
            disabled={!selectedTeacherId}
            isLoading={isSubmitting}
            loadingText="Adding…"
          >
            Add
          </Button>
        </div>
      </div>
    </Modal>
  );
}
