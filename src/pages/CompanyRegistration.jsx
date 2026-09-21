import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Mail,
  User,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Shield,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import api from "../services/api";
import useToast from "../hooks/useToast";
import { useAuth } from "../hooks/useAuth";
import logger from "../utils/logger";

function FormInput({
  label,
  name,
  type = "text",
  icon: Icon,
  value,
  error,
  onChange,
  placeholder,
  rightElement,
  ...props
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={name}
        className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider"
      >
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        )}
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full ${Icon ? "pl-10" : "pl-4"} ${
            rightElement ? "pr-11" : "pr-4"
          } py-3 rounded-xl glass-input text-sm ${
            error ? "border-red-500/60 focus:ring-red-500/30" : ""
          }`}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-400 text-xs pl-1 flex items-center gap-1 mt-1">
          <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
          {error}
        </p>
      )}
    </div>
  );
}

export default function CompanyRegistration() {
  const navigate = useNavigate();
  const showToast = useToast();
  const { login } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    } else if (formData.companyName.length < 2) {
      newErrors.companyName = "Must be at least 2 characters";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Admin full name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Work email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid corporate email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "At least 6 characters required";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const payload = {
        companyName: formData.companyName.trim(),
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      };

      logger.info("Registering admin with payload:", payload);
      await api.auth.registerAdmin(payload);

      // Auto login
      const loginResult = await login(formData.email.trim(), formData.password);
      if (loginResult?.success) {
        showToast("Company workspace created! Welcome to TeamFlow.", "success");
        navigate("/admin");
      } else {
        showToast("Workspace initialized. Please sign in.", "success");
        navigate("/login");
      }
    } catch (error) {
      logger.error("Registration failed", error);

      if (error.errors && error.errors.length > 0) {
        const backendErrors = {};
        error.errors.forEach((err) => {
          if (typeof err === "object" && err.field) {
            backendErrors[err.field] = err.message;
          }
        });

        if (Object.keys(backendErrors).length > 0) {
          setErrors(backendErrors);
          showToast("Please review form validation errors", "error");
          return;
        }
      }

      const msg = error.message || "Registration failed. Please try again.";
      showToast(msg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#070b14] flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden">
      <div className="glow-ambient-indigo -top-30 left-1/2 -translate-x-1/2" />
      <div className="glow-ambient-cyan -bottom-25 -right-12.5" />
      <div className="absolute inset-0 bg-grid-subtle pointer-events-none opacity-40" />

      <div className="relative z-10 w-full max-w-4xl">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Home
        </Link>

        {/* Split Onboarding Glass Card */}
        <div className="glass-panel rounded-3xl border border-white/10 shadow-2xl shadow-black/70 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Organization Benefits Sidebar */}
          <div className="lg:col-span-5 p-8 sm:p-10 bg-linear-to-br from-indigo-950/60 via-[#0d1428] to-[#0a0f1d] border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-indigo-600 to-cyan-400 p-px">
                  <div className="w-full h-full bg-[#090e1c] rounded-[11px] flex items-center justify-center">
                    <img
                      src="/TeamFlow_logo.png"
                      alt="TeamFlow"
                      className="w-6 h-6 object-contain"
                    />
                  </div>
                </div>
                <div>
                  <div className="font-display font-bold text-white text-base">
                    TeamFlow
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-indigo-400 font-semibold">
                    Admin Workspace Setup
                  </div>
                </div>
              </div>

              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight leading-tight mb-4">
                Launch your company command center.
              </h2>
              <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed mb-8">
                Initialize an isolated corporate environment with role-gated delegation, employee directories, and sprint analytics.
              </p>

              <div className="space-y-4 text-xs sm:text-sm text-zinc-300">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold text-white">Full Admin Authority:</span> Provision staff credentials and oversee task flows.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold text-white">Immediate Access:</span> Zero configuration needed—start creating tasks right away.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold text-white">Real-Time Auditing:</span> Complete history of task assignments and completions.
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-white/10 text-xs text-zinc-400">
              Already have an admin account?{" "}
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold">
                Sign in here
              </Link>
            </div>
          </div>

          {/* Right Column: Registration Form */}
          <div className="lg:col-span-7 p-8 sm:p-10 bg-[#090e1c]">
            <div className="mb-6">
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 mb-2">
                <Sparkles className="w-3 h-3" />
                Free Workspace
              </span>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-white">
                Register as Admin
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm mt-1">
                Enter your organization details to configure your root administrator profile.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormInput
                label="Company or Organization Name"
                name="companyName"
                icon={Building2}
                value={formData.companyName}
                error={errors.companyName}
                onChange={handleChange}
                placeholder="Acme Innovations Inc."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Admin Full Name"
                  name="name"
                  icon={User}
                  value={formData.name}
                  error={errors.name}
                  onChange={handleChange}
                  placeholder="Alex Rivera"
                />

                <FormInput
                  label="Work Email Address"
                  name="email"
                  type="email"
                  icon={Mail}
                  value={formData.email}
                  error={errors.email}
                  onChange={handleChange}
                  placeholder="alex@acme.com"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Master Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  icon={Lock}
                  value={formData.password}
                  error={errors.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />

                <FormInput
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  icon={Lock}
                  value={formData.confirmPassword}
                  error={errors.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="p-1 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  }
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary-gradient py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-indigo-600/30 mt-6"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Initializing workspace...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Create Company &amp; Launch Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>

              <p className="text-[11px] text-zinc-400 text-center pt-2">
                By registering, you agree to the Terms of Service and Privacy Policy.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
