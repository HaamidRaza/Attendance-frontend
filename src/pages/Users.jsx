import { useEffect, useState, useCallback } from "react";
import { Plus, UserCog } from "lucide-react";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";
import ErrorBanner from "../components/common/ErrorBanner";
import Toast from "../components/common/Toast";
import UserTable from "../components/users/UserTable";
import UserForm from "../components/users/UserForm";
import { userService } from "../services/userService";
import { useToast } from "../hooks/useToast";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const { toast, showToast, clearToast } = useToast();

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      const data = await userService.list();
      setUsers(data?.users || data || []);
    } catch (err) {
      setLoadError(err?.message || "Couldn't load users.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  async function handleFormSubmit(values) {
    setIsSubmitting(true);
    setFormError("");
    try {
      await userService.createTeacher(values);
      showToast("Teacher account created.");
      setIsFormOpen(false);
      loadUsers();
    } catch (err) {
      setFormError(err?.message || "Couldn't create teacher account.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-up">
        <div>
          <h1 className="text-xl font-semibold font-display m-0">Teachers</h1>
          <p className="text-sm text-slate mt-1 m-0">
            Manage teacher accounts.
          </p>
        </div>
        <Button icon={Plus} onClick={() => setIsFormOpen(true)} className="w-full sm:w-auto justify-center">
          Add Teacher
        </Button>
      </div>

      {loadError && (
        <div className="animate-fade-up">
          <ErrorBanner message={loadError} onDismiss={() => setLoadError("")} />
        </div>
      )}

      {isLoading ? (
        <LoadingSpinner label="Loading users…" />
      ) : users.length === 0 ? (
        <div className="rounded-xl border border-line bg-surface animate-fade-up" style={{ animationDelay: "80ms" }}>
          <EmptyState
            icon={UserCog}
            title="No users found."
            description="Add a teacher account to get started."
            action={
              <Button icon={Plus} onClick={() => setIsFormOpen(true)}>
                Add Teacher
              </Button>
            }
          />
        </div>
      ) : (
        <div className="animate-fade-up" style={{ animationDelay: "80ms" }}>
          <UserTable users={users} />
        </div>
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Add Teacher"
      >
        {formError && (
          <div className="mb-4">
            <ErrorBanner
              message={formError}
              onDismiss={() => setFormError("")}
            />
          </div>
        )}
        <UserForm
          onCancel={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
        />
      </Modal>

      <Toast toast={toast} onClose={clearToast} />
    </div>
  );
}