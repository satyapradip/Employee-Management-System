import React, { useState } from "react";
import FormInput from "./FormInput";
import CategorySelector from "./CategorySelector";
import { PlusCircle, Calendar, User, AlignLeft, Sparkles, Zap } from "lucide-react";

const PRIORITIES = [
  { key: "high", label: "High Priority", activeClass: "bg-[#FEE2E2] text-[#B91C1C] border-[#FECACA]" },
  { key: "medium", label: "Medium Priority", activeClass: "bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]" },
  { key: "low", label: "Low Priority", activeClass: "bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]" },
];

/**
 * Create Task Tab Component
 * Follows Reference 1: clean white content surfaces, proper grouping, clear feedback
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
    <div className="bg-white">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-[#E1E5E9] bg-[#F8FAFC]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] border border-[#BBF7D0] flex items-center justify-center text-[#15803D]">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-base sm:text-lg text-[#15191E]">
              Create &amp; Delegate Task
            </h2>
            <p className="text-[#5E6875] text-xs">
              Assign deliverables to team members with explicit priority and deadline
            </p>
          </div>
        </div>
      </div>

      {/* Task Creation Form */}
      <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-6">
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
            <p className="text-[#B91C1C] text-xs mt-1 pl-1">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="flex items-center gap-2 text-xs font-semibold text-[#5E6875] uppercase tracking-wider mb-2">
            <AlignLeft className="w-3.5 h-3.5 text-[#4F46E5]" />
            Description &amp; Acceptance Criteria
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Outline expected deliverables, context, API specs, or acceptance benchmarks..."
            rows={3}
            className="w-full bg-white border border-[#E1E5E9] focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#15191E] placeholder:text-[#87909B] resize-none transition-all"
          />
          {errors.description && (
            <p className="text-[#B91C1C] text-xs mt-1 pl-1">{errors.description}</p>
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
              <p className="text-[#B91C1C] text-xs mt-1 pl-1">{errors.date}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-[#5E6875] uppercase tracking-wider mb-2">
              <User className="w-3.5 h-3.5 text-[#4F46E5]" />
              Assign To Employee
            </label>
            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full bg-white border border-[#E1E5E9] focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#15191E] disabled:opacity-50 cursor-pointer transition-all"
            >
              <option value="" className="text-[#87909B]">
                {isLoading ? "Loading team..." : "Select team member"}
              </option>
              {employees.map((emp) => (
                <option
                  key={emp.value}
                  value={emp.value}
                  className="text-[#15191E]"
                >
                  {emp.label}
                </option>
              ))}
            </select>
            {errors.assignedTo && (
              <p className="text-[#B91C1C] text-xs mt-1 pl-1">{errors.assignedTo}</p>
            )}
          </div>
        </div>

        {/* Priority Radio Pills */}
        <div>
          <label className="flex items-center gap-2 text-xs font-semibold text-[#5E6875] uppercase tracking-wider mb-2.5">
            <Zap className="w-3.5 h-3.5 text-[#4F46E5]" />
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
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    isSelected
                      ? `${p.activeClass} shadow-2xs font-bold`
                      : "bg-white border-[#E1E5E9] text-[#5E6875] hover:bg-[#F8FAFC]"
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
          <p className="text-[#B91C1C] text-xs pl-1">{errors.category}</p>
        )}

        {/* Submit Button */}
        <div className="pt-4 border-t border-[#E1E5E9] flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary px-7 py-3 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
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
    </div>
  );
};

export default CreateTaskTab;
