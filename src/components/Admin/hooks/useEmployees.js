import { useState, useEffect, useCallback } from "react";
import api from "../../../services/api";

/**
 * Custom Hook: useEmployees
 * Fetches and manages employee data for task assignment
 *
 * Features:
 * - Async data fetching
 * - Loading and error states
 * - Formatted for dropdown/select components
 */
export const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ============================================
  // FETCH EMPLOYEES
  // ============================================
  const fetchEmployees = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.employees.getAll();

      if (response.success) {
        // Transform for easy use in select dropdowns
        const formattedEmployees = response.data.employees.map((emp) => ({
          id: emp._id,
          _id: emp._id,
          name: emp.name,
          email: emp.email,
          isActive: emp.isActive,
          taskStats: emp.taskStats,
          // For select dropdown
          value: emp._id,
          label: emp.name,
        }));

        setEmployees(formattedEmployees);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch employees");
      console.error("Failed to fetch employees:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // ============================================
  // GET EMPLOYEE OPTIONS FOR SELECT
  // ============================================
  const employeeOptions = employees
    .filter((emp) => emp.isActive)
    .map((emp) => ({
      value: emp._id,
      label: emp.name,
    }));

  // ============================================
  // GET EMPLOYEE BY ID
  // ============================================
  const getEmployeeById = useCallback(
    (id) => {
      return employees.find((emp) => emp._id === id || emp.id === id);
    },
    [employees],
  );

  // ============================================
  // GET EMPLOYEE NAME BY ID
  // ============================================
  const getEmployeeName = useCallback(
    (id) => {
      const employee = getEmployeeById(id);
      return employee?.name || "Unknown";
    },
    [getEmployeeById],
  );

  // ============================================
  // RETURN
  // ============================================
  return {
    employees,
    employeeOptions,
    isLoading,
    error,
    refetch: fetchEmployees,
    getEmployeeById,
    getEmployeeName,
  };
};

export default useEmployees;
