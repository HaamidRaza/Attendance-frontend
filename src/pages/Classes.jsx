import { useEffect, useState, useCallback } from "react";
import { Plus, GraduationCap } from "lucide-react";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";
import ErrorBanner from "../components/common/ErrorBanner";
import Toast from "../components/common/Toast";
import ClassTable from "../components/classes/ClassTable";
import ClassForm from "../components/classes/ClassForm";
import { classService } from "../services/classService";
import { useToast } from "../hooks/useToast";
import { classLabel } from "../utils/format";

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [classToDelete, setClassToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { toast, showToast, clearToast } = useToast();

  const loadClasses = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      const data = await classService.list();
      setClasses(data?.classes || data || []);
    } catch (err) {
      setLoadError(err?.message || "Couldn't load classes.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  function openAddForm() {
    setEditingClass(null);
    setFormError("");
    setIsFormOpen(true);
  }

  function openEditForm(cls) {
    setEditingClass(cls);
    setFormError("");
    setIsFormOpen(true);
  }

  async function handleFormSubmit(values) {
    setIsSubmitting(true);
    setFormError("");
    try {
      if (editingClass) {
        await classService.update(editingClass.id, values);
        showToast("Class updated successfully.");
      } else {
        await classService.create(values);
        showToast("Class added successfully.");
      }
      setIsFormOpen(false);
      loadClasses();
    } catch (err) {
      setFormError(err?.message || "Couldn't save class.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!classToDelete) return;
    setIsDeleting(true);
    try {
      await classService.remove(classToDelete.id);
      showToast("Class deleted.");
      setClassToDelete(null);
      loadClasses();
    } catch (err) {
      showToast(err?.message || "Couldn't delete class.", "error");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-up">
        <div>
          <h1 className="text-xl font-semibold font-display m-0">Classes</h1>
          <p className="text-sm text-slate mt-1 m-0">Create and manage the classes you take attendance for.</p>
        </div>
        <Button icon={Plus} onClick={openAddForm} className="w-full sm:w-auto justify-center">
          Add Class
        </Button>
      </div>

      {loadError && (
        <div className="animate-fade-up">
          <ErrorBanner message={loadError} onDismiss={() => setLoadError("")} />
        </div>
      )}

      {isLoading ? (
        <LoadingSpinner label="Loading classes…" />
      ) : classes.length === 0 ? (
        <div className="rounded-xl border border-line bg-surface animate-fade-up" style={{ animationDelay: "80ms" }}>
          <EmptyState
            icon={GraduationCap}
            title="No classes found."
            description="Create a class to get started."
            action={
              <Button icon={Plus} onClick={openAddForm}>
                Add Class
              </Button>
            }
          />
        </div>
      ) : (
        <div className="animate-fade-up" style={{ animationDelay: "80ms" }}>
          <ClassTable classes={classes} onEdit={openEditForm} onDelete={setClassToDelete} />
        </div>
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingClass ? "Edit Class" : "Add Class"}
      >
        {formError && (
          <div className="mb-4">
            <ErrorBanner message={formError} onDismiss={() => setFormError("")} />
          </div>
        )}
        <ClassForm
          initialValues={editingClass}
          onCancel={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
        />
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(classToDelete)}
        onClose={() => setClassToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete class?"
        message={`This will permanently remove ${
          classToDelete ? classLabel(classToDelete) : "this class"
        } and its attendance records.`}
        isLoading={isDeleting}
      />

      <Toast toast={toast} onClose={clearToast} />
    </div>
  );
}