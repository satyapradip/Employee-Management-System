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
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
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
        className="block text-xs font-semibold text-[#475569] uppercase tracking-wider"
      >
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
        )}
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full ${Icon ? "pl-10" : "pl-3.5"} ${
            rightElement ? "pr-11" : "pr-3.5"
          } py-2.5 rounded-xl bg-white border ${
            error ? "border-[#EF4444] focus:ring-[#EF4444]" : "border-[#E1E5E9] focus:border-[#4F46E5] focus:ring-[#4F46E5]"
          } text-[#101827] placeholder-[#94A3B8] text-sm focus:outline-none focus:ring-1 transition-all`}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p className="text-[#DC2626] text-xs pl-1 flex items-center gap-1 mt-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
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
    <div className="min-h-screen w-full bg-[#F5F6F7] flex items-center justify-center p-4 sm:p-6 lg:p-10 relative">
      <div className="relative z-10 w-full max-w-4xl">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-[#101827] transition-colors mb-6 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Home
        </Link>

        {/* Split Onboarding Card */}
        <div className="bg-white rounded-2xl border border-[#E1E5E9] shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Dark Navy Sidebar */}
          <div className="lg:col-span-5 p-8 sm:p-10 bg-[#101827] text-white border-b lg:border-b-0 lg:border-r border-[#1E293B] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center p-2">
                  <img
                    src="/TeamFlow_logo.png"
                    alt="TeamFlow"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="font-bold text-white text-base leading-snug">
                    TeamFlow
                  </div>
                  <div className="text-[11px] uppercase tracking-wider text-[#A5B4FC] font-medium">
                    Workspace Provisioning
                  </div>
                </div>
              </div>

              <h2 className="font-bold text-2xl sm:text-3xl text-white tracking-tight leading-tight mb-4">
                Launch your company command center.
              </h2>
              <p className="text-[#94A3B8] text-xs sm:text-sm leading-relaxed mb-8">
                Initialize an isolated corporate environment with role-gated delegation, employee directories, and sprint analytics.
              </p>

              <div className="space-y-4 text-xs sm:text-sm text-[#CBD5E1]">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#059669]/20 text-[#34D399] flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold text-white">Full Admin Authority:</span> Provision staff credentials and oversee task flows.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#4F46E5]/20 text-[#818CF8] flex items-center justify-center shrink-0 mt-0.5">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold text-white">Immediate Access:</span> Zero configuration needed—start creating tasks right away.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#E76F51]/20 text-[#FCA5A5] flex items-center justify-center shrink-0 mt-0.5">
                    <BarChart3 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold text-white">Real-Time Auditing:</span> Complete history of task assignments and completions.
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-[#1E293B] text-xs text-[#94A3B8]">
              Already have an admin account?{" "}
              <Link to="/login" className="text-[#818CF8] hover:text-white font-semibold">
                Sign in here
              </Link>
            </div>
          </div>

          {/* Right Column: Registration Form */}
          <div className="lg:col-span-7 p-8 sm:p-10 bg-white">
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE] mb-2.5">
                <Sparkles className="w-3.5 h-3.5" />
                Free Workspace Setup
              </span>
              <h3 className="font-bold text-xl sm:text-2xl text-[#101827] tracking-tight">
                Register as Admin
              </h3>
              <p className="text-[#64748B] text-xs sm:text-sm mt-1">
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
                      className="p-1 text-[#94A3B8] hover:text-[#475569] cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
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
                      className="p-1 text-[#94A3B8] hover:text-[#475569] cursor-pointer"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
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
                className="w-full bg-[#101827] hover:bg-[#1E293B] text-white py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm mt-6 disabled:opacity-50"
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

              <p className="text-[11px] text-[#94A3B8] text-center pt-2">
                By registering, you agree to the Terms of Service and Privacy Policy.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
