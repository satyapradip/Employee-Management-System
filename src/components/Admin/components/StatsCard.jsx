import React from "react";

/**
 * Modern Stats Card Component
 */
const StatsCard = ({ icon, label, value, color }) => {
  const colorSchemes = {
    emerald: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      iconBg: "bg-emerald-500/20 text-emerald-400",
      text: "text-emerald-400",
    },
    blue: {
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
      iconBg: "bg-indigo-500/20 text-indigo-400",
      text: "text-indigo-400",
    },
    amber: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      iconBg: "bg-amber-500/20 text-amber-400",
      text: "text-amber-400",
    },
    red: {
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
      iconBg: "bg-rose-500/20 text-rose-400",
      text: "text-rose-400",
    },
  };

  const scheme = colorSchemes[color] || colorSchemes.blue;

  return (
    <div
      className={`glass-card rounded-2xl p-4 border ${scheme.border} transition-all duration-300 hover:scale-[1.02]`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          {label}
        </span>
        <div
          className={`w-7 h-7 rounded-lg ${scheme.iconBg} flex items-center justify-center`}
        >
          {icon && React.createElement(icon, { className: "h-4 w-4" })}
        </div>
      </div>
      <div className="font-display text-2xl font-bold text-white">
        {value ?? 0}
      </div>
    </div>
  );
};

export default StatsCard;
