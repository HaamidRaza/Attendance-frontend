import { useCallback, useState } from "react";

// Small helper to avoid re-writing the same loading/error/data plumbing
// around every API call in the app.
export function useAsync() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = useCallback(async (fn) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fn();
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, error, setError, run };
}
