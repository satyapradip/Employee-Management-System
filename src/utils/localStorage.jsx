const employees = [
  {
    id: 1,
    email: "employee1@company.com",
    password: "123",
    name: "John Doe",
    tasks: [
      {
        title: "Build Login UI",
        description: "Create responsive login page using React",
        date: "2026-01-20",
        category: "Frontend",
        active: true,
        newTask: true,
        completed: false,
        failed: false,
      },
      {
        title: "Fix Navbar Bug",
        description: "Resolve alignment issue in navbar",
        date: "2026-01-15",
        category: "Bug Fix",
        active: false,
        newTask: false,
        completed: true,
        failed: false,
      },
    ],
  },
  {
    id: 2,
    email: "employee2@company.com",
    password: "123",
    name: "Jane Smith",
    tasks: [
      {
        title: "API Integration",
        description: "Integrate user authentication API",
        date: "2026-01-22",
        category: "Backend",
        active: true,
        newTask: false,
        completed: false,
        failed: false,
      },
    ],
  },
  {
    id: 3,
    email: "employee3@company.com",
    password: "123",
    name: "Mike Johnson",
    tasks: [
      {
        title: "Database Design",
        description: "Design schema for task management system",
        date: "2026-01-18",
        category: "Database",
        active: false,
        newTask: false,
        completed: false,
        failed: true,
      },
    ],
  },
  {
    id: 4,
    email: "employee4@company.com",
    password: "123",
    name: "Sarah Wilson",
    tasks: [
      {
        title: "Write Unit Tests",
        description: "Write Jest tests for task reducer",
        date: "2026-01-23",
        category: "Testing",
        active: true,
        newTask: true,
        completed: false,
        failed: false,
      },
    ],
  },
  {
    id: 5,
    email: "employee5@company.com",
    password: "123",
    name: "Tom Brown",
    tasks: [
      {
        title: "Deploy App",
        description: "Deploy application to Vercel",
        date: "2026-01-25",
        category: "DevOps",
        active: false,
        newTask: false,
        completed: true,
        failed: false,
      },
    ],
  },
];

const admin = [
  {
    id: 101,
    email: "admin@company.com",
    password: "123",
    name: "Admin User",
    role: "admin",
  },
];

// ============================================
// INITIALIZE LOCAL STORAGE
// ============================================
export const setLocalStorage = () => {
  // Only set if not already present (preserve existing data)
  if (!localStorage.getItem("employees")) {
    localStorage.setItem("employees", JSON.stringify(employees));
  }
  if (!localStorage.getItem("admin")) {
    localStorage.setItem("admin", JSON.stringify(admin));
  }
};

// ============================================
// GET DATA FROM LOCAL STORAGE
// ============================================
export const getLocalStorage = () => {
  const employees = JSON.parse(localStorage.getItem("employees")) || [];
  const admin = JSON.parse(localStorage.getItem("admin")) || [];
  return { employees, admin };
};

// ============================================
// USER SESSION MANAGEMENT
// ============================================

/**
 * Save logged-in user to localStorage
 * @param {Object} userData - User data to store
 * @param {string} role - 'admin' or 'employee'
 */
export const saveLoggedInUser = (userData, role) => {
  const sessionData = {
    ...userData,
    role,
    loginTime: new Date().toISOString(),
  };
  localStorage.setItem("loggedInUser", JSON.stringify(sessionData));
};

/**
 * Get currently logged-in user from localStorage
 * @returns {Object|null} - User data or null if not logged in
 */
export const getLoggedInUser = () => {
  const user = localStorage.getItem("loggedInUser");
  return user ? JSON.parse(user) : null;
};

/**
 * Remove logged-in user from localStorage (logout)
 */
export const removeLoggedInUser = () => {
  localStorage.removeItem("loggedInUser");
};

/**
 * Check if user is currently logged in
 * @returns {boolean}
 */
export const isUserLoggedIn = () => {
  return localStorage.getItem("loggedInUser") !== null;
};

// ============================================
// AUTHENTICATION HELPERS
// ============================================

/**
 * Authenticate user by email and password
 * @param {string} email
 * @param {string} password
 * @returns {Object} - { success, user, role, message }
 */
export const authenticateUser = (email, password) => {
  const { employees, admin } = getLocalStorage();

  // Check admin first
  const adminUser = admin.find(
    (a) => a.email === email && a.password === password,
  );

  if (adminUser) {
    return {
      success: true,
      user: { ...adminUser, role: "admin" },
      role: "admin",
      message: "Admin login successful",
    };
  }

  // Check employees
  const employee = employees.find(
    (emp) => emp.email === email && emp.password === password,
  );

  if (employee) {
    return {
      success: true,
      user: { ...employee, role: "employee" },
      role: "employee",
      message: "Employee login successful",
    };
  }

  return {
    success: false,
    user: null,
    role: null,
    message: "Invalid email or password",
  };
};

// ============================================
// EMPLOYEE DATA MANAGEMENT
// ============================================

/**
 * Update employee data in localStorage
 * @param {number} employeeId
 * @param {Object} updates
 */
export const updateEmployee = (employeeId, updates) => {
  const { employees } = getLocalStorage();
  const updatedEmployees = employees.map((emp) =>
    emp.id === employeeId ? { ...emp, ...updates } : emp,
  );
  localStorage.setItem("employees", JSON.stringify(updatedEmployees));
};

/**
 * Get employee by ID
 * @param {number} employeeId
 * @returns {Object|null}
 */
export const getEmployeeById = (employeeId) => {
  const { employees } = getLocalStorage();
  return employees.find((emp) => emp.id === employeeId) || null;
};

/**
 * Update employee tasks
 * @param {number} employeeId
 * @param {Array} tasks
 */
export const updateEmployeeTasks = (employeeId, tasks) => {
  updateEmployee(employeeId, { tasks });
};
