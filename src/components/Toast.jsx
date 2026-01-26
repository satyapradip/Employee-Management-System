import React from "react";

function Toast({ type, message, onClose }) {
  const styles = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    warning: "bg-yellow-500 text-black",
    info: "bg-blue-500 text-white",
  };

  const icons = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  };

  return (
    <div
      className={`${styles[type] || styles.info} p-4 rounded-lg shadow-lg flex items-center gap-3 min-w-75 max-w-100 animate-slideInRight`}
    >
      <span className="text-2xl">{icons[type]}</span>
      <p className="flex-1">{message}</p>
      <button
        onClick={onClose}
        className="text-xl hover:opacity-70"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}

export default Toast;
