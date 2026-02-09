# 🏢 Employee Management System

A full-stack multi-tenant employee and task management application built with React, Node.js, Express, and MongoDB. Features a modern dark-themed UI with 3D animations, real-time task tracking, and role-based access control.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-19-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-brightgreen)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC)
![License](https://img.shields.io/badge/License-MIT-yellow)

> **Current Version:** 1.0.0 (Production Ready)  
> **Status:** ✅ Core features complete | 🔧 Enhancement phase  
> **Last Updated:** February 10, 2026

## 📚 Documentation & Tutorials

**New Users? Start Here:**

- 🚀 [**Quick Start Tutorial**](./QUICK_START_TUTORIAL.md) - Get up and running in 5 minutes
- 📖 [**User Guide**](./USER_GUIDE.md) - Complete guide for signup, login, and features
- 📊 [**Visual Workflow Guide**](./VISUAL_WORKFLOW_GUIDE.md) - Diagrams and visual explanations
- 📝 [**Project Analysis**](./PROJECT_ANALYSIS.md) - Technical architecture details

## ✨ Demo

| Admin Dashboard                                                    | Employee Dashboard                                                       |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| ![Admin](https://via.placeholder.com/400x250?text=Admin+Dashboard) | ![Employee](https://via.placeholder.com/400x250?text=Employee+Dashboard) |

## 📋 Features

### 🌐 Multi-Tenant Architecture

- ✅ **Complete data isolation** - Each company has separate data via companyName field
- ✅ **Self-registration** - Companies can sign up independently
- ✅ **Company-based filtering** - All queries scoped to company
- ✅ **Secure isolation** - Company validation on all authenticated requests
- ⚠️ **Subscription plans** - Planned feature (Free, Pro, Enterprise)

> **Note:** Current implementation uses `companyName` field for tenant isolation. Full Company model with subscription tiers is planned for Phase 2.

### 🎨 Landing Page & Onboarding

- ✅ **3D animated sphere** - Interactive Three.js visualization
- ✅ **Modern glassmorphism UI** - Beautiful gradient designs
- ✅ **Multi-step registration** - Easy company setup wizard
- ✅ **Pricing tiers** - Clear plan comparisons
- ✅ **Responsive design** - Works on all devices

### Admin Dashboard

- ✅ Create, update, and delete tasks
- ✅ Assign tasks to employees with priority levels
- ✅ View all employees and their task statistics
- ✅ Monitor task progress and completion rates
- ✅ Search and filter tasks by status, category, priority
- ✅ Real-time stats cards with task metrics
- ✅ Quick actions sidebar for common operations
- ✅ Company-wide analytics and insights

### Employee Dashboard

- ✅ View assigned tasks in organized categories
- ✅ Accept new tasks with one click
- ✅ Mark tasks as completed
- ✅ Mark tasks as failed (with reason)
- ✅ Track personal task statistics
- ✅ Smart "Next Best Action" guidance
- ✅ Personalized greeting based on time of day

### Authentication & Security

- ✅ JWT-based authentication with HTTP-only patterns
- ✅ Role-based access control (Admin/Employee)
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ Password reset via email with token expiry
- ✅ Protected API routes with middleware
- ✅ Session persistence in localStorage
- ✅ Company-level data isolation
- ✅ Input sanitization (NoSQL injection, XSS protection)
- ✅ Rate limiting (global + auth-specific)
- ✅ Security headers via Helmet
- ✅ CORS with origin whitelist
- ✅ HTTP parameter pollution prevention

## 🛠️ Tech Stack

### Frontend

- **React 19** - Modern React with hooks
- **Tailwind CSS 4** - Utility-first styling
- **Vite** - Next-gen frontend tooling
- **React Router DOM** - Client-side routing
- **Three.js** - 3D graphics and animations
- **React Three Fiber** - React renderer for Three.js
- **Framer Motion** - Animation library
- **Lucide React** - Modern icon library

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database with multi-tenant support
- **Mongoose** - ODM for MongoDB
- **JWT** - Token-based authentication
- **bcrypt** - Password hashing
- **express-validator** - Input validation
- **Nodemailer** - Email notifications
- **Helmet** - Security headers
- **Rate Limiting** - API protection

## 📁 Project Structure

```
Employee_Management_System/
├── 📂 src/                     # Frontend (React)
│   ├── 📂 components/
│   │   ├── 📂 Admin/           # Admin dashboard components
│   │   │   ├── 📂 components/  # Reusable admin components
│   │   │   ├── 📂 hooks/       # Custom hooks for admin
│   │   │   └── 📂 styles/      # Admin-specific styles
│   │   ├── 📂 Auth/            # Login component
│   │   ├── 📂 Dashboard/       # Employee dashboard
│   │   ├── 📂 TaskList/        # Task card components
│   │   └── 📂 others/          # Shared components
│   ├── 📂 context/             # React Context providers
│   ├── 📂 hooks/               # Global custom hooks
│   ├── 📂 services/            # API service layer
│   └── 📂 utils/               # Utility functions
├── 📂 server/                  # Backend (Node.js)
│   └── 📂 src/
│       ├── 📂 config/          # Database & env config
│       ├── 📂 controllers/     # Route handlers
│       ├── 📂 middleware/      # Auth, validation, errors
│       ├── 📂 models/          # Mongoose models
│       ├── 📂 routes/          # API routes
│       ├── 📂 validators/      # Input validation schemas
│       ├── 📂 seeders/         # Database seeders
│       └── 📂 utils/           # Helper utilities
├── 📄 package.json             # Frontend dependencies
├── 📄 TODO.md                  # Improvement roadmap
└── 📄 README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- MongoDB ([Local](https://www.mongodb.com/try/download/community) or [Atlas](https://www.mongodb.com/atlas))
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/Employee-Management-System.git
   cd Employee-Management-System
   ```

2. **Install frontend dependencies**

   ```bash
   npm install
   ```

3. **Install backend dependencies**

   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Configure environment variables**

   **Frontend** - Create `.env` in root folder:

   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

   **Backend** - Create `server/.env`:

   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/employee_management
   JWT_SECRET=your-super-secret-key-change-in-production
   JWT_EXPIRE=7d
   CLIENT_URL=http://localhost:5173
   ```

5. **Seed the database** (creates sample users & tasks)
   ```bash
   cd server
   npm run seed
   ```

### Running the Application

**Option 1: Run both servers separately**

```bash
# Terminal 1 - Start Backend (from server folder)
cd server
npm run dev

# Terminal 2 - Start Frontend (from root folder)
npm run dev
```

**Option 2: Quick start commands**

```bash
# Backend
cd server && npm run dev

# Frontend (new terminal)
npm run dev
```

### Access the Application

| Service         | URL                              |
| --------------- | -------------------------------- |
| 🌐 Frontend     | http://localhost:5173            |
| 🔧 Backend API  | http://localhost:5000            |
| 💚 Health Check | http://localhost:5000/api/health |

## 🔐 Default Login Credentials

After seeding the database:

| Role        | Email             | Password | Access                            |
| ----------- | ----------------- | -------- | --------------------------------- |
| 👑 Admin    | admin@company.com | admin123 | Full dashboard, create/edit tasks |
| 👤 Employee | john@company.com  | 123456   | View & manage assigned tasks      |
| 👤 Employee | jane@company.com  | 123456   | View & manage assigned tasks      |
| 👤 Employee | mike@company.com  | 123456   | View & manage assigned tasks      |
| 👤 Employee | sarah@company.com | 123456   | View & manage assigned tasks      |

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication

All protected routes require JWT token in header:

```
Authorization: Bearer <your-token>
```

### Auth Endpoints

| Method | Endpoint                | Description       | Access  |
| ------ | ----------------------- | ----------------- | ------- |
| POST   | `/auth/register`        | Register new user | Public  |
| POST   | `/auth/login`           | Login user        | Public  |
| GET    | `/auth/me`              | Get current user  | Private |
| PUT    | `/auth/me`              | Update profile    | Private |
| PUT    | `/auth/change-password` | Change password   | Private |

### Task Endpoints

| Method | Endpoint              | Description      | Access   |
| ------ | --------------------- | ---------------- | -------- |
| GET    | `/tasks`              | Get all tasks    | Private  |
| GET    | `/tasks/:id`          | Get single task  | Private  |
| POST   | `/tasks`              | Create task      | Admin    |
| PUT    | `/tasks/:id`          | Update task      | Admin    |
| DELETE | `/tasks/:id`          | Delete task      | Admin    |
| PUT    | `/tasks/:id/accept`   | Accept task      | Employee |
| PUT    | `/tasks/:id/complete` | Complete task    | Employee |
| PUT    | `/tasks/:id/fail`     | Mark task failed | Employee |

### Employee Endpoints

| Method | Endpoint         | Description          | Access |
| ------ | ---------------- | -------------------- | ------ |
| GET    | `/employees`     | Get all employees    | Admin  |
| GET    | `/employees/:id` | Get employee details | Admin  |
| POST   | `/employees`     | Create employee      | Admin  |
| PUT    | `/employees/:id` | Update employee      | Admin  |
| DELETE | `/employees/:id` | Delete employee      | Admin  |

### Query Parameters (Tasks)

```
GET /api/tasks?status=active&category=Frontend&priority=high&search=login
```

| Parameter  | Values                              | Description                 |
| ---------- | ----------------------------------- | --------------------------- |
| status     | new, active, completed, failed, all | Filter by status            |
| category   | Frontend, Backend, Database, etc.   | Filter by category          |
| priority   | low, medium, high, urgent           | Filter by priority          |
| search     | string                              | Search in title/description |
| assignedTo | userId                              | Filter by employee (Admin)  |

## 🧪 Running Tests

```bash
# Frontend tests
npm run test

# Backend tests
cd server
npm run test
```

## 📦 Building for Production

```bash
# Build frontend
npm run build

# Preview production build
npm run preview

# The build output will be in the dist/ folder
```

## 🚀 Deployment

### Frontend (Vercel)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set environment variable: `VITE_API_URL`
4. Deploy

### Backend (Railway/Render)

1. Push to GitHub
2. Create new service on [Railway](https://railway.app) or [Render](https://render.com)
3. Set environment variables (PORT, MONGODB_URI, JWT_SECRET, etc.)
4. Deploy

### Database (MongoDB Atlas)

1. Create free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create database user
3. Whitelist IP addresses
4. Get connection string and update `MONGODB_URI`

## 🗺️ Roadmap & Improvements

See [TODO.md](./TODO.md) for a comprehensive list of planned features and improvements including:

### 🔜 Upcoming Features

- [ ] User registration flow
- [ ] Forgot password functionality
- [ ] React Router for navigation
- [ ] Real-time notifications (Socket.io)
- [ ] Data visualization charts
- [ ] Drag & drop Kanban board
- [ ] Export to CSV/PDF

### 🤖 Planned AI Features

- [ ] **AI Task Description Generator** - Auto-generate detailed task descriptions
- [ ] **Smart Priority Suggestions** - AI recommends task priority based on context
- [ ] **Performance Insights** - AI-generated employee performance analysis
- [ ] **Chatbot Assistant** - AI helper for employees to manage tasks
- [ ] **Meeting Notes → Tasks** - Extract tasks from meeting notes automatically
- [ ] **Smart Deadline Estimation** - AI predicts realistic deadlines
- [ ] **Workload Prediction** - Predict and balance team workload

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/yourusername/Employee-Management-System](https://github.com/yourusername/Employee-Management-System)

---

<p align="center">
  Made with ❤️ using React, Node.js & MongoDB
</p>
