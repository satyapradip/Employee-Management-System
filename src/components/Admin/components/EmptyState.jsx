import React from "react";
import { Icons } from "./Icons.jsx";

/**
 * Empty State Component
 * Shown when no tasks match the current filter
 */
const EmptyState = ({ filter }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
        <Icons.Empty className="h-10 w-10 text-zinc-600" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">No tasks found</h3>
      <p className="text-zinc-400 max-w-sm">
        {filter === "all"
          ? "There are no tasks yet. Create your first task to get started!"
          : `No tasks with "${filter}" status. Try a different filter.`}
      </p>
    </div>
  );
};

export default EmptyState;
