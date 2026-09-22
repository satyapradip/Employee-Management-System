import React from "react";
import { Tag } from "lucide-react";
import { CATEGORIES } from "../../../constants/taskConstants";

/**
 * Modern Category Selector Component
 * Following Reference 1 specifications
 */
const CategorySelector = ({ selected, onSelect }) => {
  return (
    <div>
      <label className="flex items-center gap-2 text-xs font-semibold text-[#5E6875] uppercase tracking-wider mb-2.5">
        <Tag className="w-3.5 h-3.5 text-[#4F46E5]" />
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
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                isSelected
                  ? "bg-[#101827] text-white shadow-2xs border border-[#101827]"
                  : "bg-white text-[#5E6875] hover:text-[#15191E] hover:bg-[#F8FAFC] border border-[#E1E5E9]"
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
