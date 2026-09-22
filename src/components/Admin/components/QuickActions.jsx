import React from "react";
import { Plus, Users, Zap } from "lucide-react";

/**
 * Modern Clean Quick Actions Component
 * Following Reference 1 specifications
 */
const QuickActions = ({ onCreateTask, onManageTeam }) => {
  const actions = [
    {
      label: "Dispatch New Task",
      icon: Plus,
      color: "hover:border-[#10B981] hover:text-[#15803D] hover:bg-[#DCFCE7]/40",
      onClick: onCreateTask,
    },
    {
      label: "Manage Team Staff",
      icon: Users,
      color: "hover:border-[#6366F1] hover:text-[#3730A3] hover:bg-[#EEF2FF]",
      onClick: onManageTeam,
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-[#E1E5E9] p-4 shadow-2xs">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#5E6875] mb-3 flex items-center gap-1.5">
        <Zap className="w-3.5 h-3.5 text-[#4F46E5]" />
        Quick Shortcuts
      </h3>
      <div className="space-y-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              type="button"
              onClick={action.onClick}
              className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl border border-[#E1E5E9] bg-[#F8FAFC] text-[#15191E] transition-all duration-150 cursor-pointer text-xs font-semibold ${action.color}`}
              aria-label={action.label}
            >
              <Icon className="w-4 h-4 shrink-0 text-[#5E6875]" />
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
