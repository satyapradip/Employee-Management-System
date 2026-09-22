import React from "react";
import { ListTodo } from "lucide-react";

/**
 * Modernized Empty State Component
 * Clean light SaaS styling matching Reference 1
 */
const EmptyState = ({ filter }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-[#F5F6F7] border border-[#E1E5E9] flex items-center justify-center mb-3.5 text-[#87909B]">
        <ListTodo className="w-7 h-7" />
      </div>
      <h3 className="font-display text-base font-bold text-[#15191E] mb-1">
        No deliverables found
      </h3>
      <p className="text-[#5E6875] text-xs sm:text-sm max-w-sm">
        {filter === "all"
          ? "No tasks have been created in this workspace yet. Click 'Create Task' to delegate deliverables."
          : `No deliverables currently found with "${filter}" status.`}
      </p>
    </div>
  );
};

export default EmptyState;
