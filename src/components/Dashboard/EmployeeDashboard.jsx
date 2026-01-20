import React, { useMemo } from "react";
import Header from "../others/Header";
import TaskListNumber from "../others/TaskListNumber";
import TaskList from "../TaskList/TaskList";

/**
 * Welcome Banner Component
 */
const WelcomeBanner = ({ name }) => {
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  return (
    <div className="mb-8 animate-slideDown">
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-violet-600 via-purple-600 to-indigo-600 p-8 shadow-2xl shadow-purple-500/20">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl" />

        {/* Floating particles */}
        <div className="absolute top-4 right-20 w-2 h-2 bg-white/30 rounded-full animate-float" />
        <div className="absolute top-10 right-32 w-1.5 h-1.5 bg-white/40 rounded-full animate-float-delayed" />
        <div className="absolute bottom-6 right-16 w-1 h-1 bg-white/50 rounded-full animate-float" />

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm font-medium mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {greeting}
            </p>
            <h1 className="text-3xl font-bold text-white">
              Welcome back,{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-200 to-cyan-200">
                {name || "Employee"}
              </span>
              !
            </h1>
            <p className="text-white/60 mt-2 max-w-md">
              Here's an overview of your tasks and activities. Stay productive
              and have a great day!
            </p>
          </div>

          {/* Date Widget */}
          <div className="hidden md:flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <span className="text-sm text-white/60 uppercase tracking-wider">
              Today
            </span>
            <span className="text-4xl font-bold text-white">
              {new Date().getDate()}
            </span>
            <span className="text-sm text-white/80">
              {new Date().toLocaleDateString("en-US", { weekday: "long" })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Quick Actions Component
 */
const QuickActions = () => {
  const actions = [
    {
      icon: "📋",
      label: "View All Tasks",
      color: "from-blue-500 to-indigo-500",
    },
    {
      icon: "✅",
      label: "Mark Complete",
      color: "from-emerald-500 to-teal-500",
    },
    { icon: "📊", label: "My Progress", color: "from-amber-500 to-orange-500" },
    { icon: "💬", label: "Get Help", color: "from-pink-500 to-rose-500" },
  ];

  return (
    <div className="mb-8 animate-fadeIn" style={{ animationDelay: "200ms" }}>
      <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            className="group relative overflow-hidden flex items-center gap-3 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <span
              className={`w-10 h-10 rounded-lg bg-linear-to-br ${action.color} flex items-center justify-center text-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}
            >
              {action.icon}
            </span>
            <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">
              {action.label}
            </span>
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-white/5 to-transparent" />
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * Employee Dashboard Component
 */
const EmployeeDashboard = ({ data, onLogout }) => {
  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 `bg-[radial-gradient(circle_at_center,_rgba(120,119,198,0.05)_0%,_transparent_50%)]`" />
      <div
        className="fixed inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 p-6 md:p-10 text-white">
        <Header userName={data?.name || data?.email} onLogout={onLogout} />

        <WelcomeBanner name={data?.name} />

        <QuickActions />

        <TaskListNumber data={data} />

        <TaskList data={data} />
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
          opacity: 0;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 3s ease-in-out infinite 1.5s;
        }
      `}</style>
    </div>
  );
};

export default EmployeeDashboard;
