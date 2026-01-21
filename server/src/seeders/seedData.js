import mongoose from "mongoose";
import dotenv from "dotenv";
import { User, Task } from "../models/index.js";

dotenv.config();

/**
 * Seed Database with initial data
 */
const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Create Admin
    const admin = await User.create({
      name: "Admin User",
      email: "admin@company.com",
      password: "admin123",
      role: "admin",
    });
    console.log("👤 Admin created:", admin.email);

    // Create Employees
    const employees = await User.insertMany([
      {
        name: "John Doe",
        email: "john@company.com",
        password: "123456",
        role: "employee",
      },
      {
        name: "Jane Smith",
        email: "jane@company.com",
        password: "123456",
        role: "employee",
      },
      {
        name: "Mike Johnson",
        email: "mike@company.com",
        password: "123456",
        role: "employee",
      },
      {
        name: "Sarah Wilson",
        email: "sarah@company.com",
        password: "123456",
        role: "employee",
      },
      {
        name: "Tom Brown",
        email: "tom@company.com",
        password: "123456",
        role: "employee",
      },
    ]);
    console.log(`👥 ${employees.length} employees created`);

    // Create Sample Tasks
    const tasks = await Task.insertMany([
      {
        title: "Build Login UI",
        description:
          "Create responsive login page using React and Tailwind CSS with form validation",
        category: "Frontend",
        status: "new",
        priority: "high",
        assignedTo: employees[0]._id,
        assignedBy: admin._id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
      {
        title: "Fix Navbar Bug",
        description:
          "Resolve alignment issue in the navigation bar on mobile devices",
        category: "Bug Fix",
        status: "completed",
        priority: "medium",
        assignedTo: employees[0]._id,
        assignedBy: admin._id,
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        completedAt: new Date(),
      },
      {
        title: "API Integration",
        description:
          "Integrate user authentication API with JWT tokens and refresh mechanism",
        category: "Backend",
        status: "active",
        priority: "high",
        assignedTo: employees[1]._id,
        assignedBy: admin._id,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Database Design",
        description:
          "Design and implement MongoDB schema for task management system",
        category: "Database",
        status: "failed",
        priority: "urgent",
        assignedTo: employees[2]._id,
        assignedBy: admin._id,
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        failedAt: new Date(),
        failureReason: "Requirements changed mid-sprint",
      },
      {
        title: "Write Unit Tests",
        description: "Write comprehensive Jest tests for all API endpoints",
        category: "Testing",
        status: "new",
        priority: "medium",
        assignedTo: employees[3]._id,
        assignedBy: admin._id,
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Deploy to Production",
        description:
          "Deploy application to Vercel and configure environment variables",
        category: "DevOps",
        status: "completed",
        priority: "high",
        assignedTo: employees[4]._id,
        assignedBy: admin._id,
        dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        completedAt: new Date(),
      },
      {
        title: "Create Dashboard Charts",
        description:
          "Implement data visualization using Chart.js for admin dashboard",
        category: "Frontend",
        status: "active",
        priority: "medium",
        assignedTo: employees[0]._id,
        assignedBy: admin._id,
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Setup CI/CD Pipeline",
        description:
          "Configure GitHub Actions for automated testing and deployment",
        category: "DevOps",
        status: "new",
        priority: "low",
        assignedTo: employees[4]._id,
        assignedBy: admin._id,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
    ]);
    console.log(`📋 ${tasks.length} tasks created`);

    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   ✅ Database seeded successfully!                        ║
║                                                           ║
║   Login Credentials:                                      ║
║   ─────────────────────────────────────────               ║
║   Admin:    admin@company.com / admin123                  ║
║   Employee: john@company.com / 123456                     ║
║   Employee: jane@company.com / 123456                     ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    `);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedData();
