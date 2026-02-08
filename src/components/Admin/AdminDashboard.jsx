import React, { useState } from "react";
import Header from "../others/Header";
import {
  TabNavigation,
  TasksTab,
  CreateTaskTab,
  EmployeesTab,
  Sidebar,
} from "./components";
import { FullPageLoader, ErrorState } from "./components/LoadingStates";
import { useTaskManager } from "./hooks/useTaskManager";
import { useEmployees } from "./hooks/useEmployees";
import { useAuth } from "../../hooks/useAuth";
import "./styles/animations.css";

/**
 * Admin Dashboard Component
 * Main dashboard for admin users with task management
 * Connected to backend API for real-time data
 * Uses AuthContext for user data and logout
 */
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("tasks");

  // Get user and logout from AuthContext
  const { user, logout } = useAuth();

  // Use custom hooks for data management
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

  // Fetch employees for task assignment + CRUD
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

  // Handle task creation with employee ID
  const handleCreateTask = async (taskData) => {
    const result = await addTask(taskData);
    if (result?.success) {
      setActiveTab("tasks");
    }
    return result;
  };

  // Show loading state while initial data loads
  if (isLoading && !filteredTasks.length) {
    return (
      <div className="min-h-screen w-full p-6 md:p-10 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
        <Header userName={user?.name || "Admin"} onLogout={logout} />
        <div className="mt-8">
          <FullPageLoader message="Loading tasks..." />
        </div>
      </div>
    );
  }

  // Show error state if fetch failed
  if (error && !filteredTasks.length) {
    return (
      <div className="min-h-screen w-full p-6 md:p-10 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
        <Header userName={user?.name || "Admin"} onLogout={logout} />
        <div className="mt-8 bg-zinc-900/80 backdrop-blur-xl rounded-2xl border border-zinc-800 shadow-2xl">
          <ErrorState message={error} onRetry={refreshTasks} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-6 md:p-10 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      <Header userName={user?.name || "Admin"} onLogout={logout} />

      {/* Main Content Grid */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Content - Tabs */}
        <div className="lg:col-span-3">
          {/* Tab Navigation */}
          <TabNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            taskCount={stats.total}
            employeeCount={employees.length}
          />

          {/* Tab Content */}
          <div
            className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden animate-fadeIn"
            key={activeTab}
          >
            {/* All Tasks Tab */}
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

            {/* Create Task Tab */}
            {activeTab === "create" && (
              <CreateTaskTab
                onCreateTask={handleCreateTask}
                onTabChange={setActiveTab}
                employees={employeeOptions}
                isLoading={employeesLoading}
                isSubmitting={isSubmitting}
              />
            )}

            {/* Employees Tab */}
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
          </div>
        </div>

        {/* Right Sidebar */}
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
  );
};

export default AdminDashboard;
