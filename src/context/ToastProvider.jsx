import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // Add toast
  // Supports two signatures:
  //  - showToast(message: string, type?: string, duration?: number)
  //  - showToast(options: { message, type?, duration?, action? })
  const showToast = useCallback(
    (messageOrOptions, type = "info", duration = 5000) => {
      const id = crypto.randomUUID();

      let toast = null;
      if (messageOrOptions && typeof messageOrOptions === "object") {
        const {
          message,
          type: t = "info",
          duration: d = 5000,
          action,
        } = messageOrOptions;
        toast = { id, type: t, message, duration: d, action };
      } else {
        toast = { id, type, message: messageOrOptions, duration };
      }

      setToasts((prev) => [...prev, toast]);
      return id;
    },
    [],
  );

  // Remove toast
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Handle auto-dismiss
  useEffect(() => {
    const timers = toasts.map((toast) => {
      if (!toast.duration) return null;

      return setTimeout(() => {
        removeToast(toast.id);
      }, toast.duration);
    });

    return () => timers.forEach((t) => t && clearTimeout(t));
  }, [toasts, removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToastContext must be used inside ToastProvider");
  }
  return ctx;
}
