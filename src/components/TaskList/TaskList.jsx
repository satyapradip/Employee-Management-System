import React from "react";

const TaskList = () => {
  return (
    <div
      id="tasklist"
      className="min-h-50 w-full py-5 mt-10 rounded-xl items-center justify-start gap-5 flex-nowrap flex overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/30"
    >
      <div className="shrink-0 h-52 w-80 p-5 rounded-2xl bg-linear-to-br from-rose-500 to-pink-600 shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/40 hover:scale-[1.02] hover:-translate-y-2 transition-all duration-300 ease-out cursor-pointer border border-white/10 backdrop-blur-sm group">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-semibold bg-red-900/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-red-400/30">
            High
          </h3>
          <h4 className="text-sm opacity-80 font-medium">20 Jan, 2026</h4>
        </div>
        <h2 className="mt-4 text-lg font-bold leading-tight group-hover:text-white/95 transition-colors">
          Make a Youtube video and upload it
        </h2>
        <p className="text-sm mt-2 opacity-75 leading-relaxed line-clamp-2">
          This is for a project, related to React development, which will help
          improve my skills.
        </p>
      </div>
      <div className="shrink-0 h-52 w-80 p-5 rounded-2xl bg-linear-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/40 hover:scale-[1.02] hover:-translate-y-2 transition-all duration-300 ease-out cursor-pointer border border-white/10 backdrop-blur-sm group">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-semibold bg-violet-900/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-violet-400/30">
            Medium
          </h3>
          <h4 className="text-sm opacity-80 font-medium">20 Jan, 2026</h4>
        </div>
        <h2 className="mt-4 text-lg font-bold leading-tight group-hover:text-white/95 transition-colors">
          Make a Youtube video and upload it
        </h2>
        <p className="text-sm mt-2 opacity-75 leading-relaxed line-clamp-2">
          This is for a project, related to React development, which will help
          improve my skills.
        </p>
      </div>
      <div className="shrink-0 h-52 w-80 p-5 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02] hover:-translate-y-2 transition-all duration-300 ease-out cursor-pointer border border-white/10 backdrop-blur-sm group">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-semibold bg-blue-900/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-blue-400/30">
            Low
          </h3>
          <h4 className="text-sm opacity-80 font-medium">20 Jan, 2026</h4>
        </div>
        <h2 className="mt-4 text-lg font-bold leading-tight group-hover:text-white/95 transition-colors">
          Make a Youtube video and upload it
        </h2>
        <p className="text-sm mt-2 opacity-75 leading-relaxed line-clamp-2">
          This is for a project, related to React development, which will help
          improve my skills.
        </p>
      </div>
      <div className="shrink-0 h-52 w-80 p-5 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.02] hover:-translate-y-2 transition-all duration-300 ease-out cursor-pointer border border-white/10 backdrop-blur-sm group">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-semibold bg-emerald-900/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-emerald-400/30">
            Done
          </h3>
          <h4 className="text-sm opacity-80 font-medium">20 Jan, 2026</h4>
        </div>
        <h2 className="mt-4 text-lg font-bold leading-tight group-hover:text-white/95 transition-colors">
          Make a Youtube video and upload it
        </h2>
        <p className="text-sm mt-2 opacity-75 leading-relaxed line-clamp-2">
          This is for a project, related to React development, which will help
          improve my skills.
        </p>
      </div>
      <div className="shrink-0 h-52 w-80 p-5 rounded-2xl bg-linear-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/40 hover:scale-[1.02] hover:-translate-y-2 transition-all duration-300 ease-out cursor-pointer border border-white/10 backdrop-blur-sm group">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-semibold bg-amber-900/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-amber-400/30">
            Pending
          </h3>
          <h4 className="text-sm opacity-80 font-medium">20 Jan, 2026</h4>
        </div>
        <h2 className="mt-4 text-lg font-bold leading-tight group-hover:text-white/95 transition-colors">
          Make a Youtube video and upload it
        </h2>
        <p className="text-sm mt-2 opacity-75 leading-relaxed line-clamp-2">
          This is for a project, related to React development, which will help
          improve my skills.
        </p>
      </div>
      <div className="shrink-0 h-52 w-80 p-5 rounded-2xl bg-linear-to-br from-cyan-500 to-sky-600 shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40 hover:scale-[1.02] hover:-translate-y-2 transition-all duration-300 ease-out cursor-pointer border border-white/10 backdrop-blur-sm group">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-semibold bg-cyan-900/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-cyan-400/30">
            Review
          </h3>
          <h4 className="text-sm opacity-80 font-medium">20 Jan, 2026</h4>
        </div>
        <h2 className="mt-4 text-lg font-bold leading-tight group-hover:text-white/95 transition-colors">
          Make a Youtube video and upload it
        </h2>
        <p className="text-sm mt-2 opacity-75 leading-relaxed line-clamp-2">
          This is for a project, related to React development, which will help
          improve my skills.
        </p>
      </div>
      <div className="shrink-0 h-52 w-80 p-5 rounded-2xl bg-linear-to-br from-slate-500 to-gray-600 shadow-lg shadow-slate-500/25 hover:shadow-xl hover:shadow-slate-500/40 hover:scale-[1.02] hover:-translate-y-2 transition-all duration-300 ease-out cursor-pointer border border-white/10 backdrop-blur-sm group">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-semibold bg-slate-900/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-400/30">
            Archive
          </h3>
          <h4 className="text-sm opacity-80 font-medium">20 Jan, 2026</h4>
        </div>
        <h2 className="mt-4 text-lg font-bold leading-tight group-hover:text-white/95 transition-colors">
          Make a Youtube video and upload it
        </h2>
        <p className="text-sm mt-2 opacity-75 leading-relaxed line-clamp-2">
          This is for a project, related to React development, which will help
          improve my skills.
        </p>
      </div>
      <div className="shrink-0 h-52 w-80 p-5 rounded-2xl bg-linear-to-br from-fuchsia-500 to-pink-600 shadow-lg shadow-fuchsia-500/25 hover:shadow-xl hover:shadow-fuchsia-500/40 hover:scale-[1.02] hover:-translate-y-2 transition-all duration-300 ease-out cursor-pointer border border-white/10 backdrop-blur-sm group">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-semibold bg-fuchsia-900/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-fuchsia-400/30">
            Urgent
          </h3>
          <h4 className="text-sm opacity-80 font-medium">20 Jan, 2026</h4>
        </div>
        <h2 className="mt-4 text-lg font-bold leading-tight group-hover:text-white/95 transition-colors">
          Make a Youtube video and upload it
        </h2>
        <p className="text-sm mt-2 opacity-75 leading-relaxed line-clamp-2">
          This is for a project, related to React development, which will help
          improve my skills.
        </p>
      </div>
    </div>
  );
};

export default TaskList;
