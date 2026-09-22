import React, { useMemo } from "react";
import { PlayCircle, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

/**
 * Modern Task Statistics Component
 * Displays actionable metrics and completion progress
 * Following Reference 1 clean card and pastel status styling
 */
const TaskListNumber = ({ data }) => {
  const stats = useMemo(() => {
    if (!data?.tasks) {
      return { newTask: 0, active: 0, completed: 0, failed: 0, total: 0 };
    }

    const result = data.tasks.reduce(
      (acc, task) => {
        if (task.newTask) acc.newTask++;
        if (task.active) acc.active++;
        if (task.completed) acc.completed++;
        if (task.failed) acc.failed++;
        acc.total++;
        return acc;
      },
      { newTask: 0, active: 0, completed: 0, failed: 0, total: 0 }
    );
    return result;
  }, [data?.tasks]);

  const completionRate =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="mb-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
          Deliverable Throughput Overview
        </h3>
        {stats.total > 0 && (
          <span className="text-xs text-[#64748B] font-mono">
            {stats.completed} of {stats.total} resolved ({completionRate}%)
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* In Progress — Primary Active Deliverables */}
        <div className="bg-white rounded-xl p-5 border border-[#E1E5E9] shadow-2xs hover:border-[#CBD2D9] transition-all">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#B45309] uppercase tracking-wider mb-1">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
                In Progress
              </div>
              <div className="font-display font-bold text-3xl text-[#0F172A] tracking-[-0.03em]">
                {stats.active}
              </div>
              <p className="text-[11px] text-[#87909B] mt-1">
                {stats.active === 1 ? "task in execution" : "tasks in execution"}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] flex items-center justify-center text-[#B45309]">
              <PlayCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* New Incoming Tasks */}
        <div className="bg-white rounded-xl p-5 border border-[#E1E5E9] shadow-2xs hover:border-[#CBD2D9] transition-all">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#3730A3] uppercase tracking-wider mb-1">
                <span className="w-2 h-2 rounded-full bg-[#4F46E5]" />
                New Assignments
              </div>
              <div className="font-display font-bold text-3xl text-[#0F172A] tracking-[-0.03em]">
                {stats.newTask}
              </div>
              <p className="text-[11px] text-[#87909B] mt-1">
                awaiting your acceptance
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] flex items-center justify-center text-[#3730A3]">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="bg-white rounded-xl p-5 border border-[#E1E5E9] shadow-2xs hover:border-[#CBD2D9] transition-all">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#15803D] uppercase tracking-wider mb-1">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                Completed
              </div>
              <div className="font-display font-bold text-3xl text-[#0F172A] tracking-[-0.03em]">
                {stats.completed}
              </div>
              <p className="text-[11px] text-[#87909B] mt-1">
                successfully resolved
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] flex items-center justify-center text-[#15803D]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Failed / Blocked Tasks */}
        <div className="bg-white rounded-xl p-5 border border-[#E1E5E9] shadow-2xs hover:border-[#CBD2D9] transition-all">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#B91C1C] uppercase tracking-wider mb-1">
                <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                Blocked
              </div>
              <div className="font-display font-bold text-3xl text-[#0F172A] tracking-[-0.03em]">
                {stats.failed}
              </div>
              <p className="text-[11px] text-[#87909B] mt-1">
                deliverable blockers reported
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#FEE2E2] flex items-center justify-center text-[#B91C1C]">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskListNumber;
