# Employee Management System - User Guide

## 🚀 Getting Started

### Prerequisites

- Backend server running on `http://localhost:5000`
- Frontend running on `http://localhost:5173`

---

## 📝 Company Registration (Signup)

### Step 1: Access the Landing Page

1. Open your browser and navigate to: `http://localhost:5173`
2. You'll see the **Landing Page** with a 3D animated sphere
3. Click the **"Get Started"** button or **"Sign Up"** in the navigation menu

### Step 2: Company Registration Form

You'll be redirected to `/register-company` with a **2-step registration process**:

#### **Step 1: Company Information**

Fill in the following details:

- **Company Name**: Your organization name (e.g., "Tech Solutions Inc")
- **Email**: Company email address (e.g., "admin@techsolutions.com")
- **Industry**: Select from dropdown:
  - Technology
  - Healthcare
  - Finance
  - Education
  - Retail
  - Manufacturing
  - Services
  - Other
- **Company Size**: Select from dropdown:
  - 1-10 employees (Free Plan)
  - 11-50 employees (Professional Plan)
  - 51-100 employees (Professional Plan)
  - 100+ employees (Enterprise Plan)

Click **"Next"** to proceed to Step 2.

#### **Step 2: Admin Account Setup**

Create your admin account:

- **Full Name**: Your name (e.g., "John Doe")
- **Email**: Your admin email (can be same as company email)
- **Password**: Strong password (minimum 6 characters)
- **Confirm Password**: Re-enter your password

Click **"Create Account"** to complete registration.

### Step 3: Automatic Login

After successful registration:

- ✅ Your company is created
- ✅ Your admin account is created
- ✅ You're automatically logged in
- ✅ Redirected to **Admin Dashboard** at `/admin-dashboard`

---

## 🔐 Login Process

### Method 1: From Landing Page

1. Navigate to `http://localhost:5173`
2. Click **"Login"** button in the top-right corner
3. You'll be redirected to `/login`

### Method 2: Direct Login URL

Navigate directly to: `http://localhost:5173/login`

### Login Form

Enter your credentials:

- **Email**: Your registered email
- **Password**: Your account password

Click **"Sign In"** to log in.

### Post-Login Redirect

After successful login, you'll be redirected based on your role:

- **Admin**: `/admin-dashboard` (Admin Dashboard)
- **Employee**: `/employee-dashboard` (Employee Dashboard)

---

## 🏢 Multi-Tenant System Explained

### What is Multi-Tenancy?

Your Employee Management System supports **multiple companies** on the same platform:

- Each company has its own **isolated data**
- Companies cannot see each other's employees or tasks
- Each company has its own **admin** and **employees**

### Subscription Plans

#### **Free Plan** (1-10 employees)

- Up to **10 employees**
- Up to **100 tasks**
- Basic features

#### **Professional Plan** (11-100 employees)

- Up to **100 employees**
- Up to **1000 tasks**
- Advanced features

#### **Enterprise Plan** (100+ employees)

- **Unlimited employees**
- **Unlimited tasks**
- All features + priority support

---

## 👤 User Roles

### Admin Role

**What can admins do?**

- ✅ Create, edit, and delete employees
- ✅ Create, assign, and manage all tasks
- ✅ View company statistics
- ✅ Manage company profile
- ✅ View all employees' tasks
- ✅ Reset employee passwords

**Admin Dashboard Features:**

- **Dashboard Tab**: Overview statistics
- **All Tasks Tab**: Manage all company tasks
- **Create Task Tab**: Create new tasks
- **Employees Tab**: Manage employees (PENDING IMPLEMENTATION)

### Employee Role

**What can employees do?**

- ✅ View assigned tasks
- ✅ Accept tasks
- ✅ Mark tasks as completed
- ✅ Mark tasks as failed
- ✅ View their own statistics

**Employee Dashboard Features:**

- View tasks assigned to them
- Update task status
- Track their performance

---

## 🔄 Complete User Flow Example

### Scenario: Setting Up Your Company

#### 1. **Company Registration**

```
Navigate to: http://localhost:5173
↓
Click "Get Started" or "Sign Up"
↓
Fill Company Info:
  - Company Name: "Tech Solutions Inc"
  - Email: "admin@techsolutions.com"
  - Industry: "Technology"
  - Company Size: "11-50 employees" (Professional Plan)
↓
Click "Next"
↓
Fill Admin Account:
  - Full Name: "John Doe"
  - Email: "john@techsolutions.com"
  - Password: "SecurePass123"
  - Confirm Password: "SecurePass123"
↓
Click "Create Account"
↓
✅ Automatically logged in → Admin Dashboard
```

#### 2. **Add Employees** (Coming Soon)

