import request from "supertest";
import app from "../src/app.js";
import mongoose from "mongoose";
import User from "../src/models/User.js";
import { connectDB } from "../src/config/db.js";

// Test database connection
beforeAll(async () => {
  // Connect to test database
  await connectDB();
});

// Clean up after each test
afterEach(async () => {
  // Clear all test data
  await User.deleteMany({});
});

// Close database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe("Auth API Tests", () => {
  describe("POST /api/auth/register-admin", () => {
    it("should register a new admin successfully", async () => {
      const testData = {
        name: "Test Admin",
        email: `testadmin${Date.now()}@example.com`,
        password: "password123",
        companyName: "Test Company",
      };

      const res = await request(app)
        .post("/api/auth/register-admin")
        .send(testData);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user).toBeDefined();
      expect(res.body.data.user.email).toBe(testData.email);
      expect(res.body.data.user.role).toBe("admin");
      expect(res.body.data.user.companyName).toBe(testData.companyName);
    });

    it("should fail to register with missing required fields", async () => {
      const res = await request(app).post("/api/auth/register-admin").send({
        name: "Test User",
        email: "test@example.com",
        // Missing password and companyName
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should fail to register with invalid email", async () => {
      const res = await request(app).post("/api/auth/register-admin").send({
        name: "Test User",
        email: "invalid-email",
        password: "password123",
        companyName: "Test Company",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should fail to register with duplicate email", async () => {
      const testData = {
        name: "Test Admin",
        email: `duplicate${Date.now()}@example.com`,
        password: "password123",
        companyName: "Test Company",
      };

      // First registration
      await request(app).post("/api/auth/register-admin").send(testData);

      // Second registration with same email
      const res = await request(app)
        .post("/api/auth/register-admin")
        .send(testData);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login successfully with correct credentials", async () => {
      // First create a user
      const userData = {
        name: "Login Test User",
        email: `logintest${Date.now()}@example.com`,
        password: "password123",
        companyName: "Test Company",
      };

      await request(app).post("/api/auth/register-admin").send(userData);

      // Now login
      const res = await request(app).post("/api/auth/login").send({
        email: userData.email,
        password: userData.password,
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe(userData.email);
    });

    it("should fail to login with incorrect password", async () => {
      // First create a user
      const userData = {
        name: "Wrong Password Test",
        email: `wrongpass${Date.now()}@example.com`,
        password: "password123",
        companyName: "Test Company",
      };

      await request(app).post("/api/auth/register-admin").send(userData);

      // Try to login with wrong password
      const res = await request(app).post("/api/auth/login").send({
        email: userData.email,
        password: "wrongpassword",
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should fail to login with non-existent user", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "nonexistent@example.com",
        password: "password123",
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
