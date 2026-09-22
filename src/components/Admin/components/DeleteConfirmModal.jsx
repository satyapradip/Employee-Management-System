import React from "react";
import { Trash2 } from "lucide-react";

/**
 * Delete Confirmation Modal
 * Clean light modal for confirming destructive actions
 * Following Reference 1 specifications
 */
const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Task",
  message = "Are you sure you want to delete this task? This action cannot be undone.",
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs cursor-pointer"
        onClick={onClose}
        aria-label="Close modal"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Escape" || e.key === "Enter") {
            onClose();
          }
        }}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white border border-[#E1E5E9] rounded-2xl shadow-xl w-full max-w-md mx-4 animate-fadeIn overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#E1E5E9] bg-[#F8FAFC]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FEE2E2] border border-[#FECACA] flex items-center justify-center shrink-0">
              <Trash2 className="h-5 w-5 text-[#B91C1C]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#15191E] font-display">{title}</h3>
              <p className="text-xs text-[#5E6875]">This action is permanent and cannot be undone</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6">
          <p className="text-xs sm:text-sm text-[#5E6875] leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="p-5 sm:p-6 pt-0 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 btn-secondary rounded-xl font-semibold text-xs transition-colors disabled:opacity-50 cursor-pointer"
            aria-label="Cancel deletion"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-2.5 bg-[#B91C1C] hover:bg-[#991B1B] text-white rounded-xl font-semibold text-xs transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
            aria-label={isLoading ? "Deleting..." : "Confirm deletion"}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="h-3.5 w-3.5" />
                <span>Confirm Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
