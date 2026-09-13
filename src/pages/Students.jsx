import { useEffect, useState, useCallback, useRef } from "react";
import { Search, Plus, Users } from "lucide-react";
import Input from "../components/common/Input";
import Select from "../components/common/Select";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";
import ErrorBanner from "../components/common/ErrorBanner";
import Toast from "../components/common/Toast";
import StudentTable from "../components/students/StudentTable";
import StudentForm from "../components/students/StudentForm";
import { studentService } from "../services/studentService";
import { classService } from "../services/classService";
import { useDebounce } from "../hooks/useDebounce";
import { useToast } from "../hooks/useToast";
import { classLabel } from "../utils/format";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { toast, showToast, clearToast } = useToast();

  const isDeletingRef = useRef(false);

  async function handleDeleteConfirm() {
    if (!studentToDelete || isDeletingRef.current) return;
    isDeletingRef.current = true;
    setIsDeleting(true);
    try {
      await studentService.remove(studentToDelete.id);
      showToast("Student deleted.");
      setStudentToDelete(null);
      loadStudents();
    } catch (err) {
      showToast(err?.message || "Couldn't delete student.", "error");
    } finally {
      setIsDeleting(false);
      isDeletingRef.current = false;
    }
  }

  const loadStudents = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      const data = await studentService.list({
        search: debouncedSearch || undefined,
        classId: classFilter || undefined,
      });

      setStudents(data?.students || data || []);
    } catch (err) {
      setLoadError(err?.message || "Couldn't load students.");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, classFilter]);

  useEffect(() => {
    classService
      .list()
      .then((data) => setClasses(data?.classes || data || []))
      .catch(() => setClasses([]));
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const classOptions = classes.map((c) => ({
    value: c.id,
    label: classLabel(c),
  }));

  function openAddForm() {
    setEditingStudent(null);
    setFormError("");
    setIsFormOpen(true);
  }

  function openEditForm(student) {
    setEditingStudent(student);
    setFormError("");
    setIsFormOpen(true);
  }

  async function handleFormSubmit(values) {
    setIsSubmitting(true);
    setFormError("");
    try {
      if (editingStudent) {
        await studentService.update(editingStudent.id, values);
        showToast("Student updated successfully.");
      } else {
        await studentService.create(values);
        showToast("Student added successfully.");
      }
      setIsFormOpen(false);
      loadStudents();
    } catch (err) {
      setFormError(err?.message || "Couldn't save student.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!studentToDelete) return;
    setIsDeleting(true);
    try {
      await studentService.remove(studentToDelete.id);
      showToast("Student deleted.");
      setStudentToDelete(null);
      loadStudents();
    } catch (err) {
      showToast(err?.message || "Couldn't delete student.", "error");
    } finally {
      setIsDeleting(false);
    }
  }

  const hasFilters = Boolean(search || classFilter);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3 animate-fade-up">
        <div>
          <h1 className="text-xl font-semibold font-display m-0">Students</h1>
          <p className="text-sm text-slate mt-1 m-0">
            Add and manage students across your classes.
          </p>
        </div>
        <Button
          icon={Plus}
          onClick={openAddForm}
          className="hidden sm:inline-flex"
        >
          Add Student
        </Button>
      </div>

      <div
        className="flex flex-col sm:flex-row gap-3 animate-fade-up"
        style={{ animationDelay: "60ms" }}
      >
        <div className="flex-1">
          <Input
            icon={Search}
            placeholder="Search students"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="sm:w-56">
          <Select
            placeholder="Filter by class"
            options={[{ value: "", label: "All classes" }, ...classOptions]}
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
          />
        </div>
        <Button
          icon={Plus}
          onClick={openAddForm}
          className="w-full sm:hidden justify-center"
        >
          Add Student
        </Button>
      </div>

      {loadError && (
        <div className="animate-fade-up">
          <ErrorBanner message={loadError} onDismiss={() => setLoadError("")} />
        </div>
      )}

      {isLoading ? (
        <LoadingSpinner label="Loading students…" />
      ) : students.length === 0 ? (
        <div
          className="rounded-xl border border-line bg-surface animate-fade-up"
          style={{ animationDelay: "100ms" }}
        >
          <EmptyState
            icon={Users}
            title={
              hasFilters
                ? "No students match your filters."
                : "No students found."
            }
            description={
              hasFilters
                ? "Try adjusting your search or class filter."
                : "Add your first student."
            }
            action={
              !hasFilters && (
                <Button icon={Plus} onClick={openAddForm}>
                  Add Student
                </Button>
              )
            }
          />
        </div>
      ) : (
        <div className="animate-fade-up" style={{ animationDelay: "100ms" }}>
          <StudentTable
            students={students}
            onEdit={openEditForm}
            onDelete={setStudentToDelete}
          />
        </div>
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingStudent ? "Edit Student" : "Add Student"}
      >
        {formError && (
          <div className="mb-4">
            <ErrorBanner
              message={formError}
              onDismiss={() => setFormError("")}
            />
          </div>
        )}
        <StudentForm
          initialValues={editingStudent}
          classOptions={classOptions}
          onCancel={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
        />
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(studentToDelete)}
        onClose={() => setStudentToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete student?"
        message={`This will permanently remove ${studentToDelete?.name || "this student"} and their attendance records.`}
        isLoading={isDeleting}
      />

      <Toast toast={toast} onClose={clearToast} />
    </div>
  );
}
