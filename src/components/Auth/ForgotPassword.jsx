import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Mail, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await api.auth.forgotPassword(email.trim());
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to send reset email. Please verify the address.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F5F6F7] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-subtle-grid opacity-50 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#5E6875] hover:text-[#15191E] transition-colors mb-5 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Sign In</span>
        </Link>

        <div className="bg-white p-7 sm:p-9 rounded-3xl border border-[#E1E5E9] shadow-lg shadow-black/4">
          {success ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#DCFCE7] border border-[#BBF7D0] flex items-center justify-center text-[#15803D]">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h2 className="font-display font-bold text-2xl text-[#15191E] mb-2">
                Check Your Email
              </h2>
              <p className="text-[#5E6875] text-xs sm:text-sm leading-relaxed mb-6">
                We&apos;ve sent a password reset link to{" "}
                <span className="text-[#101827] font-semibold">{email}</span>.
                The link is valid for 10 minutes.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="w-full btn-primary py-3 rounded-xl font-semibold text-xs sm:text-sm cursor-pointer shadow-xs"
              >
                Return to Sign In
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex p-3 rounded-2xl bg-[#EEF2FF] border border-[#E0E7FF] text-[#3730A3] mb-3.5">
                  <Mail className="w-6 h-6" />
                </div>
                <h1 className="font-display font-bold text-2xl text-[#15191E] tracking-tight">
                  Reset Password
                </h1>
                <p className="text-[#5E6875] text-xs sm:text-sm mt-1">
                  Enter your registered work email and we will dispatch a reset link.
                </p>
              </div>

              {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-[#FEE2E2] border border-[#FECACA] text-[#B91C1C] text-xs sm:text-sm flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="flex-1 leading-snug">{error}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="forgot-email"
                    className="block text-xs font-semibold text-[#5E6875] uppercase tracking-wider mb-1.5"
                  >
                    Work Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#87909B]" />
                    <input
                      id="forgot-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="name@company.com"
                      autoComplete="email"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#E1E5E9] focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 text-sm text-[#15191E] placeholder:text-[#87909B] transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary py-3 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs mt-6 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending reset link...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Send Reset Instructions
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

export default ForgotPassword;
