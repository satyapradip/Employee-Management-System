import React, { useState } from "react";
import SearchBar from "./SearchBar";
import FilterPills from "./FilterPills";
import TaskCard from "./TaskCard";
import EmptyState from "./EmptyState";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { ListTodo } from "lucide-react";

/**
 * Tasks Tab Component
 * Displays all assigned tasks with search, filter, and CRUD controls
 */
const TasksTab = ({
  filteredTasks,
  stats,
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  onUpdateTask,
  onDeleteTask,
  isSubmitting = false,
  employees = [],
}) => {
  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    taskId: null,
    taskTitle: "",
  });

  const handleDeleteClick = (task) => {
    setDeleteModal({
      isOpen: true,
      taskId: task._id || task.id,
      taskTitle: task.title,
    });
  };

  const handleConfirmDelete = async () => {
    if (deleteModal.taskId) {
      await onDeleteTask(deleteModal.taskId);
      setDeleteModal({ isOpen: false, taskId: null, taskTitle: "" });
    }
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal({ isOpen: false, taskId: null, taskTitle: "" });
  };

  return (
    <>
      {/* Search and Filters Header */}
      <div className="p-6 border-b border-white/10 bg-linear-to-r from-indigo-950/20 to-transparent">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <ListTodo className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-white">
                Task Registry
              </h2>
              <p className="text-zinc-400 text-xs">
                Inspect, filter, and govern team deliverables
              </p>
            </div>
          </div>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        {/* Filter Pills */}
        <div className="mt-5">
          <FilterPills
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            stats={stats}
          />
        </div>
      </div>

      {/* Task Cards Grid */}
      <div className="p-6 max-h-160 overflow-y-auto">
        {filteredTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTasks.map((task, index) => (
              <TaskCard
                key={task._id || task.id}
                task={task}
                index={index}
                onEdit={onUpdateTask}
                onDelete={() => handleDeleteClick(task)}
                employees={employees}
              />
            ))}
          </div>
        ) : (
          <EmptyState filter={activeFilter} />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message={`Are you sure you want to permanently remove "${deleteModal.taskTitle}"? This cannot be undone.`}
        isLoading={isSubmitting}
      />
    </>
  );
};

export default TasksTab;
