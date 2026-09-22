import React from "react";

/**
 * Modern Stats Card Component
 * Clean white surface with soft pastel badge and dark charcoal typography
 * Following Reference 1 specifications
 */
const StatsCard = ({ icon, label, value, color }) => {
  const colorSchemes = {
    emerald: {
      border: "border-[#E1E5E9]",
      iconBg: "bg-[#DCFCE7] text-[#15803D]",
    },
    blue: {
      border: "border-[#E1E5E9]",
      iconBg: "bg-[#EEF2FF] text-[#3730A3]",
    },
    amber: {
      border: "border-[#E1E5E9]",
      iconBg: "bg-[#FEF3C7] text-[#B45309]",
    },
    red: {
      border: "border-[#E1E5E9]",
      iconBg: "bg-[#FEE2E2] text-[#B91C1C]",
    },
  };

  const scheme = colorSchemes[color] || colorSchemes.blue;

  return (
    <div className="bg-white rounded-xl p-4 border border-[#E1E5E9] shadow-2xs hover:border-[#CBD2D9] transition-all">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
          {label}
        </span>
        <div
          className={`w-7 h-7 rounded-lg ${scheme.iconBg} flex items-center justify-center`}
        >
          {icon && React.createElement(icon, { className: "h-3.5 w-3.5" })}
        </div>
      </div>
      <div className="font-display text-2xl font-bold text-[#0F172A] tracking-[-0.03em]">
        {value ?? 0}
      </div>
    </div>
  );
};

export default StatsCard;
