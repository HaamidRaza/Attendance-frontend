import { useEffect, useState } from "react";
import { attendanceService } from "../services/attendanceService";
import { aggregateAttendance } from "../utils/aggregateAttendance";

export function useAttendanceOverview() {
  const [data, setData] = useState({
    weeklyTrend: [],
    todayBreakdown: null,
    classBreakdown: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    attendanceService
      .history()
      .then((history) => {
        if (isMounted) setData(aggregateAttendance(history || []));
      })
      .catch((err) => {
        if (isMounted)
          setError(err?.message || "Couldn't load attendance history.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return { ...data, isLoading, error };
}
