import React from "react";

/**
 * Skeleton Loader Component
 * Displays placeholder content while data is loading
 */

// Base skeleton pulse animation
const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-zinc-700/50 rounded ${className}`} />
);

/**
 * Task Card Skeleton
 */
export const TaskCardSkeleton = ({ index = 0 }) => (
  <div
    className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-5 animate-fadeIn"
    style={{ animationDelay: `${index * 50}ms` }}
  >
    {/* Header */}
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        <Skeleton className="w-2 h-2 rounded-full" />
        <Skeleton className="w-16 h-4" />
      </div>
      <Skeleton className="w-24 h-6 rounded-full" />
    </div>

    {/* Title */}
    <Skeleton className="w-3/4 h-6 mb-2" />

    {/* Description */}
    <Skeleton className="w-full h-4 mb-2" />
    <Skeleton className="w-2/3 h-4 mb-4" />

    {/* Footer */}
    <div className="flex items-center justify-between pt-3 border-t border-zinc-700/50">
      <div className="flex items-center gap-2">
        <Skeleton className="w-7 h-7 rounded-full" />
        <Skeleton className="w-20 h-4" />
      </div>
      <Skeleton className="w-16 h-4" />
    </div>
  </div>
);

/**
 * Task List Skeleton - Multiple cards
 */
export const TaskListSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {Array.from({ length: count }).map((_, index) => (
      <TaskCardSkeleton key={index} index={index} />
    ))}
  </div>
);

/**
 * Stats Card Skeleton
 */
export const StatsCardSkeleton = () => (
  <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4 animate-pulse">
    <div className="flex items-center gap-3 mb-3">
      <Skeleton className="w-10 h-10 rounded-xl" />
      <Skeleton className="w-20 h-4" />
    </div>
    <Skeleton className="w-12 h-8 mb-1" />
    <Skeleton className="w-16 h-3" />
  </div>
);

/**
 * Sidebar Skeleton
 */
export const SidebarSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 4 }).map((_, index) => (
      <StatsCardSkeleton key={index} />
    ))}
  </div>
);

/**
 * Full Page Loading
 */
export const FullPageLoader = ({ message = "Loading..." }) => (
  <div className="min-h-100 flex flex-col items-center justify-center">
    <div className="relative">
      {/* Outer ring */}
      <div className="w-16 h-16 rounded-full border-4 border-zinc-700" />
      {/* Spinning ring */}
      <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-emerald-500 animate-spin" />
    </div>
    <p className="mt-4 text-zinc-400 font-medium">{message}</p>
  </div>
);

/**
 * Error State Component
 */
export const ErrorState = ({ message, onRetry }) => (
  <div className="min-h-100 flex flex-col items-center justify-center text-center px-6">
    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
      <svg
        className="w-8 h-8 text-red-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-white mb-2">
      Something went wrong
    </h3>
    <p className="text-zinc-400 mb-6 max-w-sm">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-colors"
      >
        Try Again
      </button>
    )}
  </div>
);

export default Skeleton;
