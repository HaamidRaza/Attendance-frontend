import { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";

export default function ClassForm({
  initialValues,
  onCancel,
  onSubmit,
  isSubmitting,
}) {
  const [values, setValues] = useState({
    name: initialValues?.name || "",
    section: initialValues?.section || "",
  });
  const [errors, setErrors] = useState({});

  function validate() {
    const nextErrors = {};
    if (!values.name.trim()) nextErrors.name = "Class name is required.";
    if (!values.section.trim()) nextErrors.section = "Section is required.";
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
        label="Class Name"
        name="name"
        placeholder="e.g. BSc IT"
        value={values.name}
        error={errors.name}
        onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
      />
      <Input
        label="Section"
        name="section"
        placeholder="e.g. A"
        value={values.section}
        error={errors.section}
        onChange={(e) => setValues((v) => ({ ...v, section: e.target.value }))}
      />

      {(errors.name || errors.section) && (
        <p className="text-xs text-slate m-0 animate-fade-up">
          Please fill in the highlighted fields before saving.
        </p>
      )}

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting} loadingText="Saving…">
          Save
        </Button>
      </div>
    </form>
  );
}
