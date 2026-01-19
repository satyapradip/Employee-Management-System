import React from "react";
import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(email, password);
    // Add login logic here
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

        <form onSubmit={submitHandler} className="flex flex-col gap-5">
          <div className="relative group">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/5 text-white outline-none border border-gray-700 focus:border-emerald-500 py-4 px-5 rounded-xl placeholder:text-gray-500 transition-all duration-300 focus:shadow-lg focus:shadow-emerald-500/20"
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
              className="w-full bg-white/5 text-white outline-none border border-gray-700 focus:border-emerald-500 py-4 px-5 rounded-xl placeholder:text-gray-500 transition-all duration-300 focus:shadow-lg focus:shadow-emerald-500/20"
              type="password"
              placeholder="Enter your password"
            />
            <div className="absolute inset-0 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 opacity-0 group-focus-within:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
          </div>

          <div className="flex justify-end">
            <a
              href="#"
              className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
            >
              Forgot password?
            </a>
          </div>

          <button
            className="relative mt-2 bg-linear-to-r from-emerald-600 to-teal-600 text-white font-semibold py-4 px-6 rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98]"
            type="submit"
          >
            <span className="relative z-10">Sign In</span>
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
