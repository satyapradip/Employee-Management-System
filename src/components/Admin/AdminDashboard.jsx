import React, { useState } from "react";
import Header from "../others/Header";
import { TabNavigation, TasksTab, CreateTaskTab, Sidebar } from "./components";
import { useTaskManager } from "./hooks/useTaskManager";
import "./styles/animations.css";

/**
 * Admin Dashboard Component
 * Main dashboard for admin users with task management
 */
const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState("tasks");

  // Use custom hook for task management
  const {
    filteredTasks,
    stats,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    addTask,
  } = useTaskManager();

  return (
    <div className="min-h-screen w-full p-6 md:p-10 bg-linear-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      <Header userName={user?.name || "Admin"} onLogout={onLogout} />

      {/* Main Content Grid */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Content - Tabs */}
        <div className="lg:col-span-3">
          {/* Tab Navigation */}
          <TabNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            taskCount={stats.total}
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
              />
            )}

            {/* Create Task Tab */}
            {activeTab === "create" && (
              <CreateTaskTab
                onCreateTask={addTask}
                onTabChange={setActiveTab}
              />
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1">
          <Sidebar stats={stats} onCreateTask={() => setActiveTab("create")} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
