import { useState, useEffect } from "react";
import { Upload, FileText, X } from "lucide-react";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";
import { compressImage } from "../../utils/imageCompression";
import { useProtectedFile } from "../../hooks/useProtectedFile";

const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
const AADHAR_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const MAX_FILE_MB = 10;

export default function StudentForm({
  initialValues,
  classOptions,
  onCancel,
  onSubmit,
  isSubmitting,
}) {
  const isEditing = Boolean(initialValues);

  const [values, setValues] = useState({
    name: initialValues?.name || "",
    rollNumber: initialValues?.rollNumber || "",
    classId: initialValues?.classId?.id || initialValues?.classId || "",
    aadharNumber: "",
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});

  const { blobUrl: existingPhotoUrl } = useProtectedFile(
    isEditing ? initialValues?.photoUrl : null,
  );

  useEffect(() => {
    if (!photoFile) {
      setPhotoPreview(null);
      return;
    }
    const url = URL.createObjectURL(photoFile);
    setPhotoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photoFile]);

  function validateFile(file, allowedTypes, kind) {
    if (!file) return null;
    if (!allowedTypes.includes(file.type)) {
      return kind === "photo"
        ? "Photo must be a JPEG, PNG, or WebP image."
        : "Aadhar document must be a JPEG/PNG image or a PDF.";
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      return `File must be smaller than ${MAX_FILE_MB}MB.`;
    }
    return null;
  }

  function validate() {
    const nextErrors = {};
    if (!values.name.trim()) nextErrors.name = "Student name is required.";
    if (!values.rollNumber.trim())
      nextErrors.rollNumber = "Roll number is required.";
    if (!values.classId) nextErrors.classId = "Class is required.";

    if (!isEditing && !photoFile)
      nextErrors.photo = "Student photo is required.";

    if (!isEditing || values.aadharNumber) {
      if (!/^\d{12}$/.test(values.aadharNumber)) {
        nextErrors.aadharNumber = "Aadhar number must be exactly 12 digits.";
      }
    }

    const photoError = validateFile(photoFile, PHOTO_TYPES, "photo");
    if (photoError) nextErrors.photo = photoError;

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append("name", values.name.trim());
    formData.append("rollNumber", values.rollNumber.trim());
    formData.append("classId", values.classId);
    if (values.aadharNumber)
      formData.append("aadharNumber", values.aadharNumber);
    if (photoFile) formData.append("photo", photoFile);

    onSubmit(formData);
  }

  async function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) {
      setPhotoFile(null);
      return;
    }
    try {
      const compressed = await compressImage(file, {
        maxDimension: 1200,
        quality: 0.82,
      });
      setPhotoFile(compressed);
    } catch {
      // If compression fails for any reason, fall back to the original file
      // rather than blocking the person from uploading at all.
      setPhotoFile(file);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Student Name"
        name="name"
        placeholder="e.g. Abdullah"
        value={values.name}
        error={errors.name}
        onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
      />
      <Input
        label="Roll Number"
        name="rollNumber"
        placeholder="e.g. 101"
        value={values.rollNumber}
        error={errors.rollNumber}
        onChange={(e) =>
          setValues((v) => ({ ...v, rollNumber: e.target.value }))
        }
      />
      <Select
        label="Class"
        name="classId"
        options={classOptions}
        value={values.classId}
        error={errors.classId}
        onChange={(e) => setValues((v) => ({ ...v, classId: e.target.value }))}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink">
          Student Photo
          {isEditing && (
            <span className="text-slate font-normal">
              {" "}
              (leave empty to keep current)
            </span>
          )}
        </label>
        <div className="flex items-center gap-3">
          {(photoPreview || existingPhotoUrl) && (
            <img
              key={photoPreview || existingPhotoUrl}
              src={photoPreview || existingPhotoUrl}
              alt="Student"
              className="w-14 h-14 rounded-lg object-cover border border-line shrink-0 animate-scale-in"
            />
          )}
          <label className="flex-1 flex items-center gap-2 rounded-lg border border-dashed border-line-strong px-3.5 py-2.5 text-sm text-slate cursor-pointer transition-colors duration-150 hover:bg-canvas hover:border-brand-500/50">
            <Upload className="w-4 h-4 shrink-0" />
            <span className="truncate">
              {photoFile ? photoFile.name : "Choose a photo…"}
            </span>
            {photoFile && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setPhotoFile(null);
                }}
                aria-label="Remove selected photo"
                className="ml-auto shrink-0 p-1 rounded-md text-mist transition-colors hover:text-absent-600 hover:bg-absent-50"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </label>
        </div>
        {errors.photo && (
          <span className="text-xs text-absent-600 animate-fade-up">
            {errors.photo}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Input
          label="Aadhar Number"
          name="aadharNumber"
          placeholder="12-digit number"
          inputMode="numeric"
          maxLength={12}
          value={values.aadharNumber}
          error={errors.aadharNumber}
          onChange={(e) =>
            setValues((v) => ({
              ...v,
              aadharNumber: e.target.value.replace(/\D/g, "").slice(0, 12),
            }))
          }
        />
        {isEditing && (
          <p className="text-xs text-slate -mt-2">
            Leave empty to keep the current Aadhar number.
          </p>
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
        <Button type="submit" isLoading={isSubmitting} loadingText="Saving…">
          Save
        </Button>
      </div>
    </form>
  );
}
