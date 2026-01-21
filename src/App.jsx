import React, { useEffect, useState } from "react";
import Login from "./components/Auth/Login.jsx";
import AdminDashboard from "./components/Admin";
import EmployeeDashboard from "./components/Dashboard/EmployeeDashboard.jsx";
import api from "./services/api.js";

const App = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ============================================
  // CHECK FOR EXISTING SESSION ON APP LOAD
  // ============================================
  useEffect(() => {
    const checkAuth = async () => {
      const savedUser = localStorage.getItem("loggedInUser");
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          // Verify token is still valid by calling /me
          const response = await api.auth.getMe();
          setUser({ ...response.data.user, token: parsed.token });
          setUserRole(response.data.user.role);
        } catch (err) {
          // Token invalid, clear storage
          localStorage.removeItem("loggedInUser");
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  // ============================================
  // HANDLE LOGIN
  // ============================================
  const handleLogin = async (email, password) => {
    setError(null);
    try {
      const response = await api.auth.login(email, password);

      if (response.success) {
        const userData = {
          ...response.data.user,
          token: response.data.token,
        };

        // Save to state
        setUser(userData);
        setUserRole(response.data.user.role);

        // Save to localStorage for persistence
        localStorage.setItem("loggedInUser", JSON.stringify(userData));
      }
    } catch (err) {
      setError(err.message || "Login failed");
      alert(err.message || "Invalid email or password");
    }
  };

  // ============================================
  // HANDLE LOGOUT
  // ============================================
  const handleLogout = () => {
    // Clear state
    setUser(null);
    setUserRole(null);
    setError(null);
    // Clear localStorage session
    localStorage.removeItem("loggedInUser");
  };

  // Show loading state while checking session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-white text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* If NOT logged in → Show Login */}
      {!user && <Login handleLogin={handleLogin} error={error} />}

      {/* If logged in as ADMIN → Show Admin Dashboard */}
      {user && userRole === "admin" && (
        <AdminDashboard user={user} onLogout={handleLogout} />
      )}

      {/* If logged in as EMPLOYEE → Show Employee Dashboard */}
      {user && userRole === "employee" && (
        <EmployeeDashboard data={user} onLogout={handleLogout} />
      )}
    </>
  );
};

export default App;
