import { createContext, useContext } from "react";

/**
 * Toast Context
 * Provides toast notification functionality throughout the app
 */
export const ToastContext = createContext(null);

/**
 * Hook to access toast context
 * @throws {Error} If used outside ToastProvider
 */
export function useToastContext() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
}

