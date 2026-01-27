import React from "react";
import Toast from "./Toast.jsx";
import { useToastContext } from "../context/ToastProvider.jsx";

function ToastContainer() {
  const { toasts, removeToast } = useToastContext();

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

export default ToastContainer;
