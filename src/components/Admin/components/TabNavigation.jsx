import React from "react";
import { ListTodo, PlusCircle, Users, BarChart3 } from "lucide-react";

/**
 * Modern Segmented Tab Navigation Component
 * Following Reference 1 clean pill / segmented bar design
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
    <div className="flex items-center gap-1.5 p-1.5 bg-white border border-[#E1E5E9] rounded-2xl shadow-2xs overflow-x-auto scrollbar-none">
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
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-150 whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-[#101827] text-white shadow-xs"
                  : "text-[#5E6875] hover:text-[#15191E] hover:bg-[#F8FAFC]"
              }`}
              aria-pressed={isActive}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count != null && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-[#F5F6F7] text-[#5E6875]"
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
