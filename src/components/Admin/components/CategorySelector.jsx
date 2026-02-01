import React from "react";
import { Icons } from "./Icons.jsx";
import { CATEGORIES } from "../../../constants/taskConstants";

/**
 * Category Selector Component
 * Grid of category buttons for task creation
 */
const CategorySelector = ({ selected, onSelect }) => {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-3">
        <Icons.Tag className="h-4 w-4" />
        Category
      </label>
      <div className="grid grid-cols-4 gap-2">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => onSelect(category)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selected === category
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                : "bg-zinc-800/50 text-zinc-400 border border-zinc-700 hover:border-zinc-600"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
