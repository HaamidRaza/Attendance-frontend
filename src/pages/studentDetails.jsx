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

  const isAadharPdf = student?.aadharCard?.mimeType === "application/pdf";

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

          {/* Aadhar document */}
          <div
            className="rounded-2xl border border-line bg-surface p-5 sm:p-6 animate-fade-up"
            style={{ animationDelay: "80ms" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-700 shrink-0">
                <IdCard className="w-4 h-4" />
              </div>
              <h2 className="text-base font-semibold font-display m-0">
                Aadhar Card
              </h2>
            </div>

            {isAadharLoading ? (
              <div className="w-full h-56 rounded-lg bg-line animate-pulse" />
            ) : aadharError ? (
              <ErrorBanner message={aadharError} />
            ) : aadharUrl ? (
              isAadharPdf ? (
                <div className="flex flex-col gap-3 animate-fade-up">
                  <iframe
                    src={aadharUrl}
                    title="Aadhar card"
                    className="w-full h-[32rem] sm:h-150 rounded-lg border border-line"
                  />
                  <a
                    href={aadharUrl}
                    download={`${student.name}-aadhar.pdf`}
                    className="inline-flex items-center gap-1.5 self-start rounded-lg border border-line px-3.5 py-2 text-sm font-medium text-brand-600 transition-colors hover:bg-brand-50 hover:text-brand-700"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </a>
                </div>
              ) : (
                <div className="flex flex-col gap-3 animate-fade-up">
                  <div className="overflow-hidden rounded-lg border border-line bg-canvas">
                    <img
                      src={aadharUrl}
                      alt="Aadhar card"
                      className="w-full max-w-sm mx-auto sm:mx-0 object-contain transition-transform duration-300 hover:scale-[1.03]"
                    />
                  </div>

                  <a
                    href={aadharUrl}
                    download={`${student.name}-aadhar`}
                    className="inline-flex items-center gap-1.5 self-start rounded-lg border border-line px-3.5 py-2 text-sm font-medium text-brand-600 transition-colors hover:bg-brand-50 hover:text-brand-700"
                  >
                    <Download className="w-4 h-4" />
                    Download Image
                  </a>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-line-strong bg-canvas py-10 text-center">
                <ImageOff className="w-6 h-6 text-mist" />
                <p className="text-sm text-slate m-0">
                  No Aadhar document on file.
                </p>
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
