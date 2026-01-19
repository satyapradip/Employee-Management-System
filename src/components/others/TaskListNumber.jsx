import React from "react";

const TaskListNumber = () => {
  return (
    <div className="flex mt-10 gap-5 justify-between">
      <div className="w-[45%] bg-linear-to-br from-red-400 to-red-600 py-7 px-10 rounded-xl shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer backdrop-blur-sm border border-red-400/20">
        <h2 className="text-3xl font-bold tracking-tight">0</h2>
        <h3 className="text-xl font-medium opacity-90">New Task</h3>
      </div>
      <div className="w-[45%] bg-linear-to-br from-violet-400 to-violet-600 py-7 px-10 rounded-xl shadow-lg shadow-violet-500/20 hover:shadow-xl hover:shadow-violet-500/30 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer backdrop-blur-sm border border-violet-400/20">
        <h2 className="text-3xl font-bold tracking-tight">0</h2>
        <h3 className="text-xl font-medium opacity-90">New Task</h3>
      </div>
      <div className="w-[45%] bg-linear-to-br from-emerald-400 to-emerald-600 py-7 px-10 rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer backdrop-blur-sm border border-emerald-400/20">
        <h2 className="text-3xl font-bold tracking-tight">0</h2>
        <h3 className="text-xl font-medium opacity-90">New Task</h3>
      </div>
      <div className="w-[45%] bg-linear-to-br from-blue-500 to-blue-700 py-7 px-10 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer backdrop-blur-sm border border-blue-400/20">
        <h2 className="text-3xl font-bold tracking-tight">0</h2>
        <h3 className="text-xl font-medium opacity-90">New Task</h3>
      </div>
    </div>
  );
};

export default TaskListNumber;
