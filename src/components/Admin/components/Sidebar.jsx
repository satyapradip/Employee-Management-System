import React from "react";
import StatsCard from "./StatsCard";
import RecentActivity from "./RecentActivity";
import QuickActions from "./QuickActions";
import { RotateCw, CheckCircle2, Clock, AlertCircle, PlayCircle } from "lucide-react";

/**
 * Modernized Admin Contextual Sidebar Component
 * Following Reference 1 specifications: clean light surfaces, restrained shadows, organized stats
 */
const Sidebar = ({
  stats,
  onCreateTask,
  onManageTeam,
  onRefresh,
  isLoading = false,
}) => {
  return (
    <div className="space-y-4">
      {/* Telemetry Sync Bar */}
      <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-[#E1E5E9] shadow-2xs">
        <span className="text-xs font-semibold text-[#5E6875] uppercase tracking-wider">
          Live Telemetry
        </span>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#15191E] hover:bg-[#F8FAFC] border border-[#E1E5E9] rounded-lg transition-all disabled:opacity-50 cursor-pointer"
        >
          <RotateCw className={`w-3.5 h-3.5 text-[#4F46E5] ${isLoading ? "animate-spin" : ""}`} />
          <span>{isLoading ? "Syncing..." : "Sync"}</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatsCard
          icon={CheckCircle2}
          label="Completed"
          value={stats.completed}
          color="emerald"
        />
        <StatsCard
          icon={PlayCircle}
          label="In Progress"
          value={stats.inProgress}
          color="blue"
        />
        <StatsCard
          icon={Clock}
          label="Pending"
          value={stats.pending}
          color="amber"
        />
        <StatsCard
          icon={AlertCircle}
          label="Failed"
          value={stats.failed}
          color="red"
        />
      </div>

      {/* Quick Actions */}
      <QuickActions onCreateTask={onCreateTask} onManageTeam={onManageTeam} />

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
};

export default Sidebar;
