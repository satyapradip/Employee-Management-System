import React, { useState } from "react";
import logger from "../utils/logger.js";

function Toast({ id, type, message, onClose, action }) {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300); // Match animation duration
  };

  // Modern gradient-based styles with glassmorphism
  const styles = {
    success: {
      bg: "bg-gradient-to-r from-emerald-500/90 to-green-500/90 backdrop-blur-xl",
      border: "border-emerald-400/50",
      shadow: "shadow-lg shadow-emerald-500/20",
      icon: "bg-white/20",
    },
    error: {
      bg: "bg-gradient-to-r from-red-500/90 to-rose-500/90 backdrop-blur-xl",
      border: "border-red-400/50",
      shadow: "shadow-lg shadow-red-500/20",
      icon: "bg-white/20",
    },
    warning: {
      bg: "bg-gradient-to-r from-amber-500/90 to-orange-500/90 backdrop-blur-xl",
      border: "border-amber-400/50",
      shadow: "shadow-lg shadow-amber-500/20",
      icon: "bg-white/20",
    },
    info: {
      bg: "bg-gradient-to-r from-blue-500/90 to-cyan-500/90 backdrop-blur-xl",
      border: "border-blue-400/50",
      shadow: "shadow-lg shadow-blue-500/20",
      icon: "bg-white/20",
    },
  };

  // Modern SVG icons
  const icons = {
    success: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
    warning: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
    info: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  };

  const currentStyle = styles[type] || styles.info;

  return (
    <div
      className={`
        ${currentStyle.bg}
        ${currentStyle.border}
        ${currentStyle.shadow}
        border
        text-white
        p-4 
        rounded-xl 
        flex 
        items-start
        gap-3 
        min-w-[320px] 
        max-w-md
        transition-all
        duration-300
        ${isExiting ? "animate-toast-exit" : "animate-toast-enter"}
      `}
      role="alert"
    >
      {/* Icon */}
      <div className={`${currentStyle.icon} rounded-lg p-2 flex-shrink-0`}>
        {icons[type] || icons.info}
      </div>

      {/* Content */}
      <div className="flex-1 pt-0.5">
        <p className="text-sm font-medium leading-relaxed">{message}</p>

        {/* Action button if provided */}
        {action && (
          <button
            onClick={() => {
              try {
                if (typeof action.onClick === "function") action.onClick(id);
              } catch (error) {
                logger.error("Toast action error:", error);
              }
              handleClose();
            }}
            className="mt-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95"
          >
            {action.label || "Action"}
          </button>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={handleClose}
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-all duration-200 group"
        aria-label="Close notification"
      >
        <svg
          className="w-5 h-5 group-hover:scale-110 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}

export default Toast;
