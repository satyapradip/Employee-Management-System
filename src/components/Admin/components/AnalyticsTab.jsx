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
import { Icons } from "./Icons.jsx";

/* ─────────────────────────────────────────────
   Custom Tooltip Components
   ───────────────────────────────────────────── */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-lg shadow-xl">
        <p className="text-white font-medium">{payload[0].name}</p>
        <p className="text-zinc-400 text-sm">
          Count: <span className="text-white font-semibold">{payload[0].value}</span>
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
      <div className="bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-lg shadow-xl">
        <p className="text-white font-medium">{data.name}</p>
        <p className="text-zinc-400 text-sm">
          Tasks: <span className="text-white font-semibold">{data.value}</span>
        </p>
        {data.percentage && (
          <p className="text-zinc-400 text-sm">
            Percentage: <span className="text-white font-semibold">{data.percentage}%</span>
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
    <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-5 hover:border-zinc-600 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-zinc-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
          {percentage !== undefined && (
            <p className="text-xs text-zinc-500">
              {percentage}% of total tasks
            </p>
          )}
        </div>
        <div
          className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center`}
        >
          {Icon && <Icon className={`h-6 w-6 ${color}`} />}
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
      <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-zinc-800/50 flex items-center justify-center">
        <Icons.Chart className="h-10 w-10 text-zinc-600" />
      </div>
      <h3 className="text-white font-semibold mb-2 text-lg">No Data Available</h3>
      <p className="text-zinc-500 text-sm max-w-md mx-auto">
        Analytics will appear here once you have created tasks and assigned them to employees.
      </p>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main AnalyticsTab Component
   ───────────────────────────────────────────── */
const AnalyticsTab = ({ stats, employees = [], isLoading = false }) => {
  // If no stats or loading, show appropriate state
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-zinc-800/40 rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-zinc-800/40 rounded-xl" />
            <div className="h-96 bg-zinc-800/40 rounded-xl" />
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

  // Prepare status distribution data for pie chart
  const statusData = [
    { 
      name: "New", 
      value: stats.new || 0, 
      color: "#3b82f6",
      percentage: stats.total > 0 ? Math.round((stats.new / stats.total) * 100) : 0
    },
    { 
      name: "Active", 
      value: stats.active || 0, 
      color: "#f59e0b",
      percentage: stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0
    },
    { 
      name: "Completed", 
      value: stats.completed || 0, 
      color: "#10b981",
      percentage: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
    },
    { 
      name: "Failed", 
      value: stats.failed || 0, 
      color: "#ef4444",
      percentage: stats.total > 0 ? Math.round((stats.failed / stats.total) * 100) : 0
    },
  ].filter(item => item.value > 0); // Only show non-zero values

  // Prepare category data for bar chart
  const categoryData = Object.entries(stats.byCategory || {}).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    fill: getCategoryColor(name),
  }));

  // Prepare employee performance data
  const employeePerformanceData = employees
    .filter(emp => emp.taskStats && emp.taskStats.total > 0)
    .map(emp => ({
      name: emp.name.split(" ")[0], // First name only for better display
      total: emp.taskStats.total || 0,
      completed: emp.taskStats.completed || 0,
      active: emp.taskStats.active || 0,
      completionRate: emp.taskStats.total > 0 
        ? Math.round((emp.taskStats.completed / emp.taskStats.total) * 100) 
        : 0,
    }))
    .sort((a, b) => b.completionRate - a.completionRate)
    .slice(0, 8); // Top 8 performers

  // Calculate completion rate
  const completionRate = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0;

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border-b border-zinc-800 p-6 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Icons.Chart className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Analytics Dashboard</h2>
            <p className="text-zinc-400 text-sm">
              Comprehensive insights into task performance and team productivity
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Stats Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Tasks"
            value={stats.total}
            icon={Icons.Tasks}
            color="text-blue-400"
            bgColor="bg-blue-500/10"
          />
          <StatCard
            title="Active Tasks"
            value={stats.active || 0}
            icon={Icons.Refresh}
            color="text-amber-400"
            bgColor="bg-amber-500/10"
            percentage={stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}
          />
          <StatCard
            title="Completed"
            value={stats.completed || 0}
            icon={Icons.Check}
            color="text-emerald-400"
            bgColor="bg-emerald-500/10"
            percentage={completionRate}
          />
          <StatCard
            title="Failed"
            value={stats.failed || 0}
            icon={Icons.X}
            color="text-red-400"
            bgColor="bg-red-500/10"
            percentage={stats.total > 0 ? Math.round((stats.failed / stats.total) * 100) : 0}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Task Status Distribution - Pie Chart */}
          <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-6 hover:border-zinc-600 transition-all">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <Icons.Chart className="h-4 w-4 text-violet-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Task Distribution</h3>
                <p className="text-zinc-500 text-xs">Status breakdown</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  labelLine={{ stroke: "#71717a", strokeWidth: 1 }}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PercentageTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Tasks by Category - Bar Chart */}
          <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-6 hover:border-zinc-600 transition-all">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Icons.Category className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Category Breakdown</h3>
                <p className="text-zinc-500 text-xs">Tasks by category</p>
              </div>
            </div>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#71717a" 
                    tick={{ fill: "#a1a1aa", fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#71717a" 
                    tick={{ fill: "#a1a1aa", fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-zinc-500 text-sm">No category data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Employee Performance - Full Width */}
        {employeePerformanceData.length > 0 && (
          <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-6 hover:border-zinc-600 transition-all">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Icons.Users className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Employee Performance</h3>
                <p className="text-zinc-500 text-xs">Task completion comparison</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={employeePerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                <XAxis 
                  dataKey="name" 
                  stroke="#71717a" 
                  tick={{ fill: "#a1a1aa", fontSize: 12 }}
                />
                <YAxis 
                  stroke="#71717a" 
                  tick={{ fill: "#a1a1aa", fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: "20px" }}
                  iconType="circle"
                />
                <Bar 
                  dataKey="completed" 
                  name="Completed" 
                  fill="#10b981" 
                  radius={[8, 8, 0, 0]}
                />
                <Bar 
                  dataKey="active" 
                  name="Active" 
                  fill="#f59e0b" 
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Completion Rate Trend - If we have employee data */}
        {employeePerformanceData.length > 0 && (
          <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-6 hover:border-zinc-600 transition-all">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <Icons.Trend className="h-4 w-4 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Completion Rate by Employee</h3>
                <p className="text-zinc-500 text-xs">Percentage of completed tasks</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={employeePerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                <XAxis 
                  dataKey="name" 
                  stroke="#71717a" 
                  tick={{ fill: "#a1a1aa", fontSize: 12 }}
                />
                <YAxis 
                  stroke="#71717a" 
                  tick={{ fill: "#a1a1aa", fontSize: 12 }}
                  domain={[0, 100]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="completionRate" 
                  name="Completion Rate (%)"
                  stroke="#6366f1" 
                  strokeWidth={3}
                  dot={{ fill: "#6366f1", r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Insights Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                <Icons.Check className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Success Rate</h4>
                <p className="text-3xl font-bold text-emerald-400 mb-1">
                  {completionRate}%
                </p>
                <p className="text-zinc-400 text-xs">
                  {stats.completed} of {stats.total} tasks completed
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
                <Icons.Refresh className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">In Progress</h4>
                <p className="text-3xl font-bold text-amber-400 mb-1">
                  {stats.active || 0}
                </p>
                <p className="text-zinc-400 text-xs">
                  Tasks currently being worked on
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                <Icons.Users className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Active Team</h4>
                <p className="text-3xl font-bold text-blue-400 mb-1">
                  {employeePerformanceData.length}
                </p>
                <p className="text-zinc-400 text-xs">
                  Employees with assigned tasks
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────
   Helper Functions
   ───────────────────────────────────────────── */
function getCategoryColor(category) {
  const colors = {
    development: "#3b82f6", // blue
    design: "#a855f7",      // purple
    marketing: "#ec4899",   // pink
    sales: "#10b981",       // emerald
    support: "#f59e0b",     // amber
    research: "#6366f1",    // indigo
    operations: "#8b5cf6",  // violet
    other: "#71717a",       // zinc
  };
  return colors[category.toLowerCase()] || colors.other;
}

export default AnalyticsTab;
