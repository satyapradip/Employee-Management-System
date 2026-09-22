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
  CartesianGrid,
} from "recharts";
import {
  BarChart3,
  PieChart as PieIcon,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  FolderKanban,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Custom Clean Tooltips (Light Theme)
   ───────────────────────────────────────────── */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-3.5 py-2 rounded-xl border border-[#E1E5E9] shadow-md">
        <p className="text-[#15191E] font-semibold text-xs">{payload[0].name}</p>
        <p className="text-[#5E6875] text-xs mt-0.5">
          Count: <span className="text-[#4F46E5] font-bold">{payload[0].value}</span>
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
      <div className="bg-white px-3.5 py-2 rounded-xl border border-[#E1E5E9] shadow-md">
        <p className="text-[#15191E] font-semibold text-xs">{data.name}</p>
        <p className="text-[#5E6875] text-xs mt-0.5">
          Tasks: <span className="text-[#15191E] font-bold">{data.value}</span>
        </p>
        {data.percentage !== undefined && (
          <p className="text-[#5E6875] text-xs">
            Ratio: <span className="text-[#4F46E5] font-bold">{data.percentage}%</span>
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
    <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#E1E5E9] shadow-2xs transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[#5E6875] text-[11px] font-semibold uppercase tracking-wider mb-1">
            {title}
          </p>
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#15191E] mb-1">
            {value}
          </h3>
          {percentage !== undefined && (
            <p className="text-[11px] text-[#87909B] font-medium">
              {percentage}% of workload
            </p>
          )}
        </div>
        <div
          className={`w-10 h-10 ${bgColor} rounded-xl border border-transparent flex items-center justify-center shrink-0`}
        >
          {Icon && <Icon className={`h-4 w-4 ${color}`} />}
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
      <div className="w-14 h-14 mx-auto mb-3.5 rounded-2xl bg-[#F5F6F7] border border-[#E1E5E9] flex items-center justify-center text-[#87909B]">
        <BarChart3 className="w-7 h-7" />
      </div>
      <h3 className="font-display text-[#15191E] font-bold mb-1 text-base">
        No Telemetry Collected Yet
      </h3>
      <p className="text-[#5E6875] text-xs max-w-sm mx-auto">
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
      <div className="p-6 bg-white">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-[#F5F6F7] rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 bg-[#F5F6F7] rounded-xl" />
            <div className="h-80 bg-[#F5F6F7] rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!stats || stats.total === 0) {
    return (
      <div className="p-6 bg-white">
        <EmptyAnalytics />
      </div>
    );
  }

  // Status breakdown with cohesive palette
  const statusData = [
    {
      name: "New",
      value: stats.new || 0,
      color: "#6366F1", // indigo
      percentage: stats.total > 0 ? Math.round((stats.new / stats.total) * 100) : 0,
    },
    {
      name: "In Progress",
      value: stats.active || 0,
      color: "#F59E0B", // amber
      percentage: stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0,
    },
    {
      name: "Completed",
      value: stats.completed || 0,
      color: "#10B981", // emerald
      percentage: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
    },
    {
      name: "Failed",
      value: stats.failed || 0,
      color: "#EF4444", // rose
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
    <div className="bg-white">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-[#E1E5E9] bg-[#F8FAFC]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] border border-[#E0E7FF] flex items-center justify-center text-[#3730A3]">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-base sm:text-lg text-[#15191E]">
              Executive Telemetry &amp; Velocity
            </h2>
            <p className="text-[#5E6875] text-xs">
              Live organizational throughput metrics and performance distribution
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Tasks"
            value={stats.total}
            icon={FolderKanban}
            color="text-[#3730A3]"
            bgColor="bg-[#EEF2FF]"
          />
          <StatCard
            title="Active Tasks"
            value={stats.active || 0}
            icon={Clock}
            color="text-[#B45309]"
            bgColor="bg-[#FEF3C7]"
            percentage={stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}
          />
          <StatCard
            title="Completed"
            value={stats.completed || 0}
            icon={CheckCircle2}
            color="text-[#15803D]"
            bgColor="bg-[#DCFCE7]"
            percentage={completionRate}
          />
          <StatCard
            title="Failed / Blocked"
            value={stats.failed || 0}
            icon={AlertCircle}
            color="text-[#B91C1C]"
            bgColor="bg-[#FEE2E2]"
            percentage={stats.total > 0 ? Math.round((stats.failed / stats.total) * 100) : 0}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Breakdown */}
          <div className="saas-card p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <PieIcon className="w-4 h-4 text-[#4F46E5]" />
              <h3 className="font-display font-semibold text-sm text-[#15191E]">
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
                  wrapperStyle={{ fontSize: "12px", color: "#5E6875" }}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category Breakdown */}
          <div className="saas-card p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <FolderKanban className="w-4 h-4 text-[#0F766E]" />
              <h3 className="font-display font-semibold text-sm text-[#15191E]">
                Tasks by Operational Category
              </h3>
            </div>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ECEFF1" />
                  <XAxis
                    dataKey="name"
                    stroke="#CBD2D9"
                    tick={{ fill: "#5E6875", fontSize: 11 }}
                  />
                  <YAxis
                    stroke="#CBD2D9"
                    tick={{ fill: "#5E6875", fontSize: 11 }}
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
              <div className="h-65 flex items-center justify-center text-xs text-[#87909B]">
                No category breakdown available
              </div>
            )}
          </div>
        </div>

        {/* Employee Performance Chart */}
        {employeePerformanceData.length > 0 && (
          <div className="saas-card p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-[#15803D]" />
              <h3 className="font-display font-semibold text-sm text-[#15191E]">
                Team Member Output Comparison
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={employeePerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ECEFF1" />
                <XAxis
                  dataKey="name"
                  stroke="#CBD2D9"
                  tick={{ fill: "#5E6875", fontSize: 12 }}
                />
                <YAxis
                  stroke="#CBD2D9"
                  tick={{ fill: "#5E6875", fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: "12px", fontSize: "12px" }}
                  iconType="circle"
                />
                <Bar
                  dataKey="completed"
                  name="Completed"
                  fill="#10B981"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="active"
                  name="Active"
                  fill="#F59E0B"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Insight Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#DCFCE7]/40 p-5 rounded-2xl border border-[#BBF7D0]">
            <div className="flex items-center gap-2 text-[#15803D] text-xs font-semibold uppercase tracking-wider mb-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Delivery Velocity
            </div>
            <div className="font-display font-bold text-xl text-[#15803D] mb-0.5">
              {completionRate}% Success Rate
            </div>
            <p className="text-[#5E6875] text-xs">
              {stats.completed} of {stats.total} total deliverables completed
            </p>
          </div>

          <div className="bg-[#FEF3C7]/40 p-5 rounded-2xl border border-[#FDE68A]">
            <div className="flex items-center gap-2 text-[#B45309] text-xs font-semibold uppercase tracking-wider mb-1.5">
              <Clock className="w-4 h-4" />
              In Flight
            </div>
            <div className="font-display font-bold text-xl text-[#B45309] mb-0.5">
              {stats.active || 0} Active Tasks
            </div>
            <p className="text-[#5E6875] text-xs">
              Actively being engineered by team members
            </p>
          </div>

          <div className="bg-[#EEF2FF]/50 p-5 rounded-2xl border border-[#E0E7FF]">
            <div className="flex items-center gap-2 text-[#3730A3] text-xs font-semibold uppercase tracking-wider mb-1.5">
              <Users className="w-4 h-4" />
              Active Contributors
            </div>
            <div className="font-display font-bold text-xl text-[#3730A3] mb-0.5">
              {employeePerformanceData.length} Staff
            </div>
            <p className="text-[#5E6875] text-xs">
              Team members currently executing tasks
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

function getCategoryColor(category) {
  const colors = {
    development: "#4F46E5",
    design: "#8B5CF6",
    marketing: "#EC4899",
    sales: "#10B981",
    support: "#F59E0B",
    research: "#06B6D4",
    operations: "#3730A3",
    other: "#5E6875",
  };
  return colors[category?.toLowerCase()] || colors.other;
}

export default AnalyticsTab;
