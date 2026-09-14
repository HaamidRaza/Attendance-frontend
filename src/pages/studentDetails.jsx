// StudentDetails.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, FileText, Download, ImageOff, IdCard } from "lucide-react";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorBanner from "../components/common/ErrorBanner";
import { studentService } from "../services/studentService";
import { useProtectedFile } from "../hooks/useProtectedFile";
import { classLabel } from "../utils/format";

function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function StudentDetails() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [showAadhar, setShowAadhar] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    studentService
      .get(id)
      .then((data) => {
        if (isMounted) setStudent(data);
      })
      .catch((err) => {
        if (isMounted) setError(err?.message || "Couldn't load this student.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [id]);

  const { blobUrl: photoUrl, isLoading: isPhotoLoading } = useProtectedFile(
    student?.photoUrl,
  );
  const {
    blobUrl: aadharUrl,
    isLoading: isAadharLoading,
    error: aadharError,
  } = useProtectedFile(student?.aadharUrl);

  return (
    <div className="flex flex-col gap-5">
      <Link
        to="/students"
        className="group inline-flex items-center gap-1.5 text-sm font-medium text-slate transition-colors hover:text-ink w-fit"
      >
        <ArrowLeft className="w-4 h-4 transition-transform duration-150 group-hover:-translate-x-0.5" />
        Back to students
      </Link>

      {error && (
        <div className="animate-fade-up">
          <ErrorBanner message={error} onDismiss={() => setError("")} />
        </div>
      )}

      {isLoading ? (
        <LoadingSpinner label="Loading student…" />
      ) : student ? (
        <>
          {/* Profile header */}
          <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6 animate-fade-up">
            <div className="flex items-center gap-4 sm:gap-5">
              {isPhotoLoading ? (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-line animate-pulse shrink-0" />
              ) : photoUrl ? (
                <img
                  src={photoUrl}
                  alt={student.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border border-line shrink-0 animate-scale-in"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
                  <span className="font-display font-semibold text-2xl text-brand-700">
                    {initials(student.name) || "?"}
                  </span>
                </div>
              )}

              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-semibold font-display m-0 truncate">
                  {student.name}
                </h1>
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-xs font-medium text-slate bg-canvas rounded-md px-2 py-1">
                    Roll No: {student.rollNumber}
                  </span>
                  <span className="text-xs font-medium text-slate bg-canvas rounded-md px-2 py-1">
                    {classLabel(student.classId)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Aadhar number */}
          <div className="rounded-xl border border-line bg-surface p-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-semibold m-0">Aadhar Number</h2>
              {student.aadharNumber && (
                <button
                  onClick={() => setShowAadhar((s) => !s)}
                  className="text-sm font-medium text-brand-600 hover:text-brand-700"
                >
                  {showAadhar ? "Hide" : "Show"}
                </button>
              )}
            </div>
            <p className="text-lg font-mono tracking-wider text-ink m-0">
              {student.aadharNumber
                ? showAadhar
                  ? student.aadharNumber.replace(/(\d{4})(?=\d)/g, "$1 ")
                  : `XXXX XXXX ${student.aadharNumber.slice(-4)}`
                : "Not on file"}
            </p>
          </div>
        </>
      ) : null}
    </div>
  );
}
