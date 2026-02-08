import React, { useState } from "react";
import { motion as Motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Mail,
  User,
  Lock,
  Sparkles,
  Shield,
  CreditCard,
} from "lucide-react";
import api from "../services/api";
import useToast from "../hooks/useToast";
import logger from "../utils/logger";

/* ─── Input (defined OUTSIDE component to prevent remount on re-render) ─── */
function FormInput({
  label,
  name,
  type = "text",
  icon: Icon,
  value,
  error,
  onChange,
  placeholder,
  ...props
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-zinc-300 tracking-wide"
      >
        {label}
      </label>
      <div className="relative group">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-zinc-500 group-focus-within:text-indigo-400 transition-colors duration-200" />
        )}
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full ${Icon ? "pl-11" : "pl-4"} pr-4 py-3 bg-white/[0.04] border ${
            error
              ? "border-red-500/60 focus:ring-red-500/30"
              : "border-white/10 focus:border-indigo-500/60 focus:ring-indigo-500/20"
          } rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 transition-all duration-200 text-[15px]`}
          {...props}
        />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/0 to-purple-500/0 group-focus-within:from-indigo-500/5 group-focus-within:to-purple-500/5 transition-all duration-300 pointer-events-none" />
      </div>
      {error && (
        <p className="text-[13px] text-red-400 flex items-center gap-1.5 pl-1">
          <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
          {error}
        </p>
      )}
    </div>
  );
}

/* ─── Main Registration Page ─── */
export default function CompanyRegistration() {
  const navigate = useNavigate();
  const showToast = useToast();

  const [isLoading, setIsLoading] = useState(false);

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

    if (!formData.companyName.trim())
      newErrors.companyName = "Company name is required";
    else if (formData.companyName.length < 2)
      newErrors.companyName = "Must be at least 2 characters";

    if (!formData.name.trim()) newErrors.name = "Your name is required";
    else if (formData.name.length < 2)
      newErrors.name = "Must be at least 2 characters";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Enter a valid email address";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "At least 6 characters";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords don't match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const payload = {
        companyName: formData.companyName,
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      logger.info("Registering admin with payload:", payload);

      const response = await api.auth.registerAdmin(payload);

      logger.info("Admin registered!", response);
      showToast("success", "Account created! Logging you in...");

      const { token, user } = response.data;

      // Save user data with token (same format as login)
      const userData = {
        ...user,
        token,
      };

      localStorage.setItem("loggedInUser", JSON.stringify(userData));

      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 1200);
    } catch (error) {
      logger.error("Registration failed", {
        message: error.message,
        statusCode: error.statusCode,
        errors: error.errors,
      });

      // Handle validation errors
      if (error.errors && error.errors.length > 0) {
        const backendErrors = {};
        error.errors.forEach((err) => {
          if (typeof err === "object" && err.field) {
            backendErrors[err.field] = err.message;
          }
        });

        if (Object.keys(backendErrors).length > 0) {
          setErrors(backendErrors);
          showToast("error", "Please fix the validation errors");
          return;
        }
      }

      const msg = error.message || "Registration failed. Please try again.";
      showToast("error", msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none" />

      <Motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-xl"
      >
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-200 transition-colors mb-8 text-sm group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            <span className="bg-gradient-to-r from-white via-white to-zinc-400 bg-clip-text text-transparent">
              Create your{" "}
            </span>
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              account
            </span>
          </h1>
          <p className="text-zinc-500 text-[15px]">
            Set up your workspace in under a minute. Free forever for small
            teams.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-7 shadow-2xl shadow-black/20">
          <form onSubmit={handleSubmit} className="space-y-5">
            <FormInput
              label="Company Name"
              name="companyName"
              icon={Building2}
              placeholder="Acme Corporation"
              value={formData.companyName}
              error={errors.companyName}
              onChange={handleChange}
            />

            <FormInput
              label="Full Name"
              name="name"
              icon={User}
              placeholder="John Doe"
              value={formData.name}
              error={errors.name}
              onChange={handleChange}
            />

            <FormInput
              label="Email Address"
              name="email"
              type="email"
              icon={Mail}
              placeholder="john@acmecorp.com"
              value={formData.email}
              error={errors.email}
              onChange={handleChange}
            />

            <FormInput
              label="Password"
              name="password"
              type="password"
              icon={Lock}
              placeholder="Minimum 6 characters"
              value={formData.password}
              error={errors.password}
              onChange={handleChange}
            />

            <FormInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              icon={Lock}
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              error={errors.confirmPassword}
              onChange={handleChange}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-semibold text-white text-[15px] hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Creating...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Sign in link */}
          <div className="mt-7 pt-6 border-t border-white/[0.04] text-center">
            <p className="text-zinc-500 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Trust signals */}
        <div className="mt-8 flex items-center justify-center gap-8 text-zinc-600 text-xs">
          {[
            { icon: Sparkles, text: "Quick Setup" },
            { icon: Shield, text: "256-bit Encryption" },
            { icon: CreditCard, text: "No Credit Card" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <item.icon className="w-3.5 h-3.5" />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </Motion.div>
    </div>
  );
}
