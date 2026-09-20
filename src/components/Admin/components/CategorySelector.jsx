import React from "react";
import { Tag } from "lucide-react";
import { CATEGORIES } from "../../../constants/taskConstants";

/**
 * Modern Category Selector Component
 */
const CategorySelector = ({ selected, onSelect }) => {
  return (
    <div>
      <label className="flex items-center gap-2 text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2.5">
        <Tag className="w-3.5 h-3.5 text-indigo-400" />
        Category
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {CATEGORIES.map((category) => {
          const isSelected = selected === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => onSelect(category)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-500"
                  : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/5"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySelector;
