import React from "react";
import { ListTodo, PlusCircle, Users, BarChart3 } from "lucide-react";

/**
 * Modern Segmented Tab Navigation Component
 */
const TabNavigation = ({
  activeTab,
  setActiveTab,
  taskCount,
  employeeCount = 0,
  analyticsEnabled = false,
}) => {
  const tabs = [
    {
      key: "tasks",
      label: "All Tasks",
      icon: ListTodo,
      count: taskCount,
    },
    {
      key: "create",
      label: "Create Task",
      icon: PlusCircle,
      count: null,
    },
    {
      key: "employees",
      label: "Employees",
      icon: Users,
      count: employeeCount,
    },
    {
      key: "analytics",
      label: "Analytics",
      icon: BarChart3,
      count: null,
      hidden: !analyticsEnabled,
    },
  ];

  return (
    <div className="flex items-center gap-2 p-1.5 glass-panel rounded-2xl border border-white/10 overflow-x-auto scrollbar-none">
      {tabs
        .filter((tab) => !tab.hidden)
        .map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 whitespace-nowrap cursor-pointer ${
                isActive
                  ? "btn-primary-gradient shadow-md shadow-indigo-600/30"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
              aria-pressed={isActive}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count != null && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-white/5 text-zinc-400"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
    </div>
  );
};

export default TabNavigation;
