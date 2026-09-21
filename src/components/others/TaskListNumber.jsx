import React, { useMemo } from "react";
import { PlayCircle, Sparkles, CheckCircle2, AlertCircle, BarChart2 } from "lucide-react";

/**
 * Modern Task Statistics Component
 * Displays actionable metrics and completion progress
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
    <div className="mb-8 animate-fadeIn">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Deliverable Throughput Overview
        </h3>
        {stats.total > 0 && (
          <span className="text-xs text-zinc-400 font-mono">
            {stats.completed} of {stats.total} resolved ({completionRate}%)
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* In Progress — Primary Active Deliverables */}
        <div className="glass-card rounded-2xl p-5 border border-amber-500/30 bg-amber-500/5 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                In Progress
              </div>
              <div className="font-display font-bold text-3xl sm:text-4xl text-white">
                {stats.active}
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                {stats.active === 1 ? "task in execution" : "tasks in execution"}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <PlayCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* New Incoming Tasks */}
        <div className="glass-card rounded-2xl p-5 border border-violet-500/30 bg-violet-500/5 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-violet-400 uppercase tracking-wider mb-1">
                <span className="w-2 h-2 rounded-full bg-violet-400" />
                New Assignments
              </div>
              <div className="font-display font-bold text-3xl sm:text-4xl text-white">
                {stats.newTask}
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                awaiting your acceptance
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="glass-card rounded-2xl p-5 border border-emerald-500/30 bg-emerald-500/5 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Completed
              </div>
              <div className="font-display font-bold text-3xl sm:text-4xl text-white">
                {stats.completed}
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                successfully resolved
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Failed / Blocked Tasks */}
        <div className="glass-card rounded-2xl p-5 border border-rose-500/30 bg-rose-500/5 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 uppercase tracking-wider mb-1">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                Blocked / Failed
              </div>
              <div className="font-display font-bold text-3xl sm:text-4xl text-white">
                {stats.failed}
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                escalated with blocker note
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Velocity Progress Bar */}
      {stats.total > 0 && (
        <div className="mt-4 glass-panel p-3.5 rounded-xl border border-white/5">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
            <span className="flex items-center gap-1.5 font-medium">
              <BarChart2 className="w-3.5 h-3.5 text-indigo-400" />
              Sprint Resolution Progress
            </span>
            <span className="font-bold text-white font-mono">
              {completionRate}%
            </span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskListNumber;
