import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import {
  BarChart3,
  PieChart as PieIcon,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  FolderKanban,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Custom Tooltip Components
   ───────────────────────────────────────────── */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel px-4 py-2.5 rounded-xl border border-white/10 shadow-2xl">
        <p className="text-white font-semibold text-xs">{payload[0].name}</p>
        <p className="text-zinc-400 text-xs mt-0.5">
          Count: <span className="text-indigo-400 font-bold">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

const PercentageTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="glass-panel px-4 py-2.5 rounded-xl border border-white/10 shadow-2xl">
        <p className="text-white font-semibold text-xs">{data.name}</p>
        <p className="text-zinc-400 text-xs mt-0.5">
          Tasks: <span className="text-white font-bold">{data.value}</span>
        </p>
        {data.percentage !== undefined && (
          <p className="text-zinc-400 text-xs">
            Ratio: <span className="text-indigo-400 font-bold">{data.percentage}%</span>
          </p>
        )}
      </div>
    );
  }
  return null;
};

/* ─────────────────────────────────────────────
   Stat Card Component
   ───────────────────────────────────────────── */
const StatCard = ({ title, value, icon: Icon, color, bgColor, percentage }) => {
  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1">
            {title}
          </p>
          <h3 className="font-display text-3xl font-bold text-white mb-1">
            {value}
          </h3>
          {percentage !== undefined && (
            <p className="text-[11px] text-zinc-500 font-medium">
              {percentage}% of total workload
            </p>
          )}
        </div>
        <div
          className={`w-11 h-11 ${bgColor} rounded-xl border border-white/10 flex items-center justify-center`}
        >
          {Icon && <Icon className={`h-5 w-5 ${color}`} />}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Empty State Component
   ───────────────────────────────────────────── */
const EmptyAnalytics = () => {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500">
        <BarChart3 className="w-8 h-8 text-zinc-500" />
      </div>
      <h3 className="font-display text-white font-semibold mb-1 text-base">
        No Telemetry Collected Yet
      </h3>
      <p className="text-zinc-400 text-xs max-w-sm mx-auto">
        Analytics will materialize automatically as you assign tasks and team members begin execution.
      </p>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main AnalyticsTab Component
   ───────────────────────────────────────────── */
const AnalyticsTab = ({ stats, employees = [], isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 glass-panel rounded-2xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 glass-panel rounded-2xl" />
            <div className="h-80 glass-panel rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!stats || stats.total === 0) {
    return (
      <div className="p-6">
        <EmptyAnalytics />
      </div>
    );
  }

  // Status breakdown
  const statusData = [
    {
      name: "New",
      value: stats.new || 0,
      color: "#8b5cf6", // violet
      percentage: stats.total > 0 ? Math.round((stats.new / stats.total) * 100) : 0,
    },
    {
      name: "In Progress",
      value: stats.active || 0,
      color: "#f59e0b", // amber
      percentage: stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0,
    },
    {
      name: "Completed",
      value: stats.completed || 0,
      color: "#10b981", // emerald
      percentage: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
    },
    {
      name: "Failed",
      value: stats.failed || 0,
      color: "#f43f5e", // rose
      percentage: stats.total > 0 ? Math.round((stats.failed / stats.total) * 100) : 0,
    },
  ].filter((item) => item.value > 0);

  // Category breakdown
  const categoryData = Object.entries(stats.byCategory || {}).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    fill: getCategoryColor(name),
  }));

  // Employee performance
  const employeePerformanceData = employees
    .filter((emp) => emp.taskStats && emp.taskStats.total > 0)
    .map((emp) => ({
      name: emp.name.split(" ")[0],
      total: emp.taskStats.total || 0,
      completed: emp.taskStats.completed || 0,
      active: emp.taskStats.active || 0,
      completionRate:
        emp.taskStats.total > 0
          ? Math.round((emp.taskStats.completed / emp.taskStats.total) * 100)
          : 0,
    }))
    .sort((a, b) => b.completionRate - a.completionRate)
    .slice(0, 8);

  const completionRate =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <>
      {/* Header */}
      <div className="p-6 border-b border-white/10 bg-linear-to-r from-purple-950/20 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-white">
              Executive Telemetry &amp; Velocity
            </h2>
            <p className="text-zinc-400 text-xs">
              Live organizational throughput metrics and performance distribution
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Tasks"
            value={stats.total}
            icon={FolderKanban}
            color="text-indigo-400"
            bgColor="bg-indigo-500/10"
          />
          <StatCard
            title="Active Tasks"
            value={stats.active || 0}
            icon={Clock}
            color="text-amber-400"
            bgColor="bg-amber-500/10"
            percentage={stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}
          />
          <StatCard
            title="Completed"
            value={stats.completed || 0}
            icon={CheckCircle2}
            color="text-emerald-400"
            bgColor="bg-emerald-500/10"
            percentage={completionRate}
          />
          <StatCard
            title="Failed / Blocked"
            value={stats.failed || 0}
            icon={AlertCircle}
            color="text-rose-400"
            bgColor="bg-rose-500/10"
            percentage={stats.total > 0 ? Math.round((stats.failed / stats.total) * 100) : 0}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Breakdown */}
          <div className="glass-card rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <PieIcon className="w-4 h-4 text-indigo-400" />
              <h3 className="font-display font-semibold text-sm text-white">
                Task Status Distribution
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  innerRadius={50}
                  paddingAngle={4}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PercentageTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: "12px", color: "#94a3b8" }}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category Breakdown */}
          <div className="glass-card rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <FolderKanban className="w-4 h-4 text-cyan-400" />
              <h3 className="font-display font-semibold text-sm text-white">
                Tasks by Operational Category
              </h3>
            </div>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                  />
                  <YAxis
                    stroke="#64748b"
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-65 flex items-center justify-center text-xs text-zinc-500">
                No category breakdown available
              </div>
            )}
          </div>
        </div>

        {/* Employee Performance Chart */}
        {employeePerformanceData.length > 0 && (
          <div className="glass-card rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-emerald-400" />
              <h3 className="font-display font-semibold text-sm text-white">
                Team Member Output Comparison
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={employeePerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <YAxis
                  stroke="#64748b"
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: "12px", fontSize: "12px" }}
                  iconType="circle"
                />
                <Bar
                  dataKey="completed"
                  name="Completed"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="active"
                  name="Active"
                  fill="#f59e0b"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Insight Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-4 h-4" />
              Delivery Velocity
            </div>
            <div className="font-display font-bold text-2xl text-emerald-400 mb-0.5">
              {completionRate}% Success Rate
            </div>
            <p className="text-zinc-400 text-xs">
              {stats.completed} of {stats.total} total deliverables completed
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Clock className="w-4 h-4" />
              In Flight
            </div>
            <div className="font-display font-bold text-2xl text-amber-400 mb-0.5">
              {stats.active || 0} Active Tasks
            </div>
            <p className="text-zinc-400 text-xs">
              Actively being engineered by team members
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-indigo-500/20 bg-indigo-500/5">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Users className="w-4 h-4" />
              Active Contributors
            </div>
            <div className="font-display font-bold text-2xl text-indigo-400 mb-0.5">
              {employeePerformanceData.length} Staff
            </div>
            <p className="text-zinc-400 text-xs">
              Team members currently executing tasks
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

function getCategoryColor(category) {
  const colors = {
    development: "#6366f1",
    design: "#a855f7",
    marketing: "#ec4899",
    sales: "#10b981",
    support: "#f59e0b",
    research: "#06b6d4",
    operations: "#8b5cf6",
    other: "#64748b",
  };
  return colors[category?.toLowerCase()] || colors.other;
}

export default AnalyticsTab;
