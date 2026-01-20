import React from "react";
import { STATUSES } from "../data/sampleTasks";

/**
 * Filter Pills Component
 */
const FilterPills = ({ activeFilter, setActiveFilter, stats }) => {
  const getFilterCount = (filter) => {
    if (filter === "all") return stats.total;
    if (filter === "in-progress") return stats.inProgress;
    return stats[filter] || 0;
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {STATUSES.map((filter) => (
        <button
          key={filter}
          onClick={() => setActiveFilter(filter)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeFilter === filter
              ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
              : "bg-zinc-800/50 text-zinc-400 border border-zinc-700 hover:border-zinc-600"
          }`}
        >
          {filter.charAt(0).toUpperCase() + filter.slice(1).replace("-", " ")}
          <span className="ml-1.5 text-xs opacity-70">
            ({getFilterCount(filter)})
          </span>
        </button>
      ))}
    </div>
  );
};

export default FilterPills;
