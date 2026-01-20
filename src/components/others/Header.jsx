import React from "react";

/**
 * Header Component
 * Displays greeting and logout button for dashboard
 */
const Header = ({ userName = "Admin", onLogout }) => {
  // Get current hour for dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="relative overflow-hidden bg-linear-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-2xl border border-zinc-700/50 p-6 shadow-2xl">
      {/* Background Glow Effect */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="relative flex items-center justify-between">
        {/* Left Section - Greeting */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-xl bg-linear-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-emerald-500/25">
            {userName.charAt(0).toUpperCase()}
          </div>

          {/* Greeting Text */}
          <div>
            <p className="text-zinc-400 text-sm font-medium">
              {getGreeting()}{" "}
              <span className="animate-wave inline-block">👋</span>
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-white mt-0.5">
              {userName}
              <span className="text-emerald-400">.</span>
            </h1>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <button className="relative p-3 rounded-xl bg-zinc-800/80 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            {/* Notification Badge */}
            <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full" />
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="font-medium hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
