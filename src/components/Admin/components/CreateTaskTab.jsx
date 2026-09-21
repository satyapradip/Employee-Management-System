import React, { useState } from "react";
import FormInput from "./FormInput";
import CategorySelector from "./CategorySelector";
import { PlusCircle, Calendar, User, AlignLeft, Sparkles, Zap } from "lucide-react";

const PRIORITIES = [
  { key: "high", label: "High", color: "border-rose-500/40 text-rose-400 bg-rose-500/10" },
  { key: "medium", label: "Medium", color: "border-amber-500/40 text-amber-400 bg-amber-500/10" },
  { key: "low", label: "Low", color: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10" },
];

/**
 * Create Task Tab Component
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
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

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
      {/* Header */}
      <div className="p-6 border-b border-white/10 bg-linear-to-r from-emerald-950/20 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-white">
              Create &amp; Delegate Task
            </h2>
            <p className="text-zinc-400 text-xs">
              Assign deliverables to team members with explicit priority and deadline
            </p>
          </div>
        </div>
      </div>

      {/* Task Creation Form */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        {/* Title */}
        <div>
          <FormInput
            label="Task Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Implement Webhook Dispatcher for Stripe Events"
            required
          />
          {errors.title && (
            <p className="text-red-400 text-xs mt-1 pl-1">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="flex items-center gap-2 text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
            <AlignLeft className="w-3.5 h-3.5 text-indigo-400" />
            Description &amp; Acceptance Criteria
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Outline expected deliverables, context, API specs, or acceptance benchmarks..."
            rows={3}
            className="w-full glass-input rounded-xl px-4 py-3 text-sm resize-none"
          />
          {errors.description && (
            <p className="text-red-400 text-xs mt-1 pl-1">{errors.description}</p>
          )}
        </div>

        {/* Dual Column: Due Date & Assignee */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <FormInput
              label="Target Due Date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
            {errors.date && (
              <p className="text-red-400 text-xs mt-1 pl-1">{errors.date}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              Assign To Employee
            </label>
            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full glass-input rounded-xl px-4 py-3 text-sm disabled:opacity-50 cursor-pointer"
            >
              <option value="" className="bg-[#090e1c] text-zinc-400">
                {isLoading ? "Loading team..." : "Select team member"}
              </option>
              {employees.map((emp) => (
                <option
                  key={emp.value}
                  value={emp.value}
                  className="bg-[#090e1c] text-white"
                >
                  {emp.label}
                </option>
              ))}
            </select>
            {errors.assignedTo && (
              <p className="text-red-400 text-xs mt-1 pl-1">{errors.assignedTo}</p>
            )}
          </div>
        </div>

        {/* Priority Radio Pills */}
        <div>
          <label className="flex items-center gap-2 text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2.5">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            Execution Priority
          </label>
          <div className="grid grid-cols-3 gap-3">
            {PRIORITIES.map((p) => {
              const isSelected = formData.priority === p.key;
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, priority: p.key }))}
                  className={`py-2.5 px-4 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    isSelected
                      ? `${p.color} border-current shadow-md`
                      : "bg-white/5 border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Selector */}
        <CategorySelector
          selected={formData.category}
          onSelect={(category) => {
            setFormData((prev) => ({ ...prev, category }));
            if (errors.category) {
              setErrors((prev) => ({ ...prev, category: null }));
            }
          }}
        />
        {errors.category && (
          <p className="text-red-400 text-xs pl-1">{errors.category}</p>
        )}

        {/* Submit */}
        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary-gradient px-8 py-3.5 rounded-xl font-semibold text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/30"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Dispatching task...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Publish Task
              </span>
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default CreateTaskTab;
