import React from "react";
import logger from "../utils/logger.js";

function Toast({ id, type, message, onClose, action }) {
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
      className={`${styles[type] || styles.info} p-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-md animate-slideInRight`}
    >
      <span className="text-2xl">{icons[type]}</span>
      <p className="flex-1">{message}</p>
      {action && (
        <button
          onClick={() => {
            try {
              if (typeof action.onClick === "function") action.onClick(id);
            } catch (error) {
              // Log the error for debugging purposes
              logger.error("Toast action error:", error);
            }
            onClose();
          }}
          className="mr-2 px-3 py-1 bg-white/10 rounded text-sm"
        >
          {action.label || "Action"}
        </button>
      )}
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
