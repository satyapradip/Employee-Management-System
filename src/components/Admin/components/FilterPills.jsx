import React from "react";
import { STATUSES } from "../../../constants/taskConstants";

/**
 * Filter Pills Component with modern pill active states
 */
const FilterPills = ({ activeFilter, setActiveFilter, stats }) => {
  const getFilterCount = (filter) => {
    if (filter === "all") return stats.total;
    if (filter === "in-progress") return stats.inProgress;
    return stats[filter] || 0;
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {STATUSES.map((filter) => {
        const isSelected = activeFilter === filter;
        const count = getFilterCount(filter);
        return (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
              isSelected
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-500"
                : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/5"
            }`}
            aria-label={`Filter by ${filter} (${count} tasks)`}
            aria-pressed={isSelected}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1).replace("-", " ")}
            <span className="ml-1.5 opacity-80 font-mono text-[11px]">
              ({count})
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default FilterPills;
