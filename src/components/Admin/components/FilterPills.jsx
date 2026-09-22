import React from "react";
import { STATUSES } from "../../../constants/taskConstants";

/**
 * Filter Pills Component with clean SaaS pill active states
 * Following Reference 1 specifications
 */
const FilterPills = ({ activeFilter, setActiveFilter, stats }) => {
  const getFilterCount = (filter) => {
    if (filter === "all") return stats.total;
    if (filter === "in-progress") return stats.inProgress;
    return stats[filter] || 0;
  };

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {STATUSES.map((filter) => {
        const isSelected = activeFilter === filter;
        const count = getFilterCount(filter);
        return (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
              isSelected
                ? "bg-[#101827] text-white shadow-2xs"
                : "bg-white text-[#5E6875] hover:text-[#15191E] hover:bg-[#F8FAFC] border border-[#E1E5E9]"
            }`}
            aria-label={`Filter by ${filter} (${count} tasks)`}
            aria-pressed={isSelected}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1).replace("-", " ")}
            <span className={`ml-1.5 text-[11px] font-mono ${isSelected ? "text-zinc-300" : "text-[#87909B]"}`}>
              ({count})
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default FilterPills;
