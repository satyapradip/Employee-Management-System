import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error){
    // Update state so the next render shows the fallback UI
    return { hasError: true, error: error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    // If an error is caught, display fallback UI
    return this.state.hasError ? (
      <div className="min-h-screen bg-red-100 flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-red-700 mb-4">Something went wrong.</h1>
        <pre className="bg-white p-4 rounded shadow overflow-x-auto text-sm text-red-600">
          {this.state.error && this.state.error.toString()}
        </pre>
      </div>
    ) : (
      // Otherwise, render children components
      this.props.children
    );
  }
}

export default ErrorBoundary;