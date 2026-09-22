import React, { useState } from "react";
import Header from "../others/Header";
import {
  TabNavigation,
  TasksTab,
  CreateTaskTab,
  EmployeesTab,
  AnalyticsTab,
  Sidebar,
} from "./components";
import { FullPageLoader, ErrorState } from "./components/LoadingStates";
import { useTaskManager } from "./hooks/useTaskManager";
import { useEmployees } from "./hooks/useEmployees";
import { useAnalytics } from "./hooks/useAnalytics";
import { useAuth } from "../../hooks/useAuth";
import {
  ListTodo,
  PlusCircle,
  Users,
  BarChart3,
  Menu,
  X,
  Shield,
  LogOut,
  Zap,
} from "lucide-react";

/**
 * Admin Dashboard Component
 * Main command center for administrators
 * Follows Reference 1: Dark navy sidebar navigation, light cool-gray canvas, white rounded panels
 */
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("tasks");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // AuthContext state
  const { user, logout } = useAuth();

  // Task management hook
  const {
    filteredTasks,
    stats,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    addTask,
    updateTask,
    deleteTask,
    refreshTasks,
    isLoading,
    isSubmitting,
    error,
  } = useTaskManager();

  // Employee management hook
  const {
    employees,
    employeeOptions,
    isLoading: employeesLoading,
    isSubmitting: employeesSubmitting,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    toggleActive,
  } = useEmployees();

  // Analytics hook
  const { stats: analyticsStats, isLoading: analyticsLoading } = useAnalytics();

  // Handle task creation
  const handleCreateTask = async (taskData) => {
    const result = await addTask(taskData);
    if (result?.success) {
      setActiveTab("tasks");
    }
    return result;
  };

  // Initial loading state
  if (isLoading && !filteredTasks.length) {
    return (
      <div className="min-h-screen w-full p-4 sm:p-6 md:p-8 bg-[#F5F6F7] flex flex-col justify-center items-center">
        <div className="w-full max-w-7xl">
          <Header userName={user?.name || "Admin"} onLogout={logout} />
          <div className="mt-8 bg-white rounded-2xl border border-[#E1E5E9] p-8 shadow-xs">
            <FullPageLoader message="Loading tasks and workspace telemetry..." />
          </div>
        </div>
      </div>
    );
  }

  // Initial error state
  if (error && !filteredTasks.length) {
    return (
      <div className="min-h-screen w-full p-4 sm:p-6 md:p-8 bg-[#F5F6F7]">
        <div className="max-w-7xl mx-auto">
          <Header userName={user?.name || "Admin"} onLogout={logout} />
          <div className="mt-8 bg-white rounded-2xl border border-[#FEE2E2] p-8 shadow-xs">
            <ErrorState message={error} onRetry={refreshTasks} />
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    {
      key: "tasks",
      label: "All Tasks",
      icon: ListTodo,
      count: stats.total,
    },
    {
      key: "create",
      label: "Create Task",
      icon: PlusCircle,
      count: null,
    },
    {
      key: "employees",
      label: "Employees",
      icon: Users,
      count: employees.length,
    },
    {
      key: "analytics",
      label: "Analytics",
      icon: BarChart3,
      count: null,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F6F7] flex flex-col lg:flex-row">
      {/* ─── DESKTOP STRUCTURED NAVY SIDEBAR (Reference 1) ─── */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#101827] text-white border-r border-[#1E293B] shrink-0 min-h-screen p-5 justify-between">
        <div className="space-y-6">
          {/* Logo & Workspace Title */}
          <div className="flex items-center gap-3 px-1 py-1">
            <div className="w-9 h-9 rounded-xl bg-[#4F46E5] flex items-center justify-center font-bold text-white text-sm shadow-xs">
              TF
            </div>
            <div>
              <span className="font-display font-bold text-sm text-white tracking-tight block">
                TeamFlow
              </span>
              <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider block font-semibold">
                Admin Console
              </span>
            </div>
          </div>

          {/* Navigation Section */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider px-3 mb-2 block">
              Workspace
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveTab(item.key)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? "bg-[#1E293B] text-white font-bold"
                      : "text-[#94A3B8] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#818CF8]" : "text-[#94A3B8]"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count != null && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        isActive
                          ? "bg-[#3730A3] text-white"
                          : "bg-white/10 text-[#94A3B8]"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Shortcuts Section */}
          <div className="pt-4 border-t border-[#1E293B] space-y-1">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider px-3 mb-2 block">
              Quick Actions
            </span>
            <button
              onClick={() => setActiveTab("create")}
              className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs text-[#94A3B8] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Dispatch New Task</span>
            </button>
            <button
              onClick={() => setActiveTab("employees")}
              className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs text-[#94A3B8] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-[#6366F1]" />
              <span>Manage Team Staff</span>
            </button>
          </div>
        </div>

        {/* Bottom Profile & Sign Out Bar */}
        <div className="pt-4 border-t border-[#1E293B]">
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white/5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#3730A3] text-white flex items-center justify-center font-bold text-xs shrink-0">
                {(user?.name?.charAt(0) || "A").toUpperCase()}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-white truncate block">
                  {user?.name || "Admin"}
                </span>
                <span className="text-[10px] text-[#94A3B8] truncate block">
                  {user?.email || "admin@teamflow.io"}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-[#94A3B8] hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ─── MOBILE DRAWER OVERLAY ─── */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-64 bg-[#101827] text-white p-5 flex flex-col justify-between z-10">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#4F46E5] flex items-center justify-center font-bold text-xs text-white">
                    TF
                  </div>
                  <span className="font-display font-bold text-sm text-white">
                    TeamFlow
                  </span>
                </div>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 text-[#94A3B8] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        setActiveTab(item.key);
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                        isActive
                          ? "bg-[#1E293B] text-white font-bold"
                          : "text-[#94A3B8] hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.count != null && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/10 text-[#94A3B8]">
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-[#1E293B]">
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#F87171] hover:bg-white/5 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MAIN CONTENT CANVAS ─── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Navbar with Hamburger */}
        <div className="lg:hidden bg-white border-b border-[#E1E5E9] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-1.5 rounded-lg border border-[#E1E5E9] text-[#15191E]"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-display font-bold text-sm text-[#0F172A] tracking-[-0.02em]">
              TeamFlow Admin
            </span>
          </div>
          <button
            onClick={logout}
            className="p-1.5 text-[#B91C1C] hover:bg-[#FEE2E2] rounded-lg"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Workspace Canvas Container */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 max-w-7xl w-full mx-auto space-y-6">
          {/* Top Header Card */}
          <Header userName={user?.name || "Admin"} onLogout={logout} />

          {/* Main 2-Column Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            {/* Primary Content (3 Cols) */}
            <div className="lg:col-span-3 space-y-4">
              {/* Tab Navigation Pill Bar */}
              <TabNavigation
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                taskCount={stats.total}
                employeeCount={employees.length}
                analyticsEnabled={true}
              />

              {/* Tab Content Panel (Clean White Elevated Surface) */}
              <div
                className="bg-white rounded-2xl border border-[#E1E5E9] shadow-xs overflow-hidden animate-fadeIn"
                key={activeTab}
              >
                {activeTab === "tasks" && (
                  <TasksTab
                    filteredTasks={filteredTasks}
                    stats={stats}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                    onUpdateTask={updateTask}
                    onDeleteTask={deleteTask}
                    isSubmitting={isSubmitting}
                    employees={employees}
                  />
                )}

                {activeTab === "create" && (
                  <CreateTaskTab
                    onCreateTask={handleCreateTask}
                    onTabChange={setActiveTab}
                    employees={employeeOptions}
                    isLoading={employeesLoading}
                    isSubmitting={isSubmitting}
                  />
                )}

                {activeTab === "employees" && (
                  <EmployeesTab
                    employees={employees}
                    isLoading={employeesLoading}
                    isSubmitting={employeesSubmitting}
                    onCreateEmployee={createEmployee}
                    onUpdateEmployee={updateEmployee}
                    onDeleteEmployee={deleteEmployee}
                    onToggleActive={toggleActive}
                  />
                )}

                {activeTab === "analytics" && (
                  <AnalyticsTab
                    stats={analyticsStats}
                    employees={employees}
                    isLoading={analyticsLoading}
                  />
                )}
              </div>
            </div>

            {/* Contextual Telemetry Sidebar (1 Col) */}
            <div className="lg:col-span-1">
              <Sidebar
                stats={stats}
                onCreateTask={() => setActiveTab("create")}
                onManageTeam={() => setActiveTab("employees")}
                onRefresh={refreshTasks}
                isLoading={isLoading}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
