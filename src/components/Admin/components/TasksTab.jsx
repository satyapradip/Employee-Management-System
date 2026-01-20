import React from "react";
import { Icons } from "./Icons.jsx";
import SearchBar from "./SearchBar";
import FilterPills from "./FilterPills";
import TaskCard from "./TaskCard";
import EmptyState from "./EmptyState";

/**
 * Tasks Tab Component
 * Displays all tasks with search and filter functionality
 */
const TasksTab = ({
  filteredTasks,
  stats,
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
}) => {
  return (
    <>
      {/* Header with Search & Filters */}
      <div className="bg-linear-to-r from-blue-500/10 to-purple-500/10 border-b border-zinc-800 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Icons.Tasks className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">All Tasks</h2>
              <p className="text-zinc-400 text-sm">
                Manage and track all assigned tasks
              </p>
            </div>
          </div>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        {/* Filter Pills */}
        <div className="mt-4">
          <FilterPills
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            stats={stats}
          />
        </div>
      </div>

      {/* Task List */}
      <div className="p-6 `max-h-[600px]` overflow-y-auto custom-scrollbar">
        {filteredTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
          </div>
        ) : (
          <EmptyState filter={activeFilter} />
        )}
      </div>
    </>
  );
};

export default TasksTab;
