import { useState, useEffect, useCallback } from "react";
import api from "../../../services/api";
import { useToastContext } from "../../../context/toastContext.js";
import logger from "../../../utils/logger.js";

/**
 * Transform backend employee to frontend format
 */
const transformEmployee = (emp) => ({
  id: emp._id,
  _id: emp._id,
  name: emp.name,
  email: emp.email,
  isActive: emp.isActive,
  taskStats: emp.taskStats || {
    total: 0,
    new: 0,
    active: 0,
    completed: 0,
    failed: 0,
  },
  createdAt: emp.createdAt,
  // For select dropdown
  value: emp._id,
  label: emp.name,
});

/**
 * Custom Hook: useEmployees
 * Full CRUD operations for employee management
 */
export const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToastContext();

  // ============================================
  // FETCH EMPLOYEES
  // ============================================
  const fetchEmployees = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.employees.getAll();

      if (response.success) {
        const formattedEmployees =
          response.data.employees.map(transformEmployee);
        setEmployees(formattedEmployees);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch employees");
      logger.error("Failed to fetch employees:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // ============================================
  // CREATE EMPLOYEE
  // ============================================
  const createEmployee = useCallback(
    async (data) => {
      try {
        setIsSubmitting(true);
        setError(null);

        const response = await api.employees.create(data);

        if (response.success) {
          const newEmp = transformEmployee(response.data.employee);
          setEmployees((prev) => [newEmp, ...prev]);
          showToast("Employee created successfully!", "success");
          return { success: true, employee: newEmp };
        }
      } catch (err) {
        const msg = err.message || "Failed to create employee";
        setError(msg);
        showToast(msg, "error");
        return { success: false, error: msg };
      } finally {
        setIsSubmitting(false);
      }
    },
    [showToast],
  );

  // ============================================
  // UPDATE EMPLOYEE
  // ============================================
  const updateEmployee = useCallback(
    async (id, data) => {
      try {
        setIsSubmitting(true);
        setError(null);

        const response = await api.employees.update(id, data);

        if (response.success) {
          const updated = transformEmployee(response.data.employee);
          setEmployees((prev) =>
            prev.map((emp) => (emp._id === id ? { ...emp, ...updated } : emp)),
          );
          showToast("Employee updated successfully!", "success");
          return { success: true, employee: updated };
        }
      } catch (err) {
        const msg = err.message || "Failed to update employee";
        setError(msg);
        showToast(msg, "error");
        return { success: false, error: msg };
      } finally {
        setIsSubmitting(false);
      }
    },
    [showToast],
  );

  // ============================================
  // DELETE EMPLOYEE
  // ============================================
  const deleteEmployee = useCallback(
    async (id) => {
      try {
        setIsSubmitting(true);
        setError(null);

        const response = await api.employees.delete(id);

        if (response.success) {
          setEmployees((prev) => prev.filter((emp) => emp._id !== id));
          showToast("Employee removed successfully!", "success");
          return { success: true };
        }
      } catch (err) {
        const msg = err.message || "Failed to delete employee";
        setError(msg);
        showToast(msg, "error");
        return { success: false, error: msg };
      } finally {
        setIsSubmitting(false);
      }
    },
    [showToast],
  );

  // ============================================
  // TOGGLE ACTIVE STATUS
  // ============================================
  const toggleActive = useCallback(
    async (id) => {
      const emp = employees.find((e) => e._id === id);
      if (!emp) return;
      return updateEmployee(id, { isActive: !emp.isActive });
    },
    [employees, updateEmployee],
  );

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
    isSubmitting,
    error,
    refetch: fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    toggleActive,
    getEmployeeById,
    getEmployeeName,
  };
};

export default useEmployees;
