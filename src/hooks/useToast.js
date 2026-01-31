import { useToastContext } from "../context/toastContext.js";

export default function useToast() {
  const { showToast } = useToastContext();
  return showToast;
}
