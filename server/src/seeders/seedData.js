import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { User, Task } from "../models/index.js";

// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server folder (2 levels up from seeders folder)
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

/**
 * Seed Database with initial data
 */
const seedData = async () => {
  try {
    // Validate MongoDB URI exists
    if (!process.env.MONGODB_URI) {
      console.error("❌ Error: MONGODB_URI is not defined in .env file");
      console.error("📁 Expected .env location: server/.env");
      console.error("\n💡 Make sure your server/.env file contains:");
      console.error(
        "   MONGODB_URI=mongodb://localhost:27017/employee_management",
      );
      process.exit(1);
    }

    console.log("🔄 Connecting to MongoDB...");
    console.log(
      `📍 URI: ${process.env.MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, "//***:***@")}`,
    );

    // Connect to MongoDB with timeout
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10 second timeout
    });
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Create Admin (matching README credentials)
    const admin = await User.create({
      name: "Admin User",
      email: "admin@company.com",
      password: "admin123",
      role: "admin",
      companyName: "Acme Corp",
    });
    console.log("👤 Admin created:", admin.email);

    // Create Employees (using create() to ensure password hashing via pre-save hook)
    const employeeData = [
      {
        name: "Pradipta Kumar",
        email: "supritimaity59@gmail.com",
        password: "123456",
        role: "employee",
        companyName: "Acme Corp",
      },
      {
        name: "Jane Smith",
        email: "jane@company.com",
        password: "123456",
        role: "employee",
        companyName: "Acme Corp",
      },
      {
        name: "Mike Johnson",
        email: "mike@company.com",
        password: "123456",
        role: "employee",
        companyName: "Acme Corp",
      },
      {
        name: "Sarah Wilson",
        email: "sarah@company.com",
        password: "123456",
        role: "employee",
        companyName: "Acme Corp",
      },
      {
        name: "Tom Brown",
        email: "tom@company.com",
        password: "123456",
        role: "employee",
        companyName: "Acme Corp",
      },
    ];

    // Create employees one by one to trigger password hashing
    const employees = [];
    for (const data of employeeData) {
      const employee = await User.create(data);
      employees.push(employee);
    }
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
║   Employee: mike@company.com / 123456                     ║
║   Employee: sarah@company.com / 123456                    ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    `);

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Seeding failed!");
    console.error("─".repeat(50));

    // Provide helpful error messages based on error type
    if (error.name === "MongoServerSelectionError") {
      console.error("🔌 Could not connect to MongoDB server.");
      console.error("\n💡 Possible solutions:");
      console.error("   1. Make sure MongoDB is running locally");
      console.error("   2. Check if your MongoDB Atlas IP is whitelisted");
      console.error("   3. Verify your connection string in server/.env");
    } else if (error.name === "MongooseServerSelectionError") {
      console.error("🔐 Authentication or network error.");
      console.error(
        "\n💡 Check your MongoDB credentials and network connection.",
      );
    } else if (error.code === "ENOTFOUND") {
      console.error("🌐 DNS lookup failed - cannot reach MongoDB host.");
    } else {
      console.error(`Error: ${error.message}`);
    }

    console.error("─".repeat(50));
    process.exit(1);
  }
};

seedData();
