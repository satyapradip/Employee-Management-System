import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AuthProvider from "./context/AuthProvider.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { ToastProvider } from "./context/ToastProvider.jsx";
import ToastContainer from "./components/ToastContainer.jsx";

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
