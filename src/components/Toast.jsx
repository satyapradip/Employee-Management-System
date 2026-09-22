import React, { useState } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import logger from "../utils/logger.js";

function Toast({ id, type = "info", message, onClose, action }) {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  };

  // Modern clean SaaS notification cards
  const styles = {
    success: {
      border: "border-emerald-200",
      accent: "bg-emerald-500",
      iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-100",
      title: "Success",
      Icon: CheckCircle2,
    },
    error: {
      border: "border-rose-200",
      accent: "bg-rose-500",
      iconBg: "bg-rose-50 text-rose-600 border border-rose-100",
      title: "Attention Required",
      Icon: AlertCircle,
    },
    warning: {
      border: "border-amber-200",
      accent: "bg-amber-500",
      iconBg: "bg-amber-50 text-amber-600 border border-amber-100",
      title: "Notice",
      Icon: AlertTriangle,
    },
    info: {
      border: "border-indigo-200",
      accent: "bg-indigo-600",
      iconBg: "bg-indigo-50 text-indigo-600 border border-indigo-100",
      title: "Information",
      Icon: Info,
    },
  };

  const currentStyle = styles[type] || styles.info;
  const IconComponent = currentStyle.Icon;

  return (
    <div
      className={`
        bg-white
        border ${currentStyle.border}
        shadow-lg shadow-black/8
        rounded-xl
        p-4
        flex
        items-start
        gap-3.5
        min-w-[320px]
        max-w-md
        relative
        overflow-hidden
        transition-all
        duration-300
        ${isExiting ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"}
      `}
      role="alert"
    >
      {/* Left Accent Stripe */}
      <div className={`absolute top-0 bottom-0 left-0 w-1 ${currentStyle.accent}`} />

      {/* Icon Badge */}
      <div className={`w-8 h-8 rounded-lg ${currentStyle.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
        <IconComponent className="w-4 h-4" />
      </div>

      {/* Content Area */}
      <div className="flex-1 min-w-0 pt-0.5">
        <p className="text-xs font-semibold text-[#15191E] uppercase tracking-wider mb-0.5">
          {currentStyle.title}
        </p>
        <p className="text-xs text-[#5E6875] leading-relaxed wrap-break-word">{message}</p>

        {/* Action Button */}
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
            className="mt-2.5 px-3 py-1 bg-[#101827] hover:bg-[#1E293B] text-white rounded-md text-[11px] font-semibold transition-colors cursor-pointer"
          >
            {action.label || "Action"}
          </button>
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={handleClose}
        className="w-6 h-6 flex items-center justify-center rounded-md text-[#87909B] hover:text-[#15191E] hover:bg-[#F5F6F7] transition-colors cursor-pointer"
        aria-label="Close notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default Toast;
