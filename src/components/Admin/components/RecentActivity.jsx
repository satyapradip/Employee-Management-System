import React from "react";
import { Icons } from "./Icons.jsx";

/**
 * Recent Activity Component
 */
const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      action: "Task completed",
      task: "Deploy App",
      user: "Tom Brown",
      time: "2 hours ago",
      type: "completed",
    },
    {
      id: 2,
      action: "New task assigned",
      task: "API Integration",
      user: "Jane Smith",
      time: "4 hours ago",
      type: "new",
    },
    {
      id: 3,
      action: "Task in progress",
      task: "Build Login UI",
      user: "John Doe",
      time: "5 hours ago",
      type: "progress",
    },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case "completed":
        return <Icons.Check className="h-3 w-3" />;
      case "new":
        return <Icons.Plus className="h-3 w-3" />;
      case "progress":
        return <Icons.Refresh className="h-3 w-3" />;
      default:
        return <Icons.Clock className="h-3 w-3" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "completed":
        return "bg-emerald-500/20 text-emerald-400";
      case "new":
        return "bg-blue-500/20 text-blue-400";
      case "progress":
        return "bg-amber-500/20 text-amber-400";
      default:
        return "bg-zinc-500/20 text-zinc-400";
    }
  };

  return (
    <div className="bg-zinc-800/50 rounded-xl border border-zinc-700/50 p-4">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <Icons.Clock className="h-4 w-4 text-zinc-400" />
        Recent Activity
      </h3>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-2 rounded-lg hover:bg-zinc-700/30 transition-colors"
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}
            >
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{activity.task}</p>
              <p className="text-xs text-zinc-500">
                {activity.action} • {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
