import React, { useState } from "react";
import { Icons } from "./Icons.jsx";
import FormInput from "./FormInput";
import CategorySelector from "./CategorySelector";
import { EMPLOYEES, PRIORITIES } from "../data/sampleTasks";

/**
 * Create Task Tab Component
 * Form for creating new tasks
 */
const CreateTaskTab = ({ onCreateTask, onTabChange }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    category: "",
    assignedTo: "",
    priority: "medium",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateTask(formData);
    // Reset form
    setFormData({
      title: "",
      description: "",
      date: "",
      category: "",
      assignedTo: "",
      priority: "medium",
    });
    // Switch to tasks tab
    onTabChange("tasks");
  };

  return (
    <>
      {/* Form Header */}
      <div className="bg-linear-to-r from-emerald-500/10 to-blue-500/10 border-b border-zinc-800 p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
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
        <FormInput
          label="Task Title"
          icon={Icons.Description}
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task title"
          required
        />

        {/* Description */}
        <FormInput
          label="Description"
          icon={Icons.Description}
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the task in detail..."
          as="textarea"
          rows={3}
        />

        {/* Two column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Due Date */}
          <FormInput
            label="Due Date"
            icon={Icons.Calendar}
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          {/* Assign To */}
          <FormInput
            label="Assign To"
            icon={Icons.User}
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            placeholder="Select employee"
            as="select"
            options={EMPLOYEES}
            required
          />
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
        <CategorySelector
          selected={formData.category}
          onSelect={(category) =>
            setFormData((prev) => ({ ...prev, category }))
          }
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-6 px-6 py-4 bg-linear-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <Icons.Plus className="h-5 w-5" />
          Create Task
        </button>
      </form>
    </>
  );
};

export default CreateTaskTab;
