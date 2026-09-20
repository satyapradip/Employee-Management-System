import React from "react";
import { CheckCircle2, PlusCircle, PlayCircle, Clock } from "lucide-react";

/**
 * Modernized Recent Activity Component
 */
const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      action: "Task completed",
      task: "Deploy Security Patch",
      user: "Tom Brown",
      time: "2h ago",
      type: "completed",
    },
    {
      id: 2,
      action: "New task assigned",
      task: "API Webhook Integration",
      user: "Jane Smith",
      time: "4h ago",
      type: "new",
    },
    {
      id: 3,
      action: "Task in progress",
      task: "Build OAuth Flow",
      user: "John Doe",
      time: "5h ago",
      type: "progress",
    },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case "completed":
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case "new":
        return <PlusCircle className="w-3.5 h-3.5 text-indigo-400" />;
      case "progress":
        return <PlayCircle className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  const getActivityBadge = (type) => {
    switch (type) {
      case "completed":
        return "bg-emerald-500/10 border-emerald-500/20";
      case "new":
        return "bg-indigo-500/10 border-indigo-500/20";
      case "progress":
        return "bg-amber-500/10 border-amber-500/20";
      default:
        return "bg-zinc-800 border-zinc-700";
    }
  };

  return (
    <div className="glass-card rounded-2xl border border-white/10 p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5 text-indigo-400" />
        Activity Feed
      </h3>
      <div className="space-y-2.5">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-2.5 p-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
          >
            <div
              className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${getActivityBadge(
                activity.type
              )}`}
            >
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {activity.task}
              </p>
              <p className="text-[11px] text-zinc-400">
                {activity.user} · {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
