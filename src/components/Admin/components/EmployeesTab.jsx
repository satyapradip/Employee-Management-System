import React, { useState } from "react";
import { Icons } from "./Icons.jsx";

/* ─────────────────────────────────────────────
   Add Employee Modal
   ───────────────────────────────────────────── */
function AddEmployeeModal({ isOpen, onClose, onSubmit, isSubmitting }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Min 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await onSubmit(form);
    if (result?.success) {
      setForm({ name: "", email: "", password: "" });
      setErrors({});
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-700/50 rounded-2xl shadow-2xl animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Icons.User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Add Employee</h3>
              <p className="text-zinc-500 text-xs">
                Create a new team member account
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
          >
            <Icons.X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Full Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={`w-full px-4 py-3 bg-zinc-800/50 border ${errors.name ? "border-red-500/60" : "border-zinc-700"} rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@company.com"
              className={`w-full px-4 py-3 bg-zinc-800/50 border ${errors.email ? "border-red-500/60" : "border-zinc-700"} rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Min 6 characters"
              className={`w-full px-4 py-3 bg-zinc-800/50 border ${errors.password ? "border-red-500/60" : "border-zinc-700"} rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all`}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-400">{errors.password}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-zinc-800 text-zinc-300 rounded-xl font-medium hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
                    />
                  </svg>
                  Creating...
                </span>
              ) : (
                "Create Employee"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Edit Employee Modal
   ───────────────────────────────────────────── */
function EditEmployeeModal({
  isOpen,
  onClose,
  employee,
  onSubmit,
  isSubmitting,
}) {
  const [form, setForm] = useState({
    name: employee?.name || "",
    email: employee?.email || "",
  });
  const [errors, setErrors] = useState({});

  // Sync form when employee changes
  React.useEffect(() => {
    if (employee) {
      setForm({ name: employee.name, email: employee.email });
    }
  }, [employee]);

  if (!isOpen || !employee) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await onSubmit(employee._id, form);
    if (result?.success) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-700/50 rounded-2xl shadow-2xl animate-fadeIn">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Icons.Edit className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Edit Employee</h3>
              <p className="text-zinc-500 text-xs">Update employee details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
          >
            <Icons.X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Full Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-zinc-800/50 border ${errors.name ? "border-red-500/60" : "border-zinc-700"} rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-400">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-zinc-800/50 border ${errors.email ? "border-red-500/60" : "border-zinc-700"} rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">{errors.email}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-zinc-800 text-zinc-300 rounded-xl font-medium hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Employee Card
   ───────────────────────────────────────────── */
function EmployeeCard({
  employee,
  onEdit,
  onToggleActive,
  onDelete,
  isSubmitting,
}) {
  const [showConfirm, setShowConfirm] = useState(false);

  const stats = employee.taskStats || {};
  const totalTasks = stats.total || 0;
  const completedTasks = stats.completed || 0;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div
      className={`relative p-5 bg-zinc-800/40 border rounded-xl transition-all duration-200 hover:border-zinc-600 ${
        employee.isActive
          ? "border-zinc-700/50"
          : "border-red-500/20 bg-red-500/5"
      }`}
    >
      {/* Top row: avatar + name + actions */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar */}
          <div
            className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
              employee.isActive
                ? "bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400"
                : "bg-zinc-700/50 text-zinc-500"
            }`}
          >
            {employee.name
              .split(" ")
              .map((w) => w[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-white font-semibold text-sm truncate">
                {employee.name}
              </h4>
              <span
                className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                  employee.isActive
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-red-500/15 text-red-400"
                }`}
              >
                {employee.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="text-zinc-500 text-xs truncate">{employee.email}</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEdit(employee)}
            className="p-1.5 text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
            title="Edit"
          >
            <Icons.Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onToggleActive(employee._id)}
            disabled={isSubmitting}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50 ${
              employee.isActive
                ? "text-zinc-500 hover:text-amber-400 hover:bg-amber-500/10"
                : "text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/10"
            }`}
            title={employee.isActive ? "Deactivate" : "Activate"}
          >
            {employee.isActive ? (
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                />
              </svg>
            ) : (
              <Icons.Check className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            disabled={isSubmitting}
            className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            title="Delete"
          >
            <Icons.Trash className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Task stats bar */}
      <div className="mt-4 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5 text-zinc-400">
          <Icons.Tasks className="h-3.5 w-3.5" />
          <span>{totalTasks} tasks</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400">
          <Icons.Check className="h-3.5 w-3.5" />
          <span>{completedTasks} done</span>
        </div>
        <div className="flex items-center gap-1.5 text-blue-400">
          <Icons.Refresh className="h-3.5 w-3.5" />
          <span>{stats.active || 0} active</span>
        </div>
        {totalTasks > 0 && (
          <div className="ml-auto text-zinc-500">{completionRate}%</div>
        )}
      </div>

      {/* Progress bar */}
      {totalTasks > 0 && (
        <div className="mt-2 h-1 bg-zinc-700/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      )}

      {/* Delete Confirm Overlay */}
      {showConfirm && (
        <div className="absolute inset-0 bg-zinc-900/95 backdrop-blur-sm rounded-xl flex items-center justify-center z-10 animate-fadeIn">
          <div className="text-center px-6">
            <p className="text-white text-sm font-medium mb-1">
              Delete {employee.name}?
            </p>
            <p className="text-zinc-500 text-xs mb-4">
              This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg text-sm hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(employee._id);
                  setShowConfirm(false);
                }}
                disabled={isSubmitting}
                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main EmployeesTab
   ───────────────────────────────────────────── */
const EmployeesTab = ({
  employees = [],
  isLoading = false,
  isSubmitting = false,
  onCreateEmployee,
  onUpdateEmployee,
  onDeleteEmployee,
  onToggleActive,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | active | inactive

  // Filter employees
  const filtered = employees.filter((emp) => {
    const matchesSearch =
      !search ||
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "active" && emp.isActive) ||
      (filter === "inactive" && !emp.isActive);

    return matchesSearch && matchesFilter;
  });

  const activeCount = employees.filter((e) => e.isActive).length;
  const inactiveCount = employees.filter((e) => !e.isActive).length;

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-zinc-800 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Icons.Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Employees</h2>
              <p className="text-zinc-400 text-sm">
                {employees.length} member{employees.length !== 1 ? "s" : ""} in
                your team
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 transition-all active:scale-[0.97] cursor-pointer"
          >
            <Icons.Plus className="h-4 w-4" />
            Add Employee
          </button>
        </div>

        {/* Search + Filter */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Filter pills */}
          <div className="flex gap-2">
            {[
              { key: "all", label: "All", count: employees.length },
              { key: "active", label: "Active", count: activeCount },
              { key: "inactive", label: "Inactive", count: inactiveCount },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  filter === f.key
                    ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                    : "bg-zinc-800/50 text-zinc-400 border border-zinc-700 hover:text-zinc-200"
                }`}
              >
                {f.label}
                <span className="ml-1.5 opacity-60">{f.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {isLoading ? (
          /* Loading skeleton */
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-5 bg-zinc-800/40 border border-zinc-700/50 rounded-xl animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-700" />
                  <div className="flex-1">
                    <div className="h-4 w-32 bg-zinc-700 rounded mb-1.5" />
                    <div className="h-3 w-48 bg-zinc-700/50 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          /* Empty state */
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-zinc-800/50 flex items-center justify-center">
              <Icons.Users className="h-8 w-8 text-zinc-600" />
            </div>
            <h3 className="text-white font-semibold mb-1">
              {employees.length === 0
                ? "No employees yet"
                : "No matching employees"}
            </h3>
            <p className="text-zinc-500 text-sm mb-6 max-w-sm mx-auto">
              {employees.length === 0
                ? "Add your first team member to start assigning tasks."
                : "Try a different search term or filter."}
            </p>
            {employees.length === 0 && (
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 transition-all cursor-pointer"
              >
                <Icons.Plus className="h-4 w-4" />
                Add First Employee
              </button>
            )}
          </div>
        ) : (
          /* Employee list */
          <div className="space-y-3">
            {filtered.map((emp) => (
              <EmployeeCard
                key={emp._id}
                employee={emp}
                onEdit={setEditEmployee}
                onToggleActive={onToggleActive}
                onDelete={onDeleteEmployee}
                isSubmitting={isSubmitting}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddEmployeeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={onCreateEmployee}
        isSubmitting={isSubmitting}
      />

      <EditEmployeeModal
        isOpen={!!editEmployee}
        onClose={() => setEditEmployee(null)}
        employee={editEmployee}
        onSubmit={onUpdateEmployee}
        isSubmitting={isSubmitting}
      />
    </>
  );
};

export default EmployeesTab;
