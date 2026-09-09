import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { ClipboardCheck, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import ErrorBanner from "../components/common/ErrorBanner";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    const redirectTo = location.state?.from?.pathname || "/dashboard";
    return <Navigate to={redirectTo} replace />;
  }

  function validate() {
    const errors = {};
    if (!email.trim()) errors.email = "Email is required.";
    if (!password) errors.password = "Password is required.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;

    setIsSubmitting(true);
    const result = await login(email.trim(), password);
    setIsSubmitting(false);

    if (result.success) {
      const destination =
        result.user?.role === "teacher" ? "/attendance" : "/dashboard";
      navigate(destination, { replace: true });
    } else {
      setFormError(
        result.error?.message || "Couldn't sign in. Please try again.",
      );
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div
            className="animate-scale-in w-12 h-12 rounded-2xl bg-brand-500 flex items-center justify-center
                       shadow-[0_4px_14px_-4px_rgba(42,114,33,0.45)]
                       transition-transform duration-300 ease-out hover:scale-105"
          >
            <ClipboardCheck className="w-6 h-6 text-white" strokeWidth={2} />
          </div>
          <div className="animate-fade-up text-center" style={{ animationDelay: "80ms" }}>
            <h1 className="text-xl font-semibold m-0 tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-slate mt-1 m-0">
              Manage classes and attendance in one place.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="animate-fade-up bg-surface border border-line rounded-2xl p-6 flex flex-col gap-4
                     shadow-[0_1px_2px_rgba(15,17,8,0.04)]
                     transition-shadow duration-300 hover:shadow-[0_8px_24px_-12px_rgba(15,17,8,0.12)]"
          style={{ animationDelay: "160ms" }}
        >
          {formError && (
            <ErrorBanner message={formError} onDismiss={() => setFormError("")} />
          )}

          <Input
            label="Email"
            type="email"
            name="email"
            icon={Mail}
            placeholder="you@school.edu"
            value={email}
            error={fieldErrors.email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            icon={Lock}
            rightIcon={showPassword ? EyeOff : Eye}
            rightIconLabel={showPassword ? "Hide password" : "Show password"}
            onRightIconClick={() => setShowPassword((v) => !v)}
            placeholder="••••••••"
            value={password}
            error={fieldErrors.password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          <Button
            type="submit"
            size="lg"
            className="w-full mt-1"
            isLoading={isSubmitting}
            loadingText="Signing in…"
          >
            Sign in
          </Button>
        </form>

        <p className="animate-fade-up text-center text-xs text-mist mt-6" style={{ animationDelay: "220ms" }}>
          Trouble signing in? Contact your administrator.
        </p>
      </div>
    </div>
  );
}