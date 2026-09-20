import React, { useState } from "react";
import { Icons } from "./Icons.jsx";
import { getStatusIconName } from "../utils/iconHelpers";
import {
  getPriorityColor,
  formatDate,
  getInitials,
  formatStatus,
} from "../utils/taskHelpers";
import { Calendar, Trash2, ChevronDown, ChevronUp, User } from "lucide-react";

/**
 * Modern Status Badge Component
 */
const StatusBadge = ({ status }) => {
  const iconName = getStatusIconName(status);
  const IconComponent = iconName ? Icons[iconName] : null;

  const badgeStyles = {
    new: "bg-violet-500/15 text-violet-300 border-violet-500/30",
    "in-progress": "bg-amber-500/15 text-amber-300 border-amber-500/30",
    active: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    completed: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    failed: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  };

  const style = badgeStyles[status] || "bg-zinc-700/20 text-zinc-300 border-zinc-600/30";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${style}`}
    >
      {IconComponent && <IconComponent className="h-3.5 w-3.5" />}
      {formatStatus(status)}
    </span>
  );
};

/**
 * Assignee Info Component
 */
const AssigneeInfo = ({ name }) => (
  <div className="flex items-center gap-2">
    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
      {getInitials(name)}
    </div>
    <span className="text-zinc-300 text-xs font-medium truncate max-w-[120px]">
      {name || "Unassigned"}
    </span>
  </div>
);

/**
 * Due Date Component
 */
const DueDate = ({ date }) => (
  <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-medium">
    <Calendar className="w-3.5 h-3.5 text-zinc-500" />
    <span>{formatDate(date)}</span>
  </div>
);

/**
 * Task Card Component
 */
const TaskCard = ({ task, index, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="group glass-card rounded-2xl p-5 border border-white/10 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div>
        {/* Card Header: Category & Priority + Status Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${getPriorityColor(
                task.priority
              )} shadow-sm`}
            />
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              {task.category || "General"}
            </span>
            <span className="text-[10px] text-zinc-500">·</span>
            <span className="text-[11px] font-medium text-zinc-400 capitalize">
              {task.priority} Priority
            </span>
          </div>
          <StatusBadge status={task.status} />
        </div>

        {/* Task Title */}
        <h3 className="text-white font-display font-semibold text-base mb-1.5 group-hover:text-indigo-300 transition-colors leading-snug">
          {task.title}
        </h3>

        {/* Task Description */}
        <p className="text-zinc-400 text-xs leading-relaxed mb-4 line-clamp-2">
          {task.description}
        </p>
      </div>

      {/* Card Footer: Assignee & Date */}
      <div>
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <AssigneeInfo name={task.assignedTo} />
          <DueDate date={task.date} />
        </div>

        {/* Hover / Expand Actions */}
        <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-white/5">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
            aria-expanded={isExpanded}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                Hide Details
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                View Details
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-rose-400 hover:bg-rose-500/15 hover:text-rose-300 transition-colors text-xs font-semibold cursor-pointer"
            aria-label="Delete this task"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>

        {/* Expanded Details Section */}
        {isExpanded && (
          <div className="mt-3 p-3.5 rounded-xl bg-zinc-900/80 border border-white/5 space-y-2 text-xs animate-fadeIn">
            <div className="grid grid-cols-2 gap-2 text-zinc-400">
              <div>
                <span className="text-zinc-500">Created:</span>{" "}
                <span className="text-zinc-300 font-medium">
                  {task.createdAt ? formatDate(task.createdAt) : "N/A"}
                </span>
              </div>
              <div>
                <span className="text-zinc-500">Target Date:</span>{" "}
                <span className="text-zinc-300 font-medium">
                  {formatDate(task.date)}
                </span>
              </div>
            </div>
            <div>
              <span className="text-zinc-500 block mb-1">Full Scope:</span>
              <p className="text-zinc-300 leading-relaxed bg-black/20 p-2.5 rounded-lg">
                {task.description}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
