import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AuthProvider from "./context/AuthProvider.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { ToastProvider } from "./context/ToastProvider.jsx";
import ToastContainer from "./components/ToastContainer.jsx";

// =====================================================
// CAPTURE URL PARAMS BEFORE REACT MOUNTS
// This prevents params from being lost during React initialization
// =====================================================
const captureResetToken = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const action = urlParams.get("action");

  if (token && action === "reset-password") {
    // Store in sessionStorage so it persists across React re-renders
    sessionStorage.setItem("pendingResetToken", token);
    console.log(
      "🔐 [main.jsx] Captured reset token before React mount:",
      token.substring(0, 20) + "...",
    );

    // Clean URL immediately to prevent issues
    window.history.replaceState({}, document.title, window.location.pathname);
  }
};

// Capture immediately when script loads
captureResetToken();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastProvider>
      <ErrorBoundary>
        <AuthProvider>
          <App />
        </AuthProvider>
        <ToastContainer />
      </ErrorBoundary>
    </ToastProvider>
  </StrictMode>,
);
