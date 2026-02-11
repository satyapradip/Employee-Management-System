# 🧪 Test Suite for Employee Management System

## 📁 Folder Structure

```
server/
├── tests/
│   ├── auth.test.js      # Authentication tests
│   ├── setup.js          # Test database setup utilities
│   └── README.md         # This file
├── jest.config.js        # Jest configuration
├── .env.test            # Test environment variables
└── package.json         # Test scripts
```

## ✅ What Was Fixed

### 1. **Correct API Endpoint**

- ❌ **Before:** `/api/auth/register`
- ✅ **After:** `/api/auth/register-admin`
- The endpoint was wrong. Your backend uses `/register-admin` for admin registration.

### 2. **Database Setup & Teardown**

- Added `beforeAll()` - Connects to database before tests
- Added `afterEach()` - Cleans up data after each test
- Added `afterAll()` - Closes database connection after all tests
- This prevents test pollution and ensures isolated tests

### 3. **Missing Imports**

- Added `mongoose` import for database operations
- Added `User` model import for data cleanup
- Added `connectDB` import for database connection

### 4. **Test Scripts in package.json**

```json
"test": "NODE_ENV=test jest --detectOpenHandles --forceExit"
"test:watch": "NODE_ENV=test jest --watch"
"test:coverage": "NODE_ENV=test jest --coverage"
```

### 5. **Jest Configuration**

- Added proper timeout (10 seconds)
- Added coverage collection
- Added verbose mode for better output

### 6. **Comprehensive Test Cases**

Added tests for:

- ✅ Successful admin registration
- ✅ Failed registration (missing fields)
- ✅ Failed registration (invalid email)
- ✅ Failed registration (duplicate email)
- ✅ Successful login
- ✅ Failed login (wrong password)
- ✅ Failed login (non-existent user)

## 🎯 Folder Position: CORRECT! ✅

Your test folder is in the **correct location**:

```
server/tests/  ← CORRECT
```

Alternative locations that would also work:

- `server/__tests__/`
- `server/src/__tests__/`

## 🚀 How to Run Tests

### Run all tests:

```bash
npm test
```

### Run tests in watch mode (auto-rerun on file changes):

```bash
npm run test:watch
```

### Run tests with coverage report:

```bash
npm run test:coverage
```

## 📝 Understanding the Test File

### Test Structure:

```javascript
describe("Auth API Tests", () => {
  // Group of related tests

  describe("POST /api/auth/register-admin", () => {
    // Specific endpoint tests

    it("should register a new admin successfully", async () => {
      // Individual test case
      const res = await request(app)
        .post("/api/auth/register-admin")
        .send(testData);

      expect(res.statusCode).toBe(201);
    });
  });
});
```

### Key Components:

1. **beforeAll()** - Runs once before all tests
2. **afterEach()** - Runs after each test (cleanup)
3. **afterAll()** - Runs once after all tests
4. **describe()** - Groups related tests
5. **it()** - Individual test case
6. **expect()** - Assertion/verification

## 🔧 Environment Setup

Tests use a **separate test database** to avoid affecting your development data.

**Development DB:** `mongodb://localhost:27017/employee_management`
**Test DB:** `mongodb://localhost:27017/employee_management_test`

## 📊 What Gets Tested

### ✅ Registration Tests:

- Correct data → Should succeed
- Missing fields → Should fail (400)
- Invalid email → Should fail (400)
- Duplicate email → Should fail (400)

### ✅ Login Tests:

- Correct credentials → Should succeed
- Wrong password → Should fail (401)
- Non-existent user → Should fail (401)

## 🐛 Common Errors & Solutions

### Error: "Cannot find module"

**Solution:** Make sure all dependencies are installed:

```bash
npm install
```

### Error: "MongoDB connection failed"

**Solution:**

1. Make sure MongoDB is running: `mongod`
2. Check your `.env.test` file has correct `MONGODB_URI`

### Error: "Jest timeout exceeded"

**Solution:** Increase timeout in jest.config.js:

```javascript
testTimeout: 30000; // 30 seconds
```

### Error: "Port already in use"

**Solution:** Tests don't need the server running. Stop `npm run dev` before testing.

## 💡 Best Practices

1. **Keep tests isolated** - Each test should work independently
2. **Clean up after tests** - Remove test data (we do this in `afterEach`)
3. **Use descriptive names** - Test names should explain what they test
4. **Test both success and failure** - Test happy paths and error cases
5. **Don't rely on test order** - Tests should run in any order

## 🎨 Example: Adding a New Test

```javascript
it("should fail with password less than 6 characters", async () => {
  const res = await request(app).post("/api/auth/register-admin").send({
    name: "Test User",
    email: "test@example.com",
    password: "12345", // Too short
    companyName: "Test Company",
  });

  expect(res.statusCode).toBe(400);
  expect(res.body.success).toBe(false);
  expect(res.body.message).toContain("password");
});
```

## 📚 Further Reading

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/ladjs/supertest)
- [Testing Best Practices](https://testingjavascript.com/)

---

**Your tests are now properly configured and ready to use!** 🎉
