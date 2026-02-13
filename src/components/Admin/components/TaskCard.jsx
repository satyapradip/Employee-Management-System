import React, { useState } from "react";
import { Icons } from "./Icons.jsx";
import { getStatusIconName } from "../utils/iconHelpers";
import {
  getStatusColor,
  getPriorityColor,
  formatDate,
  getInitials,
  formatStatus,
} from "../utils/taskHelpers";

/**
 * Status Badge Component
 */
const StatusBadge = ({ status }) => {
  const iconName = getStatusIconName(status);
  const IconComponent = iconName ? Icons[iconName] : null;

  return (
    <span
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}
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
    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
      {getInitials(name)}
    </div>
    <span className="text-zinc-400 text-sm">{name}</span>
  </div>
);

/**
 * Due Date Component
 */
const DueDate = ({ date }) => (
  <div className="flex items-center gap-1.5 text-zinc-500 text-sm">
    <Icons.Calendar className="h-4 w-4" />
    {formatDate(date)}
  </div>
);

/**
 * Task Card Component
 * Displays individual task information in a card format
 * With edit and delete functionality
 */
const TaskCard = ({ task, index, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="group bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-5 hover:border-zinc-600 hover:bg-zinc-800/80 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 hover:scale-[1.01] animate-cardFadeIn"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}
          />
          <span className="text-xs text-zinc-500 uppercase tracking-wide">
            {task.category}
          </span>
        </div>
        <StatusBadge status={task.status} />
      </div>

      {/* Task Title */}
      <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-blue-400 transition-colors">
        {task.title}
      </h3>

      {/* Task Description */}
      <p className="text-zinc-400 text-sm mb-4 line-clamp-2">
        {task.description}
      </p>

      {/* Card Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-zinc-700/50">
        <AssigneeInfo name={task.assignedTo} />
        <DueDate date={task.date} />
      </div>

      {/* Hover Actions */}
      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-zinc-700/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-700/50 text-zinc-300 hover:bg-zinc-700 transition-colors text-sm cursor-pointer"
          aria-label={isExpanded ? "Hide task details" : "Show task details"}
          aria-expanded={isExpanded}
        >
          <Icons.Description className="h-3.5 w-3.5" aria-hidden="true" />
          Details
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm cursor-pointer"
          aria-label="Delete this task"
        >
          <Icons.Trash className="h-3.5 w-3.5" aria-hidden="true" />
          Delete
        </button>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-zinc-700/50 space-y-3 animate-fadeIn">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-zinc-500">Priority:</span>
              <span className="ml-2 text-white capitalize">
                {task.priority}
              </span>
            </div>
            <div>
              <span className="text-zinc-500">Status:</span>
              <span className="ml-2 text-white">
                {formatStatus(task.status)}
              </span>
            </div>
            <div>
              <span className="text-zinc-500">Created:</span>
              <span className="ml-2 text-white">
                {task.createdAt ? formatDate(task.createdAt) : "N/A"}
              </span>
            </div>
            <div>
              <span className="text-zinc-500">Due:</span>
              <span className="ml-2 text-white">{formatDate(task.date)}</span>
            </div>
          </div>
          <div>
            <span className="text-zinc-500 text-sm">Description:</span>
            <p className="mt-1 text-zinc-300 text-sm">{task.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
