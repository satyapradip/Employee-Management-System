import React from "react";
import { ListTodo } from "lucide-react";

/**
 * Modernized Empty State Component
 */
const EmptyState = ({ filter }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-zinc-500">
        <ListTodo className="w-8 h-8" />
      </div>
      <h3 className="font-display text-lg font-semibold text-white mb-1.5">
        No deliverables found
      </h3>
      <p className="text-zinc-400 text-xs sm:text-sm max-w-sm">
        {filter === "all"
          ? "No tasks have been created in this workspace yet. Click 'Create Task' to delegate deliverables."
          : `No deliverables currently found with "${filter}" status.`}
      </p>
    </div>
  );
};

export default EmptyState;
