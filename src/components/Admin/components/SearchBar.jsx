import React from "react";
import { Search } from "lucide-react";

/**
 * Modernized Search Bar Component
 */
const SearchBar = ({ value, onChange }) => {
  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
      <input
        type="text"
        placeholder="Search tasks, assignees, categories..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-11 pr-4 py-2.5 glass-input rounded-xl text-sm placeholder:text-zinc-500"
      />
    </div>
  );
};

export default SearchBar;
