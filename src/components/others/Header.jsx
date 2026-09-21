import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { LogOut, Bell, Shield, User, Sparkles } from "lucide-react";

/**
 * Modernized Dashboard Header Component
 * Shared between Admin and Employee workspaces
 */
const Header = ({ userName = "User", onLogout }) => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const initial = (userName?.charAt(0) || "U").toUpperCase();
  const role = user?.role || "user";
  const isAdmin = role === "admin";

  return (
    <div className="relative overflow-hidden glass-panel rounded-2xl border border-white/10 p-5 sm:p-6 shadow-2xl shadow-black/40 mb-8">
      {/* Background Subtle Gradient Accents */}
      <div className="absolute top-0 right-0 w-80 h-36 bg-linear-to-l from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-64 h-24 bg-cyan-500/5 blur-2xl pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Section: Avatar + Greeting + Role Badge */}
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-display font-bold text-white text-lg sm:text-xl shadow-lg ${
              isAdmin
                ? "bg-linear-to-tr from-indigo-600 via-indigo-500 to-purple-500 shadow-indigo-500/25"
                : "bg-linear-to-tr from-cyan-600 via-teal-500 to-emerald-500 shadow-cyan-500/25"
            }`}
          >
            {initial}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs text-zinc-400 font-medium">
                {getGreeting()},
              </span>
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  isAdmin
                    ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30"
                    : "bg-cyan-500/15 text-cyan-300 border-cyan-500/30"
                }`}
              >
                {isAdmin ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                {isAdmin ? "Admin Portal" : "Employee Portal"}
              </span>
            </div>

            <h1 className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight">
              {userName}
            </h1>
          </div>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Notification Button */}
          <button
            type="button"
            className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500" />
          </button>

          {/* Logout Button */}
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
