/**
 * Database Verification Script
 * Checks if MongoDB is connected and users exist
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { User } from "../src/models/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const verifyDatabase = async () => {
  try {
    console.log("🔍 Verifying database setup...\n");

    // Check environment variables
    if (!process.env.MONGODB_URI) {
      console.error("❌ MONGODB_URI not found in .env file");
      console.error("📁 Make sure server/.env exists with MONGODB_URI");
      process.exit(1);
    }

    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET not found in .env file");
      process.exit(1);
    }

    console.log("✅ Environment variables found");

    // Connect to MongoDB
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ Connected to MongoDB\n");

    // Check users
    const userCount = await User.countDocuments();
    console.log(`📊 Total users in database: ${userCount}`);

    if (userCount === 0) {
      console.log("\n⚠️  No users found in database!");
      console.log("💡 Run: npm run seed");
      process.exit(1);
    }

    // Check for admin
    const adminCount = await User.countDocuments({ role: "admin" });
    console.log(`👑 Admin users: ${adminCount}`);

    if (adminCount === 0) {
      console.log("\n⚠️  No admin user found!");
      console.log("💡 Run: npm run seed");
    }

    // Check for employees
    const employeeCount = await User.countDocuments({ role: "employee" });
    console.log(`👥 Employee users: ${employeeCount}`);

    // List admin users
    const admins = await User.find({ role: "admin" }).select("email name");
    if (admins.length > 0) {
      console.log("\n👑 Admin Accounts:");
      admins.forEach((admin) => {
        console.log(`   - ${admin.email} (${admin.name})`);
      });
    }

    // Test login credentials
    console.log("\n🔐 Testing login credentials...");
    const testAdmin = await User.findOne({ email: "admin@company.com" }).select(
      "+password",
    );

    if (testAdmin) {
      const isMatch = await testAdmin.comparePassword("admin123");
      if (isMatch) {
        console.log("✅ Admin login credentials work!");
      } else {
        console.log("⚠️  Admin password doesn't match");
      }
    } else {
      console.log("⚠️  admin@company.com not found");
      console.log("💡 Run: npm run seed");
    }

    console.log("\n✅ Database verification complete!");
    console.log("\n📝 Login Credentials:");
    console.log("   Admin:    admin@company.com / admin123");
    console.log("   Employee: john@company.com / 123456");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Verification failed!");
    console.error("─".repeat(50));

    if (error.name === "MongoServerSelectionError") {
      console.error("🔌 Could not connect to MongoDB");
      console.error("\n💡 Solutions:");
      console.error("   1. Make sure MongoDB is running");
      console.error("   2. Check MONGODB_URI in server/.env");
      console.error("   3. For Atlas: Check IP whitelist");
    } else {
      console.error(`Error: ${error.message}`);
    }

    console.error("─".repeat(50));
    process.exit(1);
  }
};

verifyDatabase();

