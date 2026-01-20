import React from "react";

/**
 * Stats Card Component
 */
// eslint-disable-next-line no-unused-vars
const StatsCard = ({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    emerald: "from-emerald-400 to-emerald-600 shadow-emerald-500/20",
    blue: "from-blue-400 to-blue-600 shadow-blue-500/20",
    amber: "from-amber-400 to-amber-600 shadow-amber-500/20",
    red: "from-red-400 to-red-600 shadow-red-500/20",
  };

  return (
    <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50 hover:border-zinc-600 transition-all duration-300">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-lg bg-linear-to-br ${colorClasses[color]} flex items-center justify-center shadow-lg`}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-xs text-zinc-400">{label}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
