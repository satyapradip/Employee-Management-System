import React from "react";

/**
 * Skeleton Loader Component
 * Light clean placeholders following Reference 1 specifications
 */
const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-[#ECEFF1] rounded-lg ${className}`} />
);

/**
 * Task Card Skeleton
 */
export const TaskCardSkeleton = ({ index = 0 }) => (
  <div
    className="bg-white border border-[#E1E5E9] rounded-xl p-5 animate-fadeIn"
    style={{ animationDelay: `${index * 40}ms` }}
  >
    {/* Header */}
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        <Skeleton className="w-2 h-2 rounded-full" />
        <Skeleton className="w-16 h-4" />
      </div>
      <Skeleton className="w-20 h-5 rounded-full" />
    </div>

    {/* Title */}
    <Skeleton className="w-3/4 h-5 mb-2" />

    {/* Description */}
    <Skeleton className="w-full h-3 mb-2" />
    <Skeleton className="w-2/3 h-3 mb-4" />

    {/* Footer */}
    <div className="flex items-center justify-between pt-3 border-t border-[#E1E5E9]">
      <div className="flex items-center gap-2">
        <Skeleton className="w-6 h-6 rounded-full" />
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
  <div className="bg-white border border-[#E1E5E9] rounded-xl p-4 animate-pulse">
    <div className="flex items-center justify-between mb-3">
      <Skeleton className="w-16 h-3" />
      <Skeleton className="w-7 h-7 rounded-lg" />
    </div>
    <Skeleton className="w-12 h-7" />
  </div>
);

/**
 * Sidebar Skeleton
 */
export const SidebarSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 4 }).map((_, index) => (
      <StatsCardSkeleton key={index} />
    ))}
  </div>
);

/**
 * Full Page Loading
 */
export const FullPageLoader = ({ message = "Loading workspace telemetry..." }) => (
  <div className="min-h-80 flex flex-col items-center justify-center p-8">
    <div className="w-10 h-10 border-3 border-[#4F46E5] border-t-transparent rounded-full animate-spin mb-4" />
    <p className="text-xs sm:text-sm text-[#5E6875] font-medium">{message}</p>
  </div>
);

/**
 * Error State Component
 */
export const ErrorState = ({ message, onRetry }) => (
  <div className="min-h-80 flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl border border-[#FEE2E2]">
    <div className="w-12 h-12 rounded-xl bg-[#FEE2E2] flex items-center justify-center mb-3.5">
      <svg
        className="w-6 h-6 text-[#B91C1C]"
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
    <h3 className="text-base font-bold text-[#15191E] mb-1 font-display">
      Connection Issue Encountered
    </h3>
    <p className="text-xs text-[#5E6875] mb-5 max-w-sm">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="btn-primary px-5 py-2.5 rounded-xl text-xs font-semibold"
      >
        Retry Synchronization
      </button>
    )}
  </div>
);

export default Skeleton;
