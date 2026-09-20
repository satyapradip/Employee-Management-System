import React from "react";
import { Icons } from "./Icons.jsx";
import StatsCard from "./StatsCard";
import RecentActivity from "./RecentActivity";
import QuickActions from "./QuickActions";
import { RotateCw, CheckCircle2, Clock, AlertCircle, PlayCircle } from "lucide-react";

/**
 * Modernized Admin Sidebar Component
 */
const Sidebar = ({
  stats,
  onCreateTask,
  onManageTeam,
  onRefresh,
  isLoading = false,
}) => {
  return (
    <div className="space-y-5">
      {/* Refresh Action Bar */}
      <div className="flex items-center justify-between glass-panel px-4 py-3 rounded-2xl border border-white/10">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Live Telemetry
        </span>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all disabled:opacity-50 cursor-pointer"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-indigo-400" : ""}`} />
          {isLoading ? "Syncing..." : "Sync"}
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

      {/* Quick Actions Component */}
      <QuickActions onCreateTask={onCreateTask} onManageTeam={onManageTeam} />

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
};

export default Sidebar;
