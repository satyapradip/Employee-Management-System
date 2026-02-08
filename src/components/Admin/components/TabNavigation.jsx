import React from "react";
import { Icons } from "./Icons.jsx";

/**
 * Tab Navigation Component
 * Switches between All Tasks, Create Task, and Employees views
 */
const TabNavigation = ({
  activeTab,
  setActiveTab,
  taskCount,
  employeeCount = 0,
}) => {
  const tabs = [
    {
      key: "tasks",
      label: "All Tasks",
      icon: Icons.Tasks,
      count: taskCount,
      activeClass:
        "bg-gradient-to-r from-blue-500 to-blue-600 shadow-blue-500/25",
    },
    {
      key: "create",
      label: "Create Task",
      icon: Icons.Plus,
      count: null,
      activeClass:
        "bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-emerald-500/25",
    },
    {
      key: "employees",
      label: "Employees",
      icon: Icons.Users,
      count: employeeCount,
      activeClass:
        "bg-gradient-to-r from-indigo-500 to-purple-600 shadow-indigo-500/25",
    },
  ];

  return (
    <div className="flex items-center gap-2 mb-6 flex-wrap">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => setActiveTab(tab.key)}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 cursor-pointer ${
            activeTab === tab.key
              ? `${tab.activeClass} text-white shadow-lg`
              : "bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700 hover:text-white"
          }`}
          aria-pressed={activeTab === tab.key}
        >
          <tab.icon className="h-5 w-5" aria-hidden="true" />
          {tab.label}
          {tab.count != null && (
            <span className="px-2 py-0.5 rounded-full text-xs bg-white/20">
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
