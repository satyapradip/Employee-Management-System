import React from "react";
import { Icons } from "./Icons.jsx";
import StatsCard from "./StatsCard";
import RecentActivity from "./RecentActivity";
import QuickActions from "./QuickActions";

/**
 * Sidebar Component
 * Contains stats, recent activity, and quick actions
 */
const Sidebar = ({ stats, onCreateTask, onRefresh, isLoading = false }) => {
  return (
    <div className="space-y-4">
      {/* Refresh Button */}
      <div className="flex justify-end">
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-50"
        >
          <Icons.Refresh
            className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
          {isLoading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatsCard
          icon={Icons.Check}
          label="Completed"
          value={stats.completed}
          color="emerald"
        />
        <StatsCard
          icon={Icons.Refresh}
          label="In Progress"
          value={stats.inProgress}
          color="blue"
        />
        <StatsCard
          icon={Icons.Clock}
          label="Pending"
          value={stats.pending}
          color="amber"
        />
        <StatsCard
          icon={Icons.X}
          label="Failed"
          value={stats.failed}
          color="red"
        />
      </div>

      {/* Recent Activity */}
      <RecentActivity />

      {/* Quick Actions */}
      <QuickActions onCreateTask={onCreateTask} />
    </div>
  );
};

export default Sidebar;
