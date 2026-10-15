# ⚡ TeamFlow Quick Reference Card

> **Keep This Open While Developing**  
> Complete cheatsheet for architecture, folder structure, API endpoints, user flows, and code patterns.

---

## 🗂️ Project Structure (What Lives Where)

```
Frontend (src/):
├── components/
│   ├── AI/                 → FlowAI Copilot (AIAssistant.jsx with Gemini 3.6 Flash)
│   ├── Admin/              → Admin Command Center
│   │   ├── components/     → TasksTab, CreateTaskTab, EmployeesTab, AnalyticsTab, etc.
│   │   ├── hooks/          → useTaskManager, useEmployees, useAnalytics
│   │   └── utils/          → iconHelpers, taskHelpers
│   ├── Auth/               → Login, Signup, ForgotPassword, ResetPassword
│   ├── Dashboard/          → EmployeeDashboard (Next Best Action, Greeting banner)
│   ├── TaskList/           → TaskList (1-click Accept, Complete, Blocker modal)
│   ├── ErrorBoundary/      → RouteErrorBoundary
│   └── others/             → Header, TaskListNumber
├── pages/                  → LandingPage (Sprint Simulator), CompanyRegistration
├── context/                → AuthProvider, ToastProvider
├── hooks/                  → useAuth, useToast
├── services/               → api.js (Centralized fetch client for Vite proxy)
├── constants/              → taskConstants
└── utils/                  → logger, validation

Backend (server/):
├── src/
│   ├── config/             → db.js (MongoDB connection), env.js (schema validation)
│   ├── controllers/        → authController, taskController, employeeController
│   ├── middleware/         → auth (JWT verify), validate, errorHandler
│   ├── models/             → User.js, Task.js (Mongoose multi-tenant schemas)
│   ├── routes/             → authRoutes, taskRoutes, employeeRoutes, index.js
│   ├── seeders/            → seedData.js (Acme Corp seed generator)
│   ├── services/           → taskNotificationService.js
│   ├── utils/              → ApiError, ApiResponse, asyncHandler, sendEmail
│   └── validators/         → authValidator, taskValidator, employeeValidator
├── tests/                  → auth.test.js, setup.js, README.md
├── scripts/                → verify-db.js
└── server.js               → Application entrypoint
```

---

## 🔑 Demo Credentials (Acme Corp Workspace)

| Role | Email | Password | Scope |
| :--- | :--- | :--- | :--- |
| 👑 **Admin** | `admin@company.com` | `admin123` | Full Command Center (`/admin`) |
| 👤 **Employee** | `john@company.com` | `123456` | Frontend & API tasks (`/employee`) |
| 👤 **Employee** | `jane@company.com` | `123456` | Database & Schema tasks (`/employee`) |
| 👤 **Employee** | `mike@company.com` | `123456` | Security & DevOps tasks (`/employee`) |

---

## 🌐 Client Routes & API Endpoints

### Frontend Client Routes
- `/` ➔ Landing Page with Interactive Sprint Simulator (`#simulator`)
- `/register-company` ➔ Split-card Company Workspace Provisioning
- `/login` ➔ SaaS Login Card with 1-click Demo Fillers
- `/signup` ➔ Employee Account Creation
- `/forgot-password` ➔ Password Reset Token Dispatch
- `/reset-password` ➔ Secure Password Reset Form (`?token=...`)
- `/admin` ➔ Admin Command Center (Protected: role `admin`)
- `/employee` ➔ Employee Workspace (Protected: role `employee`)

### Backend REST API Endpoints
| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register-admin` | Register company workspace & root admin | No |
| `POST` | `/api/auth/register` | Register employee into workspace | No |
| `POST` | `/api/auth/login` | Login and obtain JWT session token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile & tenant | Yes |
| `GET` | `/api/auth/logout` | Clear session and cookies | No |
| `POST` | `/api/auth/forgot-password`| Send 10-minute reset token via email | No |
| `PUT` | `/api/auth/reset-password` | Set new password with reset token | No |
| `GET` | `/api/tasks` | Get tasks (Admin: all company; Employee: self) | Yes |
| `POST` | `/api/tasks` | Create deliverable (Admin only) | Yes (`admin`) |
| `GET` | `/api/tasks/stats` | Sprint deliverable statistics | Yes |
| `PATCH`| `/api/tasks/:id/accept` | Accept deliverable (`new` ➔ `active`) | Yes |
| `PATCH`| `/api/tasks/:id/complete`| Mark complete (`active` ➔ `completed`) | Yes |
| `PATCH`| `/api/tasks/:id/fail` | Report blocker (`active` ➔ `failed`) | Yes |
| `DELETE`| `/api/tasks/:id` | Delete deliverable (Admin only) | Yes (`admin`) |
| `GET` | `/api/employees` | List company employees and workload metrics | Yes (`admin`) |
| `POST` | `/api/employees` | Provision new employee into company | Yes (`admin`) |
| `POST` | `/api/employees/:id/reset-password` | Admin reset employee password | Yes (`admin`) |
| `DELETE`| `/api/employees/:id` | Remove employee from workspace | Yes (`admin`) |
| `GET` | `/api/health` | Health check and uptime probe | No |

---

## 🔄 Core Architectural Data Flows

### 1. Multi-Tenant Task Scoping
```
Admin requests /api/tasks:
1. auth.js verifies JWT and attaches req.user
2. taskController finds all employee IDs with companyName: req.user.companyName
3. Task.find({ assignedTo: { $in: employeeIds } })
4. Returns strictly isolated company deliverables
```

### 2. FlowAI Copilot Injection
```
1. AIAssistant.jsx captures user requirement + role/route context
2. Calls Google Gemini 3.6 Flash API
3. Emits JSON { task_draft: { title, category, priority, description } }
4. Admin clicks "⚡ Insert into Composer"
5. Dispatches custom event flowai:insert_task
6. CreateTaskTab.jsx populates form fields automatically
```

### 3. Employee "Next Best Action"
```
1. EmployeeDashboard fetches assigned tasks
2. Evaluates queue condition:
   - Unaccepted tasks present ➔ Highlights #1 priority task with 1-Click "Accept"
   - Active tasks in-flight ➔ Focuses view with execution timer & complete/blocker buttons
   - All tasks completed ➔ Displays celebration banner
```

---

## 🛠️ Essential Terminal Commands

```bash
# Start Frontend Development Server (Port 5173)
npm run dev

# Start Backend Development Server (Port 5000)
cd server
npm run dev

# Seed Demo Data (Acme Corp with 20 deliverables)
cd server
npm run seed

# Run Backend Automated Tests
cd server
npm test

# Run Tests in Watch Mode
cd server
npm run test:watch

# Run Test Coverage Report
cd server
npm run test:coverage

# Pre-Deployment Validation Check
npm run deploy:check
```

---

## 📝 Common Code Patterns

### Backend API Error & Response
```javascript
// Success
return ApiResponse.success({ data: result }, "Deliverable created").send(res);

// Expected Error
throw ApiError.badRequest("Invalid input payload");
throw ApiError.notFound("Deliverable not found");
throw ApiError.unauthorized("Access denied");
```

### Frontend API Invocation
```javascript
try {
  const res = await api.tasks.getAll();
  if (res?.success) {
    setTasks(res.data?.tasks || []);
  }
} catch (error) {
  showToast(error.message || "Failed to load tasks", "error");
}
```

---

**TeamFlow Workforce Operating System** • Quick Reference Card
