import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { LogOut, Bell, Shield, User } from "lucide-react";

/**
 * Modernized Dashboard Header Component
 * Shared between Admin and Employee workspaces
 * Inspired by Reference 1: Compact top navigation with search, role badges, and utility actions
 */
const Header = ({ userName = "User", onLogout }) => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const initial = (userName?.charAt(0) || "U").toUpperCase();
  const role = user?.role || "user";
  const isAdmin = role === "admin";

  return (
    <header className="bg-white border border-[#E1E5E9] rounded-2xl p-4 sm:p-5 shadow-xs mb-6 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Section: Avatar + Greeting + Role Badge */}
        <div className="flex items-center gap-3.5">
          <div
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-display font-bold text-white text-base sm:text-lg shadow-xs shrink-0 ${
              isAdmin
                ? "bg-[#101827]"
                : "bg-[#4F46E5]"
            }`}
          >
            {initial}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs text-[#475569] font-medium">
                {getGreeting()},
              </span>
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  isAdmin
                    ? "bg-[#EEF2FF] text-[#3730A3] border border-[#E0E7FF]"
                    : "bg-[#E1F4F1] text-[#0F766E] border border-[#CCFBF1]"
                }`}
              >
                {isAdmin ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                {isAdmin ? "Admin Console" : "Employee Portal"}
              </span>
            </div>

            <h1 className="font-display font-bold text-lg sm:text-xl text-[#0F172A] tracking-[-0.025em]">
              {userName}
            </h1>
          </div>
        </div>

        {/* Right Section: Actions & Utilities */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          {/* Notification Button */}
          <button
            type="button"
            className="relative p-2.5 rounded-xl border border-[#E1E5E9] bg-white text-[#5E6875] hover:text-[#15191E] hover:bg-[#F8FAFC] hover:border-[#CBD2D9] transition-all cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E76F51]" />
          </button>

          {/* Logout Button */}
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#FEE2E2] bg-[#FEF2F2] text-[#B91C1C] hover:bg-[#FEE2E2] hover:border-[#FECACA] text-xs sm:text-sm font-semibold transition-all cursor-pointer"
            aria-label="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
