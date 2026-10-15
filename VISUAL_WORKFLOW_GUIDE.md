# 📊 TeamFlow Visual Workflow & Architecture Guide

> **Visual Reference System** for Engineers, Architects, and Product Teams  
> **Platform Version:** 2.4 (FlowAI Copilot, Interactive Sprint Simulator, Multi-Tenant SaaS)

---

## 📋 Table of Contents

- [1. End-to-End Application Navigation Flow](#1-end-to-end-application-navigation-flow)
- [2. Interactive Sprint Simulator Architecture (`#simulator`)](#2-interactive-sprint-simulator-architecture-simulator)
- [3. Multi-Tenant Workspace Registration & Auth Flow](#3-multi-tenant-workspace-registration--auth-flow)
- [4. FlowAI Workspace Copilot Lifecycle](#4-flowai-workspace-copilot-lifecycle)
- [5. Admin Command Center Architecture (4 Panels)](#5-admin-command-center-architecture-4-panels)
- [6. Employee "Next Best Action" Decision Engine](#6-employee-next-best-action-decision-engine)
- [7. Complete Deliverable Lifecycle & Blocker Triage](#7-complete-deliverable-lifecycle--blocker-triage)
- [8. Multi-Tenant Data Isolation & Query Filtering](#8-multi-tenant-data-isolation--query-filtering)
- [9. Client Route Guard State Machine](#9-client-route-guard-state-machine)
- [10. Cryptographic Password Recovery Flow](#10-cryptographic-password-recovery-flow)
- [11. Database Schema Specification](#11-database-schema-specification)

---

## 1. End-to-End Application Navigation Flow

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 VISITOR / USER JOURNEY                                 │
└────────────────────────────────────────────────────────────────────────────────────────┘

                               START: http://localhost:5173
                                            │
                                            ▼
                     ┌──────────────────────────────────────────────┐
                     │          Modern Light SaaS Landing Page      │
                     │  - Orbital Geometric Arc & Geist Typography  │
                     │  - Interactive Sprint Simulator (#simulator) │
                     │  - 4-Step Interactive Stepper & FAQ Accordion│
                     └──────────────────────┬───────────────────────┘
                                            │
                  ┌─────────────────────────┼─────────────────────────┐
                  ▼                         ▼                         ▼
         ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
         │  "Get Started"  │       │     "Login"     │       │ "Try Simulator" │
         └────────┬────────┘       └────────┬────────┘       └────────┬────────┘
                  │                         │                         │
                  ▼                         ▼                         ▼
         ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
         │/register-company│       │     /login      │       │ Scrolls into    │
         │Split SaaS Card  │       │Preset 1-Click   │       │ #simulator      │
         │Admin + Org setup│       │Role Credentials │       │ sandbox hero    │
         └────────┬────────┘       └────────┬────────┘       └─────────────────┘
                  │                         │
                  │ Auto-Login              │ Authenticates
                  └────────────┬────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Evaluate User Role  │
                    │   & Session State   │
                    └──────────┬──────────┘
                               │
                ┌──────────────┴──────────────┐
                ▼                             ▼
     ┌──────────────────────┐      ┌──────────────────────┐
     │     Role: "admin"    │      │   Role: "employee"   │
     │      Navigate to:    │      │      Navigate to:    │
     │        /admin        │      │       /employee      │
     ├──────────────────────┤      ├──────────────────────┤
     │ Admin Command Center │      │  Employee Workspace  │
     │ - Navy Dark Sidebar  │      │ - Dynamic Banner     │
     │ - Tasks Board        │      │ - Personal KPIs      │
     │ - Create Deliverable │      │ - Next Best Action   │
     │ - Employees Roster   │      │ - TaskList Queue     │
     │ - Recharts Analytics │      │ - Blocker Modal      │
     └──────────────────────┘      └──────────────────────┘
                ▲                             ▲
                └──────────────┬──────────────┘
                               │
                               ▼
               ┌──────────────────────────────┐
               │  Global Floating AI Copilot  │
               │   (<AIAssistant /> Modal)    │
               │ - Google Gemini 3.6 Flash    │
               │ - Task Draft JSON Generator  │
               │ - 1-Click Form Injection     │
               └──────────────────────────────┘
```

---

## 2. Interactive Sprint Simulator Architecture (`#simulator`)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                  LANDING PAGE INTERACTIVE SPRINT SIMULATOR ARCHITECTURE                │
└────────────────────────────────────────────────────────────────────────────────────────┘

 Visitor scrolls to #simulator (Zero login required)
                       │
                       ▼
 ┌─────────────────────────────────────────────────────────────┐
 │ Sprint Simulator State Machine (LandingPage.jsx React State)│
 │                                                             │
 │ Initial State:                                              │
 │ - Tasks: [                                                  │
 │     { id: 1, title: "Auth Pipeline", status: "active" },    │
 │     { id: 2, title: "Schema Migrations", status: "new" },   │
 │     { id: 3, title: "Sprint Analytics", status: "active" }  │
 │   ]                                                         │
 │ - Live Velocity Calculation:                                │
 │     Burn-Down % = (Completed Tasks / Total Tasks) * 100     │
 └──────────────────────────────┬──────────────────────────────┘
                                │
                 Visitor clicks on a Task Card
                                │
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │ State Transition:                                           │
 │ active  ──────────────> completed                           │
 │ new     ──────────────> active                              │
 └──────────────────────────────┬──────────────────────────────┘
                                │
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │ Real-Time UI Reactivity:                                    │
 │ 1. Task Card changes color (Indigo ➔ Emerald checkmark)     │
 │ 2. Progress Bar animates with physics easing (Framer Motion)│
 │ 3. Sprint Burn-Down percentage increases dynamically        │
 │ 4. Milestone badge unlocked ("Velocity Target Reached")     │
 └─────────────────────────────────────────────────────────────┘
```

---

## 3. Multi-Tenant Workspace Registration & Auth Flow

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        ORGANIZATION REGISTRATION & AUTO-LOGIN                          │
└────────────────────────────────────────────────────────────────────────────────────────┘

 USER                                   FRONTEND (React)                 BACKEND (Express)
   │                                           │                                │
   │ 1. Fills Company Registration             │                                │
   │    - companyName: "Acme Corp"             │                                │
   │    - name: "Admin User"                   │                                │
   │    - email: "admin@company.com"           │                                │
   │    - password: "admin123"                 │                                │
   │                                           │                                │
   │ 2. Clicks "Create Workspace"              │                                │
   │──────────────────────────────────────────>│                                │
   │                                           │ 3. Client Validation           │
   │                                           │    (Name, Email regex, min 6)  │
   │                                           │                                │
   │                                           │ 4. POST /api/auth/register-admin
   │                                           │───────────────────────────────>│
   │                                           │                                │ 5. express-validator
   │                                           │                                │    sanitize inputs
   │                                           │                                │
   │                                           │                                │ 6. Check email uniqueness
   │                                           │                                │    User.findOne({ email })
   │                                           │                                │
   │                                           │                                │ 7. Hash password
   │                                           │                                │    bcrypt.hash(pwd, 10)
   │                                           │                                │
   │                                           │                                │ 8. Save root Admin
   │                                           │                                │    User.create({
   │                                           │                                │      name, email,
   │                                           │                                │      companyName,
   │                                           │                                │      role: "admin"
   │                                           │                                │    })
   │                                           │                                │
   │                                           │                                │ 9. Sign JWT
   │                                           │                                │    jwt.sign({ id }, 7d)
   │                                           │                                │
   │                                           │ 10. 201 Created + Token & User │
   │                                           │<───────────────────────────────│
   │                                           │                                │
   │                                           │ 11. AuthProvider stores session│
   │                                           │     localStorage.setItem(...)  │
   │                                           │                                │
   │ 12. Redirected to /admin Command Center   │                                │
   │<──────────────────────────────────────────│                                │
```

---

## 4. FlowAI Workspace Copilot Lifecycle

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                         FLOWAI WORKSPACE COPILOT DATA FLOW                             │
└────────────────────────────────────────────────────────────────────────────────────────┘

  [User clicks floating FlowAI badge]
                 │
                 ▼
 ┌──────────────────────────────────────────────────────────────┐
 │ AIAssistant.jsx Mounts / Expands                             │
 │ Gathers Active Workspace Context:                            │
 │ - User Role: req.user.role ("admin" | "employee")            │
 │ - Company Workspace: req.user.companyName                    │
 │ - Active Route: window.location.pathname (/admin, /employee) │
 └──────────────────────────────┬───────────────────────────────┘
                                │
       User enters prompt (or clicks Quick Prompt pill)
       e.g., "Draft a deliverable for database schema migration"
                                │
                                ▼
 ┌──────────────────────────────────────────────────────────────┐
 │ Prompt Augmentation & System Persona:                        │
 │ "You are FlowAI, Lead Solutions Architect. Context: Admin on │
 │ /admin for Acme Corp. If drafting a task, emit JSON wrapped  │
 │ in ```json { task_draft: { title, category, priority, ... }} │
 └──────────────────────────────┬───────────────────────────────┘
                                │
                                ▼
 ┌──────────────────────────────────────────────────────────────┐
 │ Google Gemini 3.6 Flash API                                  │
 │ Generates structured engineering specification & criteria    │
 └──────────────────────────────┬───────────────────────────────┘
                                │
                                ▼
 ┌──────────────────────────────────────────────────────────────┐
 │ FlowAI UI Response Card                                      │
 │ - Render Markdown response with syntax highlighting          │
 │ - Detects embedded `task_draft` object                       │
 │ - Renders prominent "⚡ Insert into Task Composer" button   │
 └──────────────────────────────┬───────────────────────────────┘
                                │
                Admin clicks "Insert into Task Composer"
                                │
                                ▼
 ┌──────────────────────────────────────────────────────────────┐
 │ Custom Event: `flowai:insert_task` Dispatched                │
 │ - CreateTaskTab.jsx receives payload                         │
 │ - Auto-populates Title, Category, Priority, and Description  │
 │ - Switches active tab to "Create Task" Composer              │
 │ - Displays green confirmation toast notification             │
 └──────────────────────────────────────────────────────────────┘
```

---

## 5. Admin Command Center Architecture (4 Panels)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        ADMIN COMMAND CENTER COMPONENT HIERARCHY                        │
└────────────────────────────────────────────────────────────────────────────────────────┘

                                AdminDashboard.jsx
                                        │
           ┌────────────────────────────┴────────────────────────────┐
           ▼                                                         ▼
    Sidebar.jsx (#101827 Dark Navy)                          Main Content Layout
    - Workspace Branding & Badge                             - Header.jsx (Greeting, Logout)
    - Active Tab Indicator                                   - StatsCard.jsx (Sprint KPIs)
    - Tab Switcher Buttons                                   - Tab Panel Container
           │                                                         │
           └────────────────────────────┬────────────────────────────┘
                                        │
                 ┌──────────────────────┼──────────────────────┐
                 ▼                      ▼                      ▼
          [Tasks Board]          [Create Deliverable]    [Employees Roster]
          TasksTab.jsx           CreateTaskTab.jsx       EmployeesTab.jsx
          - SearchBar.jsx        - FormInput.jsx         - Add Employee Modal
          - FilterPills.jsx      - CategorySelector.jsx  - Password Reset Modal
          - TaskCard.jsx         - Priority Pills        - Workload Metrics
          - DeleteConfirmModal   - Assignee Dropdown     - Member Removal Guard
                                 - FlowAI Auto-Inject           │
                                                                ▼
                                                        [Analytics Suite]
                                                        AnalyticsTab.jsx (Recharts)
                                                        - Status Distribution (Donut)
                                                        - Category Breakdown (Bar)
                                                        - Member Velocity Graph
```

---

## 6. Employee "Next Best Action" Decision Engine

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                       EMPLOYEE "NEXT BEST ACTION" DECISION TREE                        │
└────────────────────────────────────────────────────────────────────────────────────────┘

                     Employee loads /employee workspace
                                     │
                                     ▼
                     Query Employee's Assigned Deliverables
                             GET /api/tasks
                                     │
                                     ▼
               ┌───────────────────────────────────────────┐
               │ Evaluate Status Counts:                   │
               │ newCount, activeCount, completedCount     │
               └─────────────────────┬─────────────────────┘
                                     │
        ┌────────────────────────────┼────────────────────────────┐
        ▼                            ▼                            ▼
  [ newCount > 0 ]           [ activeCount > 0 ]           [ Both == 0 ]
        │                            │                            │
        ▼                            ▼                            ▼
 ┌────────────────────┐       ┌────────────────────┐       ┌────────────────────┐
 │ PRIORITY ACTION:   │       │ IN-FLIGHT ACTION:  │       │ CELEBRATION:       │
 │ Accept First Task  │       │ Focus on Execution │       │ Sprint Complete!   │
 ├────────────────────┤       ├────────────────────┤       ├────────────────────┤
 │ Shows prominent    │       │ Displays active    │       │ Confetti banner    │
 │ card highlighting  │       │ deliverable with   │       │ "All deliverables  │
 │ highest-priority   │       │ execution timer &  │       │ successfully       │
 │ unaccepted task    │       │ 1-click "Complete" │       │ resolved for this  │
 │ with 1-click       │       │ and "Blocker"      │       │ sprint cycle."     │
 │ "Accept Deliverable"│      │ triage buttons     │       └────────────────────┘
 └────────────────────┘       └────────────────────┘
```

---

## 7. Complete Deliverable Lifecycle & Blocker Triage

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              DELIVERABLE STATUS LIFECYCLE                              │
└────────────────────────────────────────────────────────────────────────────────────────┘

                 Admin Creates Task
               POST /api/tasks (Status: "new")
                          │
                          ▼
            ┌───────────────────────────┐
            │       Status: "new"       │
            │ Blue Badge • Unaccepted   │
            └─────────────┬─────────────┘
                          │
            Employee clicks "Accept Task"
            PATCH /api/tasks/:id/accept
                          │
                          ▼
            ┌───────────────────────────┐
            │      Status: "active"     │
            │ Amber Badge • In-Progress │
            └─────────────┬─────────────┘
                          │
            ┌─────────────┴────────────────────────┐
            ▼                                      ▼
 Work Successfully Finished             Blocker Encountered / Stuck
 Click "Mark Complete"                  Click "Report Blocker / Mark Failed"
 PATCH /api/tasks/:id/complete                     │
            │                                      ▼
            │                         ┌─────────────────────────────┐
            │                         │ Blocker Modal Opens         │
            │                         │ - Employee enters root-cause│
            │                         │   failureReason (required)  │
            │                         │ - PATCH /api/tasks/:id/fail │
            │                         └────────────┬────────────────┘
            │                                      │
            ▼                                      ▼
┌───────────────────────────┐        ┌──────────────────────────────┐
│    Status: "completed"    │        │       Status: "failed"       │
│ Green Badge • Logged Time │        │ Red Badge • Reason Displayed │
└───────────────────────────┘        └──────────────────────────────┘
```

---

## 8. Multi-Tenant Data Isolation & Query Filtering

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                         MULTI-TENANT QUERY ENFORCEMENT                                 │
└────────────────────────────────────────────────────────────────────────────────────────┘

                       Incoming HTTP Request with JWT
                                     │
                                     ▼
                       auth.js Middleware Verification
                        jwt.verify(token, JWT_SECRET)
                                     │
                                     ▼
                       Attaches req.user from Database:
                       req.user = {
                         _id: ObjectId("65c1..."),
                         name: "Admin User",
                         companyName: "Acme Corp",  <── TENANT ANCHOR
                         role: "admin"
                       }
                                     │
                                     ▼
 ┌──────────────────────────────────────────────────────────────────────────┐
 │                       CONTROLLER QUERY SCOPING                           │
 ├─────────────────────────────────────────┬────────────────────────────────┤
 │ Admin Task Listing (taskController.js): │ Employee Task Listing:         │
 │                                         │                                │
 │ // 1. Find all company employees        │ query = {                      │
 │ const employeeIds = await User.find({   │   assignedTo: req.user._id     │
 │   companyName: req.user.companyName,    │ };                             │
 │   role: "employee"                      │                                │
 │ }).distinct("_id");                     │                                │
 │                                         │                                │
 │ // 2. Restrict tasks to those employees │                                │
 │ query.assignedTo = { $in: employeeIds };│                                │
 └─────────────────────────────────────────┴────────────────────────────────┘
                                     │
                                     ▼
                       MongoDB Atlas Database Engine
             Cross-tenant queries return ZERO records by design
```

---

## 9. Client Route Guard State Machine

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        REACT ROUTER 7 ROUTE GUARD MACHINE                              │
└────────────────────────────────────────────────────────────────────────────────────────┘

 User requests route URL (e.g., /admin, /employee, /login, /)
                         │
                         ▼
             Is Auth Context Loading?
            (Validating stored token)
                    │         │
                 YES│         │NO
                    ▼         ▼
          [Spinner Screen]   Is user authenticated?
                             (Token valid & user object present)
                                  │          │
                               YES│          │NO
                                  ▼          ▼
 ┌───────────────────────────────────┐     ┌───────────────────────────────────┐
 │ ProtectedRoute Checks:            │     │ AuthRoute Checks:                 │
 │ Does user.role match requiredRole?│     │ (e.g. /login, /signup, /register) │
 │                                   │     │                                   │
 │ - If matches: Renders component   │     │ - If already authenticated:       │
 │ - If admin on /employee:          │     │   Redirects to role dashboard     │
 │   Redirects to /admin             │     │   (admin ➔ /admin)                │
 │ - If employee on /admin:          │     │   (employee ➔ /employee)          │
 │   Redirects to /employee          │     │ - If unauthenticated:             │
 │                                   │     │   Renders Auth Form               │
 └───────────────────────────────────┘     └───────────────────────────────────┘
```

---

## 10. Cryptographic Password Recovery Flow

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                       CRYPTOGRAPHIC PASSWORD RECOVERY FLOW                             │
└────────────────────────────────────────────────────────────────────────────────────────┘

 USER                                   FRONTEND                         BACKEND / SMTP
  │                                        │                                   │
  │ 1. Submits email on /forgot-password   │                                   │
  │───────────────────────────────────────>│                                   │
  │                                        │ 2. POST /api/auth/forgot-password │
  │                                        │──────────────────────────────────>│
  │                                        │                                   │ 3. User.findOne({ email })
  │                                        │                                   │
  │                                        │                                   │ 4. crypto.randomBytes(20)
  │                                        │                                   │    Hash with sha256
  │                                        │                                   │    Set 10-minute expiry
  │                                        │                                   │
  │                                        │                                   │ 5. Nodemailer dispatches
  │                                        │                                   │    HTML email with link:
  │                                        │                                   │    /reset-password?token=XYZ
  │                                        │                                   │
  │                                        │ 6. 200 "Email Sent" response      │
  │                                        │<──────────────────────────────────│
  │ 7. Opens email & clicks reset link     │
  │───────────────────────────────────────>│
  │                                        │
  │ 8. Enters new password on              │
  │    /reset-password?token=XYZ           │
  │───────────────────────────────────────>│
  │                                        │ 9. PUT /api/auth/reset-password
  │                                        │    with token & new password
  │                                        │──────────────────────────────────>│
  │                                        │                                   │ 10. Verify sha256 token
  │                                        │                                   │     & check expiry > now
  │                                        │                                   │
  │                                        │                                   │ 11. bcrypt.hash(newPass)
  │                                        │                                   │     Clear reset fields
  │                                        │                                   │     Issue new JWT
  │                                        │                                   │
  │                                        │ 12. 200 OK + New Token & User     │
  │                                        │<──────────────────────────────────│
  │ 13. Auto-logged in & redirects to      │
  │     appropriate role dashboard         │
  │<───────────────────────────────────────│
```

---

## 11. Database Schema Specification

### Users Collection (`User.js`)
```javascript
{
  _id: ObjectId("..."),
  name: "John Doe",                  // String, required, trim, max 50
  email: "john@company.com",          // String, required, unique, lowercase, trim
  password: "...",                   // String, bcrypt hash (10 rounds), select: false
  companyName: "Acme Corp",          // String, required, trim (TENANT ANCHOR)
  role: "employee",                  // String, enum: ["admin", "employee"], default: "employee"
  isActive: true,                    // Boolean, default: true
  lastLogin: ISODate("..."),         // Date
  resetPasswordToken: "...",         // String, sha256 hash, select: false
  resetPasswordExpire: ISODate("..."),// Date, select: false
  createdAt: ISODate("..."),         // Date (timestamps: true)
  updatedAt: ISODate("...")          // Date (timestamps: true)
}
```

### Tasks Collection (`Task.js`)
```javascript
{
  _id: ObjectId("..."),
  title: "Migrate Auth to JWT",      // String, required, trim, max 100
  description: "...",                // String, required, max 500
  category: "Backend",               // String, enum: ["Frontend", "Backend", "Database",
                                     //   "DevOps", "Security", "Design", "Testing",
                                     //   "Bug Fix", "Feature", "Documentation", "Other"]
  status: "active",                  // String, enum: ["new", "active", "completed", "failed"]
  priority: "high",                  // String, enum: ["low", "medium", "high", "urgent"]
  assignedTo: ObjectId("..."),       // Ref: "User", required
  assignedBy: ObjectId("..."),       // Ref: "User", required
  dueDate: ISODate("..."),           // Date, required
  completedAt: ISODate("..."),       // Date (set upon completion)
  failedAt: ISODate("..."),          // Date (set upon blocker reporting)
  failureReason: "...",              // String, max 200 (mandatory if status == "failed")
  notes: "...",                      // String, max 500
  createdAt: ISODate("..."),         // Date
  updatedAt: ISODate("...")          // Date
}
```

---

**TeamFlow Workforce Operating System** • System Architecture Documentation
