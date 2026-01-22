import React from "react";
import { Icons } from "./Icons";

/**
 * Toast Notification Component
 * Professional toast notifications with animations
 */
const Toast = ({ toast, onDismiss }) => {
  if (!toast) return null;

  const { message, type = "success" } = toast;

  const styles = {
    success: {
      bg: "bg-emerald-500/10 border-emerald-500/50",
      icon: "text-emerald-400",
      text: "text-emerald-300",
    },
    error: {
      bg: "bg-red-500/10 border-red-500/50",
      icon: "text-red-400",
      text: "text-red-300",
    },
    warning: {
      bg: "bg-amber-500/10 border-amber-500/50",
      icon: "text-amber-400",
      text: "text-amber-300",
    },
    info: {
      bg: "bg-blue-500/10 border-blue-500/50",
      icon: "text-blue-400",
      text: "text-blue-300",
    },
  };

  const style = styles[type] || styles.success;

  const IconComponent = {
    success: Icons.Check,
    error: Icons.Close,
    warning: Icons.Lightning,
    info: Icons.Description,
  }[type];

  return (
    <div className="fixed top-6 right-6 z-50 animate-slideIn">
      <div
        className={`
          flex items-center gap-3 px-5 py-4 rounded-xl border backdrop-blur-xl
          shadow-2xl shadow-black/20 min-w-[320px] max-w-112.5
          ${style.bg}
        `}
      >
        {/* Icon */}
        <div
          className={`
            w-8 h-8 rounded-lg flex items-center justify-center shrink-0
            ${type === "success" ? "bg-emerald-500/20" : ""}
            ${type === "error" ? "bg-red-500/20" : ""}
            ${type === "warning" ? "bg-amber-500/20" : ""}
            ${type === "info" ? "bg-blue-500/20" : ""}
          `}
        >
          {IconComponent && (
            <IconComponent className={`h-5 w-5 ${style.icon}`} />
          )}
        </div>

        {/* Message */}
        <p className={`flex-1 text-sm font-medium ${style.text}`}>{message}</p>

        {/* Dismiss Button */}
        <button
          onClick={onDismiss}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <Icons.Close className="h-4 w-4 text-zinc-400" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
