import React from "react";
import { Icons } from "./Icons.jsx";

/**
 * Search Bar Component
 */
const SearchBar = ({ value, onChange }) => {
  return (
    <div className="relative flex-1 max-w-md">
      <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
      <input
        type="text"
        placeholder="Search tasks, assignees, categories..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-12 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
      />
    </div>
  );
};

export default SearchBar;
