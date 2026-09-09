import { useEffect, useState } from "react";
import api from "../services/api";

// Fetches an auth-protected file (a student photo or Aadhar document) as a
// blob, since a plain <img src> can't carry an Authorization header.
export function useProtectedFile(url) {
  const [blobUrl, setBlobUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(url));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!url) {
      setBlobUrl(null);
      setIsLoading(false);
      return;
    }
    let isMounted = true;
    let objectUrl;
    setIsLoading(true);
    setError("");

    api
      .get(url, { responseType: "blob" })
      .then((res) => {
        if (!isMounted) return;
        objectUrl = URL.createObjectURL(res.data);
        setBlobUrl(objectUrl);
      })
      .catch((err) => {
        if (isMounted) setError(err?.message || "Couldn't load file.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [url]);

  return { blobUrl, isLoading, error };
}