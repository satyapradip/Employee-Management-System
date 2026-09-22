import React from "react";
import { CheckCircle2, PlusCircle, PlayCircle, Clock } from "lucide-react";

/**
 * Modernized Clean Recent Activity Component
 * Following Reference 1 specifications
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
        return <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />;
      case "new":
        return <PlusCircle className="w-3.5 h-3.5 text-[#3730A3]" />;
      case "progress":
        return <PlayCircle className="w-3.5 h-3.5 text-[#B45309]" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-[#5E6875]" />;
    }
  };

  const getActivityBadge = (type) => {
    switch (type) {
      case "completed":
        return "bg-[#DCFCE7] border-[#BBF7D0]";
      case "new":
        return "bg-[#EEF2FF] border-[#E0E7FF]";
      case "progress":
        return "bg-[#FEF3C7] border-[#FDE68A]";
      default:
        return "bg-[#F5F6F7] border-[#E1E5E9]";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E1E5E9] p-4 shadow-2xs">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#5E6875] mb-3 flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5 text-[#4F46E5]" />
        Activity Feed
      </h3>
      <div className="space-y-2">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-2.5 p-2 rounded-xl bg-[#F8FAFC] border border-[#E1E5E9]/60 hover:border-[#CBD2D9] transition-colors"
          >
            <div
              className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${getActivityBadge(
                activity.type
              )}`}
            >
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#15191E] truncate">
                {activity.task}
              </p>
              <p className="text-[11px] text-[#5E6875]">
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
