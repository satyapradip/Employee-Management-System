import { useToastContext } from "./ToastProvider";

export function useToast() {
  const { showToast } = useToastContext();

  return {
    success: (msg, duration) => showToast(msg, "success", duration),
    error: (msg, duration) => showToast(msg, "error", duration),
    warning: (msg, duration) => showToast(msg, "warning", duration),
    info: (msg, duration) => showToast(msg, "info", duration),
  };
}
