import { useEffect, useState, useCallback, useRef } from "react";
import { Plus, UserCog } from "lucide-react";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";
import ErrorBanner from "../components/common/ErrorBanner";
import Toast from "../components/common/Toast";
import UserTable from "../components/users/userTable";
import UserForm from "../components/users/userForm";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { userService } from "../services/userService";
import { useToast } from "../hooks/useToast";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const isDeletingRef = useRef(false);

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

  async function handleDeleteConfirm() {
    if (!userToDelete || isDeletingRef.current) return;
    isDeletingRef.current = true;
    setIsDeleting(true);
    try {
      await userService.remove(userToDelete.id);
      showToast("User deleted.");
      setUserToDelete(null);
      loadUsers();
    } catch (err) {
      showToast(err?.message || "Couldn't delete user.", "error");
    } finally {
      setIsDeleting(false);
      isDeletingRef.current = false;
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
        <Button
          icon={Plus}
          onClick={() => setIsFormOpen(true)}
          className="w-full sm:w-auto justify-center"
        >
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
        <div
          className="rounded-xl border border-line bg-surface animate-fade-up"
          style={{ animationDelay: "80ms" }}
        >
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
          <UserTable users={users} onDelete={setUserToDelete} />
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
      
      <ConfirmDialog
        isOpen={Boolean(userToDelete)}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete user?"
        message={`This will permanently remove ${userToDelete?.name || "this user"}'s account and unassign them from any classes. This cannot be undone.`}
        isLoading={isDeleting}
      />
      <Toast toast={toast} onClose={clearToast} />
    </div>
  );
}
