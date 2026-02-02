import React, { useState } from "react";
import { Icons } from "./Icons.jsx";
import FormInput from "./FormInput";
import CategorySelector from "./CategorySelector";

// Priority options (static)
const PRIORITIES = ["high", "medium", "low"];

/**
 * Create Task Tab Component
 * Form for creating new tasks with API integration
 */
const CreateTaskTab = ({
  onCreateTask,
  employees = [],
  isLoading = false,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    category: "",
    assignedTo: "",
    priority: "medium",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title cannot exceed 100 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length > 500) {
      newErrors.description = "Description cannot exceed 500 characters";
    }

    if (!formData.date) {
      newErrors.date = "Due date is required";
    }

    if (!formData.assignedTo) {
      newErrors.assignedTo = "Please select an employee";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = await onCreateTask(formData);

    if (result?.success) {
      // Reset form on success
      setFormData({
        title: "",
        description: "",
        date: "",
        category: "",
        assignedTo: "",
        priority: "medium",
      });
      setErrors({});
    }
  };

  return (
    <>
      {/* Form Header */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-b border-zinc-800 p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Icons.Plus className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Create New Task</h2>
            <p className="text-zinc-400 text-sm">
              Fill in the details to assign a new task
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Title */}
        <div>
          <FormInput
            label="Task Title"
            icon={Icons.Description}
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title"
            required
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-400">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2">
            <Icons.Description className="h-4 w-4" />
            Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the task in detail..."
            rows={3}
            className="w-full bg-zinc-800/50 text-white border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 transition-colors resize-none"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-400">{errors.description}</p>
          )}
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Due Date */}
          <div>
            <FormInput
              label="Due Date"
              icon={Icons.Calendar}
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-400">{errors.date}</p>
            )}
          </div>

          {/* Assign To - Dynamic from API */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2">
              <Icons.User className="h-4 w-4" />
              Assign To
            </label>
            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full bg-zinc-800/50 text-white border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
            >
              <option value="">
                {isLoading ? "Loading employees..." : "Select employee"}
              </option>
              {employees.map((emp) => (
                <option key={emp.value} value={emp.value}>
                  {emp.label}
                </option>
              ))}
            </select>
            {errors.assignedTo && (
              <p className="mt-1 text-sm text-red-400">{errors.assignedTo}</p>
            )}
          </div>
        </div>

        {/* Priority */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-3">
            <Icons.Lightning className="h-4 w-4" />
            Priority
          </label>
          <div className="flex gap-3">
            {PRIORITIES.map((priority) => (
              <button
                key={priority}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, priority }))}
                className={`flex-1 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                  formData.priority === priority
                    ? priority === "high"
                      ? "bg-red-500/20 text-red-400 border border-red-500/50"
                      : priority === "medium"
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/50"
                        : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                    : "bg-zinc-800/50 text-zinc-400 border border-zinc-700 hover:border-zinc-600"
                }`}
              >
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div>
          <CategorySelector
            selected={formData.category}
            onSelect={(category) =>
              setFormData((prev) => ({ ...prev, category }))
            }
          />
          {errors.category && (
            <p className="mt-1 text-sm text-red-400">{errors.category}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
          aria-label={isSubmitting ? "Creating task..." : "Create new task"}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating Task...
            </>
          ) : (
            <>
              <Icons.Plus className="h-5 w-5" />
              Create Task
            </>
          )}
        </button>
      </form>
    </>
  );
};

export default CreateTaskTab;
