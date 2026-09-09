import { useState } from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";
import Input from "../common/Input";
import Button from "../common/Button";

export default function UserForm({ onCancel, onSubmit, isSubmitting }) {
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const passwordLongEnough = values.password.length >= 6;

  function validate() {
    const nextErrors = {};
    if (!values.name.trim()) nextErrors.name = "Name is required.";
    if (!values.email.trim()) nextErrors.email = "Email is required.";
    if (!values.password) nextErrors.password = "Password is required.";
    else if (values.password.length < 6)
      nextErrors.password = "Password must be at least 6 characters.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Name"
        name="name"
        placeholder="e.g. Abdul Basit"
        value={values.name}
        error={errors.name}
        onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
      />
      <Input
        label="Email"
        type="email"
        name="email"
        placeholder="teacher@school.edu"
        value={values.email}
        error={errors.email}
        onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
      />

      <div className="flex flex-col gap-1.5">
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="At least 6 characters"
          value={values.password}
          error={errors.password}
          onChange={(e) =>
            setValues((v) => ({ ...v, password: e.target.value }))
          }
          rightIcon={showPassword ? EyeOff : Eye}
          onRightIconClick={() => setShowPassword((s) => !s)}
          rightIconLabel={showPassword ? "Hide password" : "Show password"}
        />
        {values.password.length > 0 && !errors.password && (
          <div
            className={`flex items-center gap-1.5 text-xs animate-fade-up ${
              passwordLongEnough ? "text-present-600" : "text-slate"
            }`}
            style={{ animationDuration: "180ms" }}
          >
            {passwordLongEnough ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <X className="w-3.5 h-3.5 text-mist" />
            )}
            At least 6 characters
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting} loadingText="Creating…">
          Create Teacher
        </Button>
      </div>
    </form>
  );
}
