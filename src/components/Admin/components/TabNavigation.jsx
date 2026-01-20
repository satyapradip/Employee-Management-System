import React from "react";
import { Icons } from "./Icons.jsx";

/**
 * Tab Navigation Component
 * Switches between All Tasks and Create Task views
 */
const TabNavigation = ({ activeTab, setActiveTab, taskCount }) => {
  return (
    <div className="flex items-center gap-2 mb-6">
      <button
        onClick={() => setActiveTab("tasks")}
        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
          activeTab === "tasks"
            ? "bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
            : "bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700 hover:text-white"
        }`}
      >
        <Icons.Tasks className="h-5 w-5" />
        All Tasks
        <span className="px-2 py-0.5 rounded-full text-xs bg-white/20">
          {taskCount}
        </span>
      </button>

      <button
        onClick={() => setActiveTab("create")}
        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
          activeTab === "create"
            ? "bg-linear-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25"
            : "bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700 hover:text-white"
        }`}
      >
        <Icons.Plus className="h-5 w-5" />
        Create Task
      </button>
    </div>
  );
};

export default TabNavigation;
