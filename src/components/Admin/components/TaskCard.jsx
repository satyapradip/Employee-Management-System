import React, { useState } from "react";
import { Icons } from "./Icons.jsx";
import { getStatusIconName } from "../utils/iconHelpers";
import {
  getPriorityColor,
  formatDate,
  getInitials,
  formatStatus,
} from "../utils/taskHelpers";
import { Calendar, Trash2, ChevronDown, ChevronUp } from "lucide-react";

/**
 * Modern Status Badge Component
 * Soft pastel background with strong semantic color
 * Following Reference 1 specifications
 */
const StatusBadge = ({ status }) => {
  const iconName = getStatusIconName(status);
  const IconComponent = iconName ? Icons[iconName] : null;

  const badgeStyles = {
    new: "bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]",
    "in-progress": "bg-[#EEF2FF] text-[#3730A3] border-[#E0E7FF]",
    active: "bg-[#EEF2FF] text-[#3730A3] border-[#E0E7FF]",
    completed: "bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]",
    failed: "bg-[#FEE2E2] text-[#B91C1C] border-[#FECACA]",
  };

  const style = badgeStyles[status] || "bg-[#F5F6F7] text-[#5E6875] border-[#E1E5E9]";

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${style}`}
    >
      {IconComponent && <IconComponent className="h-3 w-3" />}
      {formatStatus(status)}
    </span>
  );
};

/**
 * Assignee Info Component
 */
const AssigneeInfo = ({ name }) => (
  <div className="flex items-center gap-2">
    <div className="w-6 h-6 rounded-full bg-[#101827] flex items-center justify-center text-[10px] font-bold text-white shadow-2xs">
      {getInitials(name)}
    </div>
    <span className="text-[#15191E] text-xs font-medium truncate max-w-30">
      {name || "Unassigned"}
    </span>
  </div>
);

/**
 * Due Date Component
 */
const DueDate = ({ date }) => (
  <div className="flex items-center gap-1.5 text-[#5E6875] text-xs font-medium">
    <Calendar className="w-3.5 h-3.5 text-[#87909B]" />
    <span>{formatDate(date)}</span>
  </div>
);

/**
 * Task Card Component
 * Crisp white surface with subtle 1px border and refined information hierarchy
 */
const TaskCard = ({ task, index, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="group saas-card p-5 flex flex-col justify-between"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div>
        {/* Card Header: Category & Priority + Status Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${getPriorityColor(
                task.priority
              )} shadow-2xs`}
            />
            <span className="text-[11px] font-semibold text-[#5E6875] uppercase tracking-wider">
              {task.category || "General"}
            </span>
            <span className="text-[10px] text-[#CBD2D9]">·</span>
            <span className="text-[11px] font-medium text-[#5E6875] capitalize">
              {task.priority} Priority
            </span>
          </div>
          <StatusBadge status={task.status} />
        </div>

        {/* Task Title */}
        <h3 className="text-[#15191E] font-display font-semibold text-base mb-1.5 group-hover:text-[#4F46E5] transition-colors leading-snug">
          {task.title}
        </h3>

        {/* Task Description */}
        <p className="text-[#5E6875] text-xs leading-relaxed mb-4 line-clamp-2">
          {task.description}
        </p>
      </div>

      {/* Card Footer: Assignee & Date */}
      <div>
        <div className="flex items-center justify-between pt-3 border-t border-[#E1E5E9]">
          <AssigneeInfo name={task.assignedTo} />
          <DueDate date={task.date} />
        </div>

        {/* Expand Details & Actions */}
        <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-[#E1E5E9]/60">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs font-semibold text-[#5E6875] hover:text-[#15191E] transition-colors cursor-pointer"
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
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[#B91C1C] hover:bg-[#FEE2E2] transition-colors text-xs font-semibold cursor-pointer"
            aria-label="Delete this task"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>

        {/* Expanded Details Section */}
        {isExpanded && (
          <div className="mt-3 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E1E5E9] space-y-2 text-xs animate-fadeIn">
            <div className="grid grid-cols-2 gap-2 text-[#5E6875]">
              <div>
                <span className="text-[#87909B]">Created:</span>{" "}
                <span className="text-[#15191E] font-medium">
                  {task.createdAt ? formatDate(task.createdAt) : "N/A"}
                </span>
              </div>
              <div>
                <span className="text-[#87909B]">Target Date:</span>{" "}
                <span className="text-[#15191E] font-medium">
                  {formatDate(task.date)}
                </span>
              </div>
            </div>
            <div>
              <span className="text-[#87909B] block mb-1">Full Scope:</span>
              <p className="text-[#15191E] leading-relaxed bg-white border border-[#E1E5E9] p-2.5 rounded-lg">
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
