# 🏢 Employee Management System

A full-stack employee and task management application built with React, Node.js, Express, and MongoDB.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-19-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-brightgreen)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 📋 Features

### Admin Dashboard

- ✅ Create, update, and delete tasks
- ✅ Assign tasks to employees
- ✅ View all employees and their task statistics
- ✅ Monitor task progress and completion rates
- ✅ Search and filter tasks

### Employee Dashboard

- ✅ View assigned tasks
- ✅ Accept new tasks
- ✅ Mark tasks as completed
- ✅ Mark tasks as failed (with reason)
- ✅ Track personal task statistics

## 🛠️ Tech Stack

### Frontend

- React 19
- Tailwind CSS 4
- Vite

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing

## 📁 Project Structure

```
Employee_Management_System/
├── src/                    # Frontend (React)
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── services/           # API service layer
│   └── utils/
├── server/                 # Backend (Node.js)
│   └── src/
│       ├── config/         # Database & env config
│       ├── controllers/    # Route handlers
│       ├── middleware/     # Auth, validation, errors
│       ├── models/         # Mongoose models
│       ├── routes/         # API routes
│       ├── validators/     # Input validation
│       └── seeders/        # Database seeders
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
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
   ```

4. **Configure environment variables**

   Frontend (`.env` in root):

   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

   Backend (`server/.env`):

   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/employee_management
   JWT_SECRET=your-secret-key-here
   JWT_EXPIRE=7d
   CLIENT_URL=http://localhost:5173
   ```

5. **Seed the database (optional)**
   ```bash
   cd server
   npm run seed
   ```

### Running the Application

**Start backend server:**

```bash
cd server
npm run dev
```

**Start frontend (new terminal):**

```bash
npm run dev
```

The app will be available at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🔐 Default Login Credentials

After seeding the database:

| Role     | Email             | Password |
| -------- | ----------------- | -------- |
| Admin    | admin@company.com | admin123 |
| Employee | john@company.com  | 123456   |
| Employee | jane@company.com  | 123456   |

## 📚 API Endpoints

### Authentication

| Method | Endpoint                    | Description       |
| ------ | --------------------------- | ----------------- |
| POST   | `/api/auth/register`        | Register new user |
| POST   | `/api/auth/login`           | Login user        |
| GET    | `/api/auth/me`              | Get current user  |
| PUT    | `/api/auth/me`              | Update profile    |
| PUT    | `/api/auth/change-password` | Change password   |

### Tasks

| Method | Endpoint                  | Description         |
| ------ | ------------------------- | ------------------- |
| GET    | `/api/tasks`              | Get all tasks       |
| GET    | `/api/tasks/:id`          | Get single task     |
| POST   | `/api/tasks`              | Create task (Admin) |
| PUT    | `/api/tasks/:id`          | Update task (Admin) |
| DELETE | `/api/tasks/:id`          | Delete task (Admin) |
| PUT    | `/api/tasks/:id/accept`   | Accept task         |
| PUT    | `/api/tasks/:id/complete` | Complete task       |
| PUT    | `/api/tasks/:id/fail`     | Fail task           |

### Employees

| Method | Endpoint             | Description                  |
| ------ | -------------------- | ---------------------------- |
| GET    | `/api/employees`     | Get all employees (Admin)    |
| GET    | `/api/employees/:id` | Get employee details (Admin) |
| POST   | `/api/employees`     | Create employee (Admin)      |
| PUT    | `/api/employees/:id` | Update employee (Admin)      |
| DELETE | `/api/employees/:id` | Delete employee (Admin)      |

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

# The build will be in the dist/ folder
```

## 🚀 Deployment

### Frontend (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Backend (Railway/Render)

1. Push to GitHub
2. Create new service
3. Set environment variables
4. Deploy

### Database (MongoDB Atlas)

1. Create free cluster
2. Get connection string
3. Update MONGODB_URI in backend

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/yourusername/Employee-Management-System](https://github.com/yourusername/Employee-Management-System)
