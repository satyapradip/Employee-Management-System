import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const Login = ({ onForgotPassword }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const { login, clearError } = useAuth();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmitting(true);

    const result = await login(email, password);

    if (!result.success) {
      setLoginError(result.error);
    }

    setIsSubmitting(false);
    // Only clear form on successful login
    if (result.success) {
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-linear-to-br from-gray-900 via-black to-gray-900">
      <div className="relative backdrop-blur-xl bg-white/5 border border-emerald-500/30 p-10 rounded-2xl shadow-2xl shadow-emerald-500/10 w-full max-w-md mx-4">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-linear-to-r from-emerald-600 to-teal-600 rounded-2xl blur-xl opacity-20 -z-10"></div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-linear-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Welcome to EMP
          </h1>
          <p className="text-gray-400 mt-2">Sign in to your account</p>
        </div>

        {/* Error Message */}
        {loginError && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm flex items-center gap-2">
            <svg
              className="w-5 h-5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{loginError}</span>
            <button
              onClick={() => {
                setLoginError(null);
                clearError();
              }}
              className="ml-auto text-red-400 hover:text-red-300"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        <form onSubmit={submitHandler} className="flex flex-col gap-5">
          <div className="relative group">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full bg-white/5 text-white outline-none border border-gray-700 focus:border-emerald-500 py-4 px-5 rounded-xl placeholder:text-gray-500 transition-all duration-300 focus:shadow-lg focus:shadow-emerald-500/20 disabled:opacity-50"
              type="email"
              placeholder="Enter your email"
            />
            <div className="absolute inset-0 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 opacity-0 group-focus-within:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
          </div>

          <div className="relative group">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full bg-white/5 text-white outline-none border border-gray-700 focus:border-emerald-500 py-4 px-5 rounded-xl placeholder:text-gray-500 transition-all duration-300 focus:shadow-lg focus:shadow-emerald-500/20 disabled:opacity-50"
              type="password"
              placeholder="Enter your password"
            />
            <div className="absolute inset-0 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 opacity-0 group-focus-within:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors duration-200 bg-transparent border-none cursor-pointer"
            >
              Forgot password?
            </button>
          </div>

          <button
            className="relative mt-2 bg-linear-to-r from-emerald-600 to-teal-600 text-white font-semibold py-4 px-6 rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            type="submit"
            disabled={isSubmitting}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </span>
            <div className="absolute inset-0 bg-linear-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-white/20 to-transparent"></div>
          </button>
        </form>

        <p className="text-center text-gray-400 mt-8">
          Don't have an account?{" "}
          <a
            href="#"
            className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors duration-200"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
