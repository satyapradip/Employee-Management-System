import React, { useState, useCallback, useEffect, useRef } from "react";
import { ToastContext } from "./toastContext";

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // Track active timers to prevent memory leaks and infinite loops
  const timersRef = useRef(new Map());

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

      // Set up auto-dismiss timer for this specific toast
      if (toast.duration && toast.duration > 0) {
        const timer = setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
          timersRef.current.delete(id);
        }, toast.duration);
        timersRef.current.set(id, timer);
      }

      return id;
    },
    [],
  );

  // Remove toast
  const removeToast = useCallback((id) => {
    // Clear the timer if it exists
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Cleanup all timers on unmount
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}
