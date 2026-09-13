import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorBanner from "../components/common/ErrorBanner";
import Toast from "../components/common/Toast";
import { userService } from "../services/userService";
import { useToast } from "../hooks/useToast";
import { useAuth } from "../context/AuthContext";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const { toast, showToast, clearToast } = useToast();

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    userService
      .get(id)
      .then((data) => {
        if (!isMounted) return;
        setUser(data);
        setValues({
          name: data.name,
          email: data.email,
          password: "",
          confirmPassword: "",
        });
      })
      .catch((err) => {
        if (isMounted) setLoadError(err?.message || "Couldn't load this user.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [id]);

  function validate() {
    const nextErrors = {};
    if (!values.name.trim()) nextErrors.name = "Name is required.";
    if (!values.email.trim()) nextErrors.email = "Email is required.";

    // Password is optional here — only validate it if the admin is actually
    // trying to change it.
    if (values.password || values.confirmPassword) {
      if (values.password.length < 6)
        nextErrors.password = "Password must be at least 6 characters.";
      if (values.password !== values.confirmPassword)
        nextErrors.confirmPassword = "Passwords don't match.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      const payload = { name: values.name.trim(), email: values.email.trim() };
      if (values.password) payload.password = values.password;

      const updated = await userService.update(id, payload);
      setUser(updated);
      setValues((v) => ({ ...v, password: "", confirmPassword: "" }));
      showToast("User updated successfully.");
    } catch (err) {
      showToast(err?.message || "Couldn't update user.", "error");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-5 max-w-lg">
      <Link
        to="/users"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate hover:text-ink w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to users
      </Link>

      {loadError && (
        <ErrorBanner message={loadError} onDismiss={() => setLoadError("")} />
      )}

      {isLoading ? (
        <LoadingSpinner label="Loading user…" />
      ) : user ? (
        <>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-base font-semibold shrink-0">
              {user.name.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-semibold m-0">{user.name}</h1>
              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-canvas border border-line text-slate mt-1">
                {user.role}
              </span>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-line bg-surface p-5 flex flex-col gap-4"
          >
            <Input
              label="Name"
              name="name"
              value={values.name}
              error={errors.name}
              onChange={(e) =>
                setValues((v) => ({ ...v, name: e.target.value }))
              }
            />
            <Input
              label="Email"
              type="email"
              name="email"
              value={values.email}
              error={errors.email}
              onChange={(e) =>
                setValues((v) => ({ ...v, email: e.target.value }))
              }
            />

            <div className="h-px bg-line my-1" />

            <p className="text-sm text-slate m-0 -mb-1">
              Leave password fields empty to keep it unchanged.
            </p>
            <Input
              label="New Password"
              type="password"
              name="password"
              placeholder="At least 6 characters"
              value={values.password}
              error={errors.password}
              onChange={(e) =>
                setValues((v) => ({ ...v, password: e.target.value }))
              }
            />
            <Input
              label="Confirm New Password"
              type="password"
              name="confirmPassword"
              placeholder="Re-enter new password"
              value={values.confirmPassword}
              error={errors.confirmPassword}
              onChange={(e) =>
                setValues((v) => ({ ...v, confirmPassword: e.target.value }))
              }
            />

            <div className="flex justify-end pt-2">
              <Button type="submit" isLoading={isSaving} loadingText="Saving…">
                Save Changes
              </Button>
            </div>
          </form>
        </>
      ) : null}

      <Toast toast={toast} onClose={clearToast} />
    </div>
  );
}
