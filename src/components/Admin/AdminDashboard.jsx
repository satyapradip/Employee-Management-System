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
import "./styles/animations.css";

/**
 * Admin Dashboard Component
 * Main command center for administrators
 */
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("tasks");

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
      <div className="min-h-screen w-full p-4 sm:p-6 md:p-10 bg-[#070b14] text-slate-100 flex flex-col justify-center items-center">
        <div className="w-full max-w-7xl">
          <Header userName={user?.name || "Admin"} onLogout={logout} />
          <div className="mt-8">
            <FullPageLoader message="Loading tasks and workspace telemetry..." />
          </div>
        </div>
      </div>
    );
  }

  // Initial error state
  if (error && !filteredTasks.length) {
    return (
      <div className="min-h-screen w-full p-4 sm:p-6 md:p-10 bg-[#070b14] text-slate-100">
        <div className="max-w-7xl mx-auto">
          <Header userName={user?.name || "Admin"} onLogout={logout} />
          <div className="mt-8 glass-panel rounded-2xl border border-red-500/30 p-8 shadow-2xl">
            <ErrorState message={error} onRetry={refreshTasks} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-4 sm:p-6 md:p-8 lg:p-10 bg-[#070b14] text-slate-100 relative overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="glow-ambient-indigo -top-25 left-1/3 pointer-events-none" />
      <div className="glow-ambient-cyan -bottom-12.5 right-0 pointer-events-none" />
      <div className="absolute inset-0 bg-grid-subtle pointer-events-none opacity-40" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <Header userName={user?.name || "Admin"} onLogout={logout} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Main Workspace Area (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            {/* Tab Navigation Pill Bar */}
            <TabNavigation
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              taskCount={stats.total}
              employeeCount={employees.length}
              analyticsEnabled={true}
            />

            {/* Tab Content Panels */}
            <div
              className="glass-panel rounded-2xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden animate-fadeIn"
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

          {/* Right Sidebar (1 Col) */}
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
      </div>
    </div>
  );
};

export default AdminDashboard;
