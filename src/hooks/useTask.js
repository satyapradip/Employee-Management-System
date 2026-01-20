import { useContext } from "react";
import { TaskContext } from "../context/contexts";

/**
 * Custom hook to access task context
 * Must be used within a TaskProvider
 */
export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};

export default useTask;
