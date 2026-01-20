import React, { useEffect, useState } from "react";
import Login from "./components/Auth/Login.jsx";
import AdminDashboard from "./components/Admin";
import EmployeeDashboard from "./components/Dashboard/EmployeeDashboard.jsx";
import {
  setLocalStorage,
  authenticateUser,
  saveLoggedInUser,
  getLoggedInUser,
  removeLoggedInUser,
} from "./utils/localStorage.jsx";

const App = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ============================================
  // CHECK FOR EXISTING SESSION ON APP LOAD
  // ============================================
  useEffect(() => {
    // Initialize localStorage with sample data
    setLocalStorage();

    // Check if user is already logged in
    const loggedInUser = getLoggedInUser();
    if (loggedInUser) {
      setUser(loggedInUser);
      setUserRole(loggedInUser.role);
    }
    setIsLoading(false);
  }, []);

  // ============================================
  // HANDLE LOGIN
  // ============================================
  const handleLogin = (email, password) => {
    const result = authenticateUser(email, password);

    if (result.success) {
      // Save to state
      setUser(result.user);
      setUserRole(result.role);
      // Save to localStorage for persistence
      saveLoggedInUser(result.user, result.role);
    } else {
      alert(result.message);
    }
  };

  // ============================================
  // HANDLE LOGOUT
  // ============================================
  const handleLogout = () => {
    // Clear state
    setUser(null);
    setUserRole(null);
    // Clear localStorage session
    removeLoggedInUser();
  };

  // Show loading state while checking session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {/* If NOT logged in → Show Login */}
      {!user && <Login handleLogin={handleLogin} />}

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
