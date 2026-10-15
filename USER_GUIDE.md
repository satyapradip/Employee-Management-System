# 🏢 TeamFlow - Workforce Operating System
## Complete User Guide & Application Manual

> **Platform Version:** 2.4 (FlowAI Copilot & Multi-Tenant SaaS Suite)  
> **Target Audience:** Workspace Administrators, Engineering Leads, Team Members & Operators

---

## 📋 Table of Contents

- [1. Platform Overview](#1-platform-overview)
- [2. Quick Start & Demo Credentials](#2-quick-start--demo-credentials)
- [3. Public Pages & Interactive Sprint Simulator](#3-public-pages--interactive-sprint-simulator)
- [4. Multi-Tenant Organization Onboarding](#4-multi-tenant-organization-onboarding)
- [5. Authentication Suite](#5-authentication-suite)
- [6. Admin Command Center (`/admin`)](#6-admin-command-center-admin)
  - [Navy Navigation & Workspace Identity](#navy-navigation--workspace-identity)
  - [Tasks Board Tab](#tasks-board-tab)
  - [Create Deliverable Tab & FlowAI Injection](#create-deliverable-tab--flowai-injection)
  - [Employees Directory Tab](#employees-directory-tab)
  - [Analytics Suite (Recharts Visualizations)](#analytics-suite-recharts-visualizations)
- [7. Employee Workspace (`/employee`)](#7-employee-workspace-employee)
  - [Dynamic Time-Aware Banner & Personal KPIs](#dynamic-time-aware-banner--personal-kpis)
  - [Intelligent "Next Best Action" Engine](#intelligent-next-best-action-engine)
  - [Deliverable Execution & Blocker Triage](#deliverable-execution--blocker-triage)
- [8. FlowAI Workspace Copilot](#8-flowai-workspace-copilot)
- [9. Multi-Tenant Architecture & Data Isolation](#9-multi-tenant-architecture--data-isolation)
- [10. URL Routing & Navigation Reference](#10-url-routing--navigation-reference)
- [11. Troubleshooting & Support](#11-troubleshooting--support)

---

## 1. Platform Overview

**TeamFlow** is an enterprise-grade, multi-tenant workforce operating system engineered for software delivery, sprint velocity tracking, and cross-functional operations. 

### Key Capabilities
- 🏢 **Multi-Tenant Isolation:** Complete organization segregation powered by strict tenant scoping (`companyName`) across all users, deliverables, and analytics.
- 🤖 **FlowAI Workspace Copilot:** Built-in Google Gemini 3.6 Flash assistant that translates natural language requirements into structured deliverable specifications with 1-click form injection.
- ⚡ **Interactive Sprint Simulator:** Zero-registration sandbox on the landing page for prospective teams to test sprint transitions and live burn-down metrics.
- 🎯 **Employee "Next Best Action" Engine:** Smart priority queue that focuses team members on their single highest-impact deliverable with 1-click acceptance and blocker logging.
- 📊 **Executive Analytics Suite:** Interactive Recharts data visualizations for sprint status distribution, functional domain breakdown, and member delivery velocity.
- 🛡️ **Enterprise Security:** Dual-layer rate limiting, Helmet HTTP headers, MongoDB query sanitization, XSS cleaning, and JWT session handling.

---

## 2. Quick Start & Demo Credentials

### Prerequisites
- Backend API running on `http://localhost:5000` (or production Render endpoint)
- Frontend client running on `http://localhost:5173` (or production Vercel endpoint)
- MongoDB instance connected (local or MongoDB Atlas)

### Seed Data Credentials (Acme Corp)
The platform includes an automated seeder (`npm run seed` inside `server/`) pre-configured with the **Acme Corp** workspace:

| Role | Name | Email | Password | Company Workspace | Scope |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 👑 **Admin** | Admin User | `admin@company.com` | `admin123` | Acme Corp | Full Command Center access |
| 👤 **Employee** | John Doe | `john@company.com` | `123456` | Acme Corp | Frontend & API tasks |
| 👤 **Employee** | Jane Smith | `jane@company.com` | `123456` | Acme Corp | Database & Schema tasks |
| 👤 **Employee** | Mike Johnson | `mike@company.com` | `123456` | Acme Corp | Security & DevOps tasks |
| 👤 **Employee** | Sarah Wilson | `sarah@company.com` | `123456` | Acme Corp | QA & Testing deliverables |
| 👤 **Employee** | Tom Brown | `tom@company.com` | `123456` | Acme Corp | Infrastructure tasks |
| 👤 **Employee** | Pradipta Kumar | `supritimaity59@gmail.com` | `123456` | Acme Corp | Lead developer workspace |

> **💡 Demo Quick Fill:** On the `/login` screen, you can click the quick-preset buttons to autofill Admin or Employee demo credentials instantly.

---

## 3. Public Pages & Interactive Sprint Simulator

### Landing Page (`/`)
1. **Light SaaS Design Foundation:** Crisp light surfaces (`#F5F6F7`), deep charcoal typography (`#0F172A`), geometric orbital arcs, and responsive layout.
2. **Interactive Sprint Simulator (`#simulator`):**
   - Live interactive sprint board embedded in the hero.
   - Click tasks to cycle states (`active` ➔ `completed`).
   - Watch the live burn-down percentage and status counters update dynamically.
   - Zero registration required to test-drive the workflow.
3. **4-Step Interactive Stepper:**
   - Step 1: *Register Organization* (Initialize multi-tenant workspace)
   - Step 2: *Provision Team* (Invite staff with role-based permissions)
   - Step 3: *Delegate Tasks* (Draft specifications with FlowAI)
   - Step 4: *Measure Velocity* (Real-time analytics and burn-down tracking)
4. **Target Persona Matrices:** Tailored feature breakdown for Engineering Teams, Operations & HR, and Fast-Growing Startups.
5. **FAQ Accordion & Release News Pill:** Direct answers to multi-tenancy and security questions with live `v2.4 Task AI Deployed` pill.

---

## 4. Multi-Tenant Organization Onboarding

### Company Registration (`/register-company`)
To provision a brand new company workspace:

1. Click **"Get Started"** or **"Start Free Trial"** on the landing page, or browse directly to `/register-company`.
2. The split-card layout showcases workspace governance benefits on the left and registration fields on the right:
   - **Company / Workspace Name:** e.g., *Starlight Technologies* (defines tenant isolation boundary)
   - **Primary Administrator Name:** e.g., *Alex Rivera*
   - **Executive Email Address:** e.g., *alex@starlight.io*
   - **Password:** Minimum 6 characters (hashed with bcrypt 10 rounds)
   - **Confirm Password:** Password confirmation match
3. Click **"Create Workspace"**:
   - Calls `POST /api/auth/register-admin`
   - Atomically provisions the company scope and root admin account
   - Automatically logs in and redirects to the **Admin Command Center** (`/admin`)

---

## 5. Authentication Suite

### Login (`/login`)
- Clean card interface with instant password visibility toggling.
- **Demo Credential Fillers:** 1-click buttons for instant Admin or Employee testing.
- Successful login automatically evaluates the user's role:
  - Role `admin` ➔ Redirects to `/admin`
  - Role `employee` ➔ Redirects to `/employee`

### Sign Up (`/signup`)
- Secondary signup form for team members joining an existing tenant.

### Password Recovery (`/forgot-password` & `/reset-password`)
1. Browse to `/forgot-password`, enter account email.
2. System dispatches a cryptographically secure token via Nodemailer with 10-minute expiry.
3. Access reset link `/reset-password?token=<TOKEN>` from email to establish new password.

---

## 6. Admin Command Center (`/admin`)

The Command Center is reserved for workspace administrators to organize deliverables, monitor progress, and manage personnel.

### Navy Navigation & Workspace Identity
- **Dark Navy Sidebar (`#101827`):** High-contrast navigation featuring company badge, active indicators, and mobile drawer support.
- **Sprint KPI Summary:** Real-time counters displaying Total Tasks, Active Sprints, Completed Deliverables, and Blocked/Failed tasks.

### Tasks Board Tab
- **Search & Filters:** Real-time debounced search by deliverable title or description, combined with status pills (`All`, `New`, `Active`, `Completed`, `Failed`).
- **Deliverable Cards:** Each card displays title, description, priority badge (`Urgent`, `High`, `Medium`, `Low`), category chip, assignee name/email, due date, and overdue indicator.
- **Action Controls:** Inline task deletion with confirmation modal and direct status inspection.

### Create Deliverable Tab & FlowAI Injection
- **Deliverable Composer Form:**
  - **Task Title:** Concise name of deliverable (up to 100 characters).
  - **Category Selector:** Frontend, Backend, Database, DevOps, Security, Design, Testing, Bug Fix, Feature, Documentation, or Other.
  - **Priority:** Low, Medium, High, Urgent.
  - **Assignee Selection:** Dropdown populated from active company employees (`GET /api/employees`).
  - **Due Date Picker:** Calendar input with automatic overdue calculation.
  - **Detailed Scope / Description:** Up to 500 characters of technical specifications.
- **FlowAI Copilot 1-Click Injection:** When FlowAI drafts a task specification, administrators can click **"Insert into Form"** to automatically populate all composer fields.

### Employees Directory Tab
- **Staff Roster:** View all members registered in your company workspace with their email, role badge, account status, and workload metrics (Active Tasks, Completed Tasks, Failed/Blocked Tasks).
- **Add Employee Modal:** Create team member credentials directly (`POST /api/employees`) specifying Name, Email, and Initial Password.
- **Password Reset Tool:** Admins can reset member passwords directly from the directory modal.
- **Member Removal:** Safe employee deletion with active task reassignment prompts.

### Analytics Suite (Recharts Visualizations)
- **Status Distribution:** Interactive Donut / Pie Chart showing live distribution of deliverables across `New`, `Active`, `Completed`, and `Failed`.
- **Category Breakdown:** Bar chart displaying workload distribution across functional domains (Frontend, Backend, DevOps, etc.).
- **Team Velocity & Throughput:** Individual member completion rates and workload capacity.

---

## 7. Employee Workspace (`/employee`)

Designed specifically for individual contributors to focus on execution without administrative clutter.

### Dynamic Time-Aware Banner & Personal KPIs
- Dynamic banner greets the employee based on their local time (*"Good morning"*, *"Good afternoon"*, *"Good evening"*).
- Personal KPI counters showing **New Tasks**, **In Progress**, **Delivered**, and **Blocked**.

### Intelligent "Next Best Action" Engine
An automated decision engine evaluates queue conditions to provide optimal focus:
- **Condition 1 (Unaccepted Deliverables):** Highlights the highest-priority new task with a prominent **1-Click "Accept First Task"** button.
- **Condition 2 (Tasks In-Flight):** Focuses the employee on their active task with real-time execution timer and direct completion controls.
- **Condition 3 (Queue Clear):** Displays an achievement celebration banner indicating all deliverables for the sprint have been resolved.

### Deliverable Execution & Blocker Triage
- **1-Click Acceptance:** Transitions task from `new` ➔ `active`.
- **Mark Complete:** Records timestamp and marks task `completed` with celebration toast.
- **Document Blocker / Mark Failed:**
  - Opens a dedicated blocker triage modal.
  - Requires the employee to document the root cause / blocker description (e.g., *"Third-party API endpoint returning 502"*).
  - Immediately flags the task as `failed` on the Admin board to trigger lead intervention.

---

## 8. FlowAI Workspace Copilot

Available via the global floating button across both Admin and Employee views.

### Copilot Capabilities
- **Model:** Google Gemini 3.6 Flash.
- **Context-Aware:** Reads active user role (`admin` vs `employee`), company workspace, and active route URL.
- **Natural Language to Specification:** Say *"Draft a high-priority task for migrating user sessions to Redis"* and FlowAI will respond with a structured specification containing:
  - Title & Category
  - Priority & Due Date
  - Technical Scope & Architecture Objectives
  - Strict Acceptance Criteria
- **1-Click Form Autofill:** Populates the Admin Create Deliverable form with one tap.
- **Built-in Prompt Triggers:** Quick pills for Sprint Planning, Blocker Resolution, Architecture Review, and Code Quality audits.
- **Docking Flexibility:** Minimize, expand full-screen, or quick-clear conversation state with graceful offline fallbacks.

---

## 9. Multi-Tenant Architecture & Data Isolation

### How Data Segregation Works
1. **Tenant Anchor:** Every user record contains a mandatory `companyName` field.
2. **Automatic Query Scoping:**
   - Backend queries filter employees by `companyName: req.user.companyName`.
   - Deliverables are filtered by verifying the assignee belongs to the caller's company.
   - Cross-tenant data leakage is structurally impossible at the database query level.
3. **Email Isolation:** The same employee email address can exist across different tenant companies without collision.

---

## 10. URL Routing & Navigation Reference

| Path | Access Guard | Description |
| :--- | :--- | :--- |
| `/` | Public | Modern landing page with interactive Sprint Simulator & features |
| `/register-company` | Public (Guest) | Split-card company workspace provisioning (`POST /api/auth/register-admin`) |
| `/login` | Public (Guest) | SaaS card login with 1-click demo role presets |
| `/signup` | Public (Guest) | Employee sign up form |
| `/forgot-password` | Public | Password recovery token request |
| `/reset-password` | Public | Secure password reset form with token validation |
| `/admin` | Protected (`admin`) | Admin Command Center (Tasks, Create Deliverable, Employees, Analytics) |
| `/employee` | Protected (`employee`) | Employee Workspace (Greeting, KPIs, Next Best Action, TaskList) |
| `*` | Any | Wildcard catch-all redirects automatically to `/` |

---

## 11. Troubleshooting & Support

### Common Questions & Solutions

#### 1. Cannot connect to server ("Failed to fetch")
- Verify that the backend is active on port `5000`:
  ```bash
  curl http://localhost:5000/api/health
  # Returns: {"success": true, "message": "API is running"}
  ```
- Ensure Vite reverse proxy is enabled in `vite.config.js` (`/api` ➔ `http://localhost:5000`).

#### 2. FlowAI Copilot says API key is missing
- Ensure `VITE_GEMINI_API_KEY` is defined in your root `.env` or `.env.local`:
  ```env
  VITE_GEMINI_API_KEY=your_gemini_api_key_here
  ```
- Restart the Vite dev server (`npm run dev`) after updating `.env`.

#### 3. Database reset & fresh demo seeding
- To re-populate the complete Acme Corp organization with 20 demo deliverables:
  ```bash
  cd server
  npm run seed
  ```

#### 4. Session expired or corrupted token
- Click **"Sign Out"** in the top navigation header or clear browser storage:
  - DevTools (F12) ➔ Application ➔ Local Storage ➔ Clear `token` and `loggedInUser`.
- Sign back in at `/login`.

---

**TeamFlow Workforce Operating System** • Built for high-velocity teams.
