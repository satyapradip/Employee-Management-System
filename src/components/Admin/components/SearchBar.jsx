import React from "react";
import { Search } from "lucide-react";

/**
 * Modernized Clean Search Bar Component
 * Following Reference 1 specifications
 */
const SearchBar = ({ value, onChange }) => {
  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#87909B]" />
      <input
        type="text"
        placeholder="Search tasks, assignees, categories..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 bg-white border border-[#E1E5E9] focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 rounded-xl text-xs sm:text-sm text-[#15191E] placeholder:text-[#87909B] transition-all"
      />
    </div>
  );
};

export default SearchBar;
