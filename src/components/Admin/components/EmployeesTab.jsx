import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Check,
  Ban,
  Mail,
  User,
  Lock,
  X,
  ListTodo,
  CheckCircle2,
  Clock,
} from "lucide-react";

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
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email format";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Min 6 characters required";
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

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white border border-[#E1E5E9] rounded-2xl shadow-xl animate-fadeIn overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[#E1E5E9] bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] border border-[#E0E7FF] flex items-center justify-center text-[#3730A3]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-[#15191E]">Add Team Member</h3>
              <p className="text-[#5E6875] text-xs">Provision employee credentials</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#87909B] hover:text-[#15191E] rounded-lg hover:bg-[#F5F6F7] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#5E6875] uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Alex Rivera"
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E1E5E9] focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 text-sm text-[#15191E] placeholder:text-[#87909B] transition-all"
            />
            {errors.name && <p className="mt-1 text-xs text-[#B91C1C] pl-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5E6875] uppercase tracking-wider mb-1.5">
              Corporate Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="alex@company.com"
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E1E5E9] focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 text-sm text-[#15191E] placeholder:text-[#87909B] transition-all"
            />
            {errors.email && <p className="mt-1 text-xs text-[#B91C1C] pl-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5E6875] uppercase tracking-wider mb-1.5">
              Initial Password
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Min 6 characters"
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E1E5E9] focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 text-sm text-[#15191E] placeholder:text-[#87909B] transition-all"
            />
            {errors.password && <p className="mt-1 text-xs text-[#B91C1C] pl-1">{errors.password}</p>}
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl btn-secondary text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl btn-primary text-xs font-semibold cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? "Provisioning..." : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

/* ─────────────────────────────────────────────
   Edit Employee Modal
   ───────────────────────────────────────────── */
function EditEmployeeModal({ isOpen, onClose, employee, onSubmit, isSubmitting }) {
  const [form, setForm] = useState({
    name: employee?.name || "",
    email: employee?.email || "",
  });
  const [errors, setErrors] = useState({});

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
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email format";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await onSubmit(employee._id, form);
    if (result?.success) onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white border border-[#E1E5E9] rounded-2xl shadow-xl animate-fadeIn overflow-hidden">
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[#E1E5E9] bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] border border-[#E0E7FF] flex items-center justify-center text-[#3730A3]">
              <Edit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-[#15191E]">Edit Team Member</h3>
              <p className="text-[#5E6875] text-xs">Update employee record</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#87909B] hover:text-[#15191E] rounded-lg hover:bg-[#F5F6F7] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#5E6875] uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E1E5E9] focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 text-sm text-[#15191E] transition-all"
            />
            {errors.name && <p className="mt-1 text-xs text-[#B91C1C] pl-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5E6875] uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E1E5E9] focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 text-sm text-[#15191E] transition-all"
            />
            {errors.email && <p className="mt-1 text-xs text-[#B91C1C] pl-1">{errors.email}</p>}
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl btn-secondary text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl btn-primary text-xs font-semibold cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

/* ─────────────────────────────────────────────
   Employee Card Item
   ───────────────────────────────────────────── */
function EmployeeCard({
  employee,
  onEdit,
  onToggleActive,
  onDelete,
  isSubmitting,
}) {
  const [showConfirm, setShowConfirm] = useState(false);

  const stats = employee.taskStats || {
    total: 0,
    completed: 0,
    active: 0,
    failed: 0,
  };

  const totalTasks = stats.total || 0;
  const completedTasks = stats.completed || 0;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const initials = employee.name
    ? employee.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "EM";

  return (
    <div className="saas-card p-5 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Profile Info */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-[#101827] flex items-center justify-center font-display font-bold text-white text-sm shadow-xs shrink-0">
            {initials}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-display font-semibold text-[#15191E] text-base truncate">
                {employee.name}
              </h4>
              <span
                className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  employee.isActive
                    ? "bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]"
                    : "bg-[#FEE2E2] text-[#B91C1C] border-[#FECACA]"
                }`}
              >
                {employee.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="text-[#5E6875] text-xs truncate mt-0.5">{employee.email}</p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
          <button
            onClick={() => onEdit(employee)}
            className="p-2 text-[#5E6875] hover:text-[#15191E] hover:bg-[#F5F6F7] rounded-lg transition-colors cursor-pointer"
            title="Edit Details"
          >
            <Edit className="w-4 h-4" />
          </button>

          <button
            onClick={() => onToggleActive(employee._id)}
            disabled={isSubmitting}
            className={`p-2 rounded-lg transition-colors cursor-pointer disabled:opacity-50 ${
              employee.isActive
                ? "text-[#5E6875] hover:text-[#B45309] hover:bg-[#FEF3C7]"
                : "text-[#5E6875] hover:text-[#15803D] hover:bg-[#DCFCE7]"
            }`}
            title={employee.isActive ? "Deactivate User" : "Activate User"}
          >
            {employee.isActive ? <Ban className="w-4 h-4" /> : <Check className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setShowConfirm(true)}
            disabled={isSubmitting}
            className="p-2 text-[#5E6875] hover:text-[#B91C1C] hover:bg-[#FEE2E2] rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            title="Delete User"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Task Performance Mini Metric Bar */}
      <div className="mt-4 pt-3 border-t border-[#E1E5E9] flex items-center justify-between text-xs text-[#5E6875]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <ListTodo className="w-3.5 h-3.5 text-[#87909B]" />
            <strong className="text-[#15191E]">{totalTasks}</strong> tasks
          </span>
          <span className="flex items-center gap-1 text-[#15803D] font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {completedTasks} completed
          </span>
          <span className="flex items-center gap-1 text-[#B45309] font-medium">
            <Clock className="w-3.5 h-3.5" />
            {stats.active || 0} active
          </span>
        </div>

        {totalTasks > 0 && (
          <span className="font-mono text-xs text-[#5E6875] font-semibold">
            {completionRate}% rate
          </span>
        )}
      </div>

      {totalTasks > 0 && (
        <div className="mt-2 h-1 bg-[#ECEFF1] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#101827] rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      )}

      {/* Delete Confirmation Card Overlay */}
      {showConfirm && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-xs rounded-2xl flex items-center justify-center p-4 z-10 animate-fadeIn">
          <div className="text-center">
            <p className="text-[#15191E] text-sm font-semibold mb-1">
              Remove {employee.name}?
            </p>
            <p className="text-[#5E6875] text-xs mb-4">
              This will revoke all workspace access.
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3.5 py-1.5 btn-secondary rounded-lg text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(employee._id);
                  setShowConfirm(false);
                }}
                disabled={isSubmitting}
                className="px-3.5 py-1.5 bg-[#B91C1C] hover:bg-[#991B1B] text-white rounded-lg text-xs transition-colors disabled:opacity-50 cursor-pointer font-semibold shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main EmployeesTab Component
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
  const [filter, setFilter] = useState("all");

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
    <div className="bg-white">
      {/* Header with Search and Filter */}
      <div className="p-5 sm:p-6 border-b border-[#E1E5E9] bg-[#F8FAFC]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] border border-[#E0E7FF] flex items-center justify-center text-[#3730A3]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base sm:text-lg text-[#15191E]">
                Team Directory
              </h2>
              <p className="text-[#5E6875] text-xs">
                {employees.length} provisioned team member{employees.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Add Employee
          </button>
        </div>

        {/* Search + Filter Chips */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#87909B]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by name or corporate email..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#E1E5E9] focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 rounded-xl text-xs sm:text-sm text-[#15191E] placeholder:text-[#87909B] transition-all"
            />
          </div>

          <div className="flex gap-1.5">
            {[
              { key: "all", label: "All Staff", count: employees.length },
              { key: "active", label: "Active", count: activeCount },
              { key: "inactive", label: "Inactive", count: inactiveCount },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filter === f.key
                    ? "bg-[#101827] text-white shadow-2xs"
                    : "bg-white text-[#5E6875] border border-[#E1E5E9] hover:bg-[#F8FAFC]"
                }`}
              >
                {f.label}
                <span className={`ml-1.5 text-[11px] font-mono ${filter === f.key ? "text-zinc-300" : "text-[#87909B]"}`}>
                  ({f.count})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 sm:p-6">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-5 saas-card animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#ECEFF1]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-36 bg-[#ECEFF1] rounded" />
                    <div className="h-3 w-48 bg-[#F5F6F7] rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 mx-auto mb-3.5 rounded-2xl bg-[#F5F6F7] border border-[#E1E5E9] flex items-center justify-center text-[#87909B]">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-display font-semibold text-[#15191E] text-base mb-1">
              {employees.length === 0
                ? "No team members provisioned yet"
                : "No matching members found"}
            </h3>
            <p className="text-[#5E6875] text-xs mb-5 max-w-sm mx-auto">
              {employees.length === 0
                ? "Invite your first employee to begin delegating deliverables."
                : "Try adjusting your search criteria."}
            </p>
            {employees.length === 0 && (
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary px-5 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                Add First Team Member
              </button>
            )}
          </div>
        ) : (
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
    </div>
  );
};

export default EmployeesTab;
