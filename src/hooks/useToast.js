import { useToastContext } from "../context/ToastProvider.jsx";

export default function useToast() {
  const { showToast } = useToastContext();
  return showToast;
}