```
Admin Dashboard
↓
Click "Employees" tab
↓
Click "Add Employee" button
↓
Fill employee details:
  - Name: "Jane Smith"
  - Email: "jane@techsolutions.com"
  - Password: "TempPass123"
  - Role: "Employee"
↓
Click "Create"
↓
✅ Employee created and email sent
```

#### 3. **Create Tasks**

```
Admin Dashboard
↓
Click "Create Task" tab
↓
Fill task details:
  - Title: "Setup Development Environment"
  - Description: "Install required tools and dependencies"
  - Category: "Development"
  - Priority: "High"
  - Assign To: Select "Jane Smith"
  - Deadline: Select date
↓
Click "Create Task"
↓
✅ Task created and employee notified
```

#### 4. **Employee Login and Task Management**

```
Employee logs in:
  - Email: "jane@techsolutions.com"
  - Password: "TempPass123"
↓
Redirected to: Employee Dashboard
↓
Views assigned task: "Setup Development Environment"
↓
Clicks "Accept" → Status: Active
↓
Completes work → Clicks "Complete" → Status: Completed
```

---

## 🔑 Important Features

### Password Reset Flow

1. On login page, click **"Forgot Password?"**
2. Enter your email address
3. Click **"Send Reset Link"**
4. Check your email for reset link
5. Click the link (format: `/reset-password/:token`)
6. Enter new password
7. Click **"Reset Password"**
8. ✅ Auto-logged in with new password

### Data Isolation

- **Your company's data is completely isolated**
- Two companies can have employees with the same email
- Uniqueness is enforced within each company only
- Example:
  - Company A: john@example.com ✅
  - Company B: john@example.com ✅ (Different company, allowed)
  - Company A: john@example.com ❌ (Duplicate in same company)

### Email Notifications

Automatic emails are sent for:

- 📧 New task assignment
- 📧 Employee account creation
- 📧 Password reset requests
- 📧 Task updates (accept, complete, fail)

---

## 🛠️ Troubleshooting

### "Failed to fetch" Error

**Problem**: Frontend can't connect to backend

**Solution**:

```bash
# Make sure backend is running:
cd server
npm run dev

# Backend should show:
✅ MongoDB Connected
🚀 Server: http://localhost:5000
```

### "Email already exists" Error

**Problem**: Trying to register with email already used in your company

**Solution**:

- Use a different email address
- OR login with existing credentials
- Remember: Same email can exist in different companies

### Can't See Other Company's Data

**This is by design!** Multi-tenancy ensures:

- Company A cannot see Company B's employees
- Company A cannot see Company B's tasks
- Each company operates independently

### Session Persistence

Your login session is stored in:

- **localStorage**: `loggedInUser`, `token`, `company`
- **Automatic logout**: Token expires after 7 days
- **Manual logout**: Clear session data

---

## 📊 What's Next?

### Currently Available ✅

- ✅ Landing page with 3D animation
- ✅ Company registration (multi-tenant)
- ✅ Login/Logout
- ✅ Password reset flow
- ✅ Admin dashboard (tasks management)
- ✅ Employee dashboard
- ✅ Task CRUD operations

### Coming Soon 🚧

- 🚧 Employee Management UI (in Admin Dashboard)
- 🚧 Employee List/Create/Edit/Delete
- 🚧 Advanced statistics and charts
- 🚧 Company profile management
- 🚧 Employee performance reports

---

## 📱 Quick Reference

### URLs

| Route                    | Access        | Description            |
| ------------------------ | ------------- | ---------------------- |
| `/`                      | Public        | Landing page           |
| `/register-company`      | Public        | Company signup         |
| `/login`                 | Public        | Login page             |
| `/forgot-password`       | Public        | Password reset request |
| `/reset-password/:token` | Public        | Password reset form    |
| `/admin-dashboard`       | Admin only    | Admin dashboard        |
| `/employee-dashboard`    | Employee only | Employee dashboard     |

### Default Ports

- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:5000`
- **Database**: MongoDB Atlas (cloud)

### Subscription Limits

| Plan         | Employees | Tasks     |
| ------------ | --------- | --------- |
| Free         | 10        | 100       |
| Professional | 100       | 1,000     |
| Enterprise   | Unlimited | Unlimited |

---

## 💡 Tips

1. **Strong Passwords**: Use passwords with at least 6 characters (mix of letters, numbers, symbols recommended)
2. **Email Verification**: Make sure you have access to the email you register with
3. **Company Slug**: Auto-generated from company name (e.g., "Tech Solutions" → "tech-solutions")
4. **First User is Admin**: The person who registers the company becomes the admin
5. **Add Employees**: Only admins can add new employees to the company

---

## 🆘 Need Help?

If you encounter issues:

1. Check browser console (F12 → Console tab)
2. Check backend terminal for error messages
3. Verify MongoDB connection
4. Ensure both frontend and backend are running
5. Clear browser cache and localStorage if needed

---

**Happy Managing! 🎉**
