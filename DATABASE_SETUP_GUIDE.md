# 🗄️ Database Setup & Verification Guide

## ✅ Your MongoDB Setup is CORRECT!

Your database setup is properly configured. Here's what's working:

### ✅ What's Correct:

1. **Database Connection** - `server/src/config/db.js`
   - Properly uses Mongoose to connect to MongoDB
   - Handles connection errors gracefully
   - Has proper cleanup on shutdown

2. **User Model** - `server/src/models/User.js`
   - Correctly defined with all required fields
   - Password hashing with bcrypt (automatic via pre-save hook)
   - JWT token generation
   - Role validation (admin/employee)

3. **Authentication Flow** - `server/src/controllers/authController.js`
   - Properly queries MongoDB for users
   - Compares hashed passwords
   - Returns JWT tokens

4. **Database Seeding** - `server/src/seeders/seedData.js`
   - Creates initial users and tasks
   - Properly hashes passwords

---

## 🐛 Issues Found & Fixed

### 1. **Email Mismatch** ✅ FIXED
**Problem:** 
- README said: `admin@company.com`
- seedData created: `satyapradip.colleg@gmail.com`
- Users couldn't login with README credentials

**Fixed:**
- Updated seedData to create `admin@company.com` matching README
- Updated employee emails to match README

### 2. **Case-Sensitive Email Lookup** ✅ FIXED
**Problem:**
- Login might fail if email case doesn't match exactly

**Fixed:**
- Added email normalization (lowercase) in login and register
- Now works regardless of email case

---

## 🚀 How to Fix Your Login Issue

### Step 1: Verify MongoDB is Running

**Local MongoDB:**
```bash
# Check if MongoDB is running
# Windows (PowerShell):
Get-Service MongoDB

# Or check if port 27017 is listening
netstat -an | findstr 27017
```

**MongoDB Atlas:**
- Make sure your cluster is running
- Check your connection string in `.env`

### Step 2: Check Your `.env` File

Make sure `server/.env` exists and has:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/employee_management
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/employee_management

JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

### Step 3: Seed the Database

**IMPORTANT:** You need to seed the database to create users!

```bash
cd server
npm run seed
```

**Expected Output:**
```
✅ Connected to MongoDB
🗑️  Cleared existing data
👤 Admin created: admin@company.com
👥 4 employees created
📋 X tasks created
✅ Database seeded successfully!
```

### Step 4: Verify Users Were Created

**Option 1: Check MongoDB directly**
```bash
# Connect to MongoDB
mongosh

# Or if using MongoDB Atlas, use MongoDB Compass
# Connect with your connection string

# Switch to database
use employee_management

# Check users
db.users.find().pretty()
```

**Option 2: Check via API**
```bash
# Start your server
cd server
npm run dev

# In another terminal, test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@company.com","password":"admin123"}'
```

### Step 5: Test Login

1. **Start Backend:**
   ```bash
   cd server
   npm run dev
   ```
   Should see: `✅ MongoDB Connected: ...`

2. **Start Frontend:**
   ```bash
   npm run dev
   ```

3. **Try Login:**
   - Email: `admin@company.com`
   - Password: `admin123`

---

## 🔍 Troubleshooting

### Issue: "MongoDB Connection Error"

**Solutions:**
1. **Local MongoDB not running:**
   ```bash
   # Windows: Start MongoDB service
   net start MongoDB
   
   # Or start manually
   mongod
   ```

2. **Wrong connection string:**
   - Check `server/.env` file
   - Verify `MONGODB_URI` is correct
   - For Atlas: Check IP whitelist

3. **MongoDB not installed:**
   - Download from: https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud)

### Issue: "Invalid credentials" when login

**Solutions:**
1. **Database not seeded:**
   ```bash
   cd server
   npm run seed
   ```

2. **Wrong credentials:**
   - Use: `admin@company.com` / `admin123`
   - Or check what was created: `db.users.find().pretty()`

3. **Email case mismatch:**
   - ✅ FIXED: Now handles case-insensitive emails

### Issue: "User not found"

**Solutions:**
1. **Check if user exists:**
   ```javascript
   // In MongoDB shell
   db.users.find({ email: "admin@company.com" })
   ```

2. **Re-seed database:**
   ```bash
   cd server
   npm run seed
   ```

### Issue: Backend starts but can't connect to MongoDB

**Check:**
1. MongoDB service is running
2. Connection string in `.env` is correct
3. Firewall isn't blocking port 27017
4. For Atlas: IP is whitelisted

---

## 📊 Database Structure

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, lowercase),
  password: String (hashed),
  role: "admin" | "employee",
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Tasks Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String,
  priority: "low" | "medium" | "high" | "urgent",
  status: "new" | "active" | "completed" | "failed",
  assignedTo: ObjectId (ref: User),
  assignedBy: ObjectId (ref: User),
  dueDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## ✅ Verification Checklist

- [ ] MongoDB is installed and running (or Atlas cluster is active)
- [ ] `server/.env` file exists with `MONGODB_URI`
- [ ] Backend starts without connection errors
- [ ] Database is seeded (`npm run seed` completed successfully)
- [ ] Can see users in database: `db.users.find().pretty()`
- [ ] Login works with `admin@company.com` / `admin123`
- [ ] Login works with `john@company.com` / `123456`

---

## 🎓 What You Learned

### 1. **MongoDB vs localStorage**
- **Before:** Data stored in browser localStorage (lost on clear)
- **Now:** Data stored in MongoDB database (persistent, shared)
- **Benefit:** Data persists, can be accessed from any device, secure

### 2. **Database Seeding**
- Seeds create initial data for development
- Must run `npm run seed` after setting up database
- Seeds clear old data and create fresh users/tasks

### 3. **Email Normalization**
- Always normalize emails (lowercase) for consistency
- Prevents duplicate accounts with different cases
- Makes login case-insensitive

### 4. **Password Security**
- Passwords are hashed with bcrypt (never stored plain text)
- Hashing happens automatically via Mongoose pre-save hook
- Comparison uses `comparePassword()` method

---

## 🚀 Next Steps

1. **Run the seed script:**
   ```bash
   cd server
   npm run seed
   ```

2. **Verify users were created:**
   - Check MongoDB or try logging in

3. **Test login:**
   - Use credentials from README
   - Should work now!

4. **If still having issues:**
   - Check backend console for errors
   - Check browser console (F12) for API errors
   - Verify MongoDB connection in backend logs

---

## 📝 Summary

**Your database setup is CORRECT!** The issue was:
1. ✅ Email mismatch (now fixed)
2. ✅ Case-sensitive lookup (now fixed)
3. ⚠️ Database might not be seeded (run `npm run seed`)

**Action Required:**
1. Make sure MongoDB is running
2. Run `cd server && npm run seed`
3. Try logging in with `admin@company.com` / `admin123`

Your MongoDB integration is properly implemented! 🎉

