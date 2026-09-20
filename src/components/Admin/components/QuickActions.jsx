import React from "react";
import { Plus, Users, Zap } from "lucide-react";

/**
 * Modern Quick Actions Component
 */
const QuickActions = ({ onCreateTask, onManageTeam }) => {
  const actions = [
    {
      label: "Dispatch New Task",
      icon: Plus,
      color: "hover:border-emerald-500/40 hover:text-emerald-300 hover:bg-emerald-500/10",
      onClick: onCreateTask,
    },
    {
      label: "Manage Team Staff",
      icon: Users,
      color: "hover:border-indigo-500/40 hover:text-indigo-300 hover:bg-indigo-500/10",
      onClick: onManageTeam,
    },
  ];

  return (
    <div className="glass-card rounded-2xl border border-white/10 p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
        <Zap className="w-3.5 h-3.5 text-indigo-400" />
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
              className={`w-full flex items-center gap-3 p-2.5 rounded-xl border border-white/5 bg-white/5 text-zinc-300 transition-all duration-200 cursor-pointer ${action.color}`}
              aria-label={action.label}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="text-xs font-semibold">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
