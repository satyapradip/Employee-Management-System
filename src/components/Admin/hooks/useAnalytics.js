import { useState, useEffect, useCallback } from "react";
import api from "../../../services/api";
import { useToastContext } from "../../../context/toastContext.js";
import logger from "../../../utils/logger.js";

/**
 * Custom Hook: useAnalytics
 * Fetches and manages analytics/statistics data for the admin dashboard
 */
export const useAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast } = useToastContext();

  // ============================================
  // FETCH ANALYTICS STATS
  // ============================================
  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.tasks.getStats();

      if (response.success) {
        setStats(response.data);
        logger.info("Analytics stats fetched successfully:", response.data);
      }
    } catch (err) {
      const errorMsg = err.message || "Failed to fetch analytics data";
      setError(errorMsg);
      logger.error("Failed to fetch analytics:", err);
    } finally {
      setIsLoading(false);
    }
  }, []); // Fixed: Removed isLoading from dependencies to prevent infinite loop

  // Initial fetch on mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // ============================================
  // REFRESH STATS
  // ============================================
  const refreshStats = useCallback(async () => {
    await fetchStats();
    showToast("Analytics refreshed!", "success");
  }, [fetchStats, showToast]);

  // ============================================
  // RETURN
  // ============================================
  return {
    stats,
    isLoading,
    error,
    refreshStats,
    refetch: fetchStats,
  };
};

export default useAnalytics;
