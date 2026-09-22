import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

const ResetPassword = () => {
  const { token: paramToken } = useParams();
  const [searchParams] = useSearchParams();
  const sessionToken =
    typeof sessionStorage !== "undefined"
      ? sessionStorage.getItem("pendingResetToken")
      : null;
  const token = paramToken || searchParams.get("token") || sessionToken;

  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Verify token on mount
  useEffect(() => {
    if (success) return;

    const verifyToken = async () => {
      try {
        const response = await api.auth.verifyResetToken(token);
        if (response.success && response.data?.valid) {
          setIsValid(true);
          setEmail(response.data.email || "");
        } else {
          setError(response.message || "Invalid or expired reset link");
        }
      } catch (err) {
        setError(err.message || "Invalid or expired reset link");
      } finally {
        setIsVerifying(false);
      }
    };

    if (token) {
      verifyToken();
    } else {
      setIsVerifying(false);
      setError("No reset token provided in link");
    }
  }, [token, success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.auth.resetPassword(token, password);
      if (response.success) {
        setSuccess(true);

        if (response.data?.token && response.data?.user) {
          localStorage.setItem("loggedInUser", JSON.stringify(response.data.user));
          setTimeout(() => {
            const dashboardRoute =
              response.data.user.role === "admin" ? "/admin" : "/employee";
            navigate(dashboardRoute, { replace: true });
          }, 1800);
        } else {
          setTimeout(() => {
            navigate("/login", { replace: true });
          }, 1800);
        }
      }
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen w-full bg-[#F5F6F7] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-9 h-9 border-2 border-[#4F46E5] border-t-transparent rounded-full animate-spin"></div>
          <div className="text-[#101827] font-medium text-sm">Verifying security token...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#F5F6F7] flex items-center justify-center p-4 sm:p-6 relative">
      <div className="relative z-10 w-full max-w-md">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-[#101827] transition-colors mb-6 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Sign In
        </Link>

        <div className="bg-white rounded-2xl border border-[#E1E5E9] shadow-sm p-8 sm:p-10">
          {success ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669]">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-[#101827] mb-2 tracking-tight">
                Password Reset Complete
              </h2>
              <p className="text-[#64748B] text-sm leading-relaxed mb-6">
                Your credentials have been securely updated. Redirecting you to your workspace...
              </p>
              <div className="w-full bg-[#F1F5F9] rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#059669] h-full w-full animate-pulse" />
              </div>
            </div>
          ) : !isValid ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center text-[#DC2626]">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-[#101827] mb-2 tracking-tight">
                Invalid or Expired Link
              </h2>
              <p className="text-[#64748B] text-sm leading-relaxed mb-6">
                {error || "This password reset token has expired or is no longer valid."}
              </p>
              <Link
                to="/forgot-password"
                className="w-full bg-[#101827] hover:bg-[#1E293B] text-white py-3 rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                Request New Reset Link
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex p-3 rounded-xl bg-[#EEF2FF] border border-[#C7D2FE] text-[#4F46E5] mb-3">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold text-[#101827] tracking-tight">
                  Set new password
                </h1>
                <p className="text-[#64748B] text-xs sm:text-sm mt-1.5">
                  Enter your updated credentials for{" "}
                  <span className="text-[#101827] font-semibold">{email}</span>
                </p>
              </div>

              {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-xs sm:text-sm flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="flex-1 leading-snug">{error}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="reset-new-password"
                    className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                    <input
                      id="reset-new-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="•••••••• (Min 6 characters)"
                      className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-white border border-[#E1E5E9] text-[#101827] placeholder-[#94A3B8] text-sm focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#94A3B8] hover:text-[#475569] cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="reset-confirm-password"
                    className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                    <input
                      id="reset-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-white border border-[#E1E5E9] text-[#101827] placeholder-[#94A3B8] text-sm focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#94A3B8] hover:text-[#475569] cursor-pointer"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#101827] hover:bg-[#1E293B] text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm mt-5 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Updating password...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Save &amp; Enter Workspace
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
