# 🚀 DEPLOYMENT GUIDE - Employee Management System

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Part 1: Database Setup (MongoDB Atlas)](#part-1-database-setup-mongodb-atlas)
- [Part 2: Backend Deployment (Render)](#part-2-backend-deployment-render)
- [Part 3: Frontend Deployment (Vercel)](#part-3-frontend-deployment-vercel)
- [Part 4: Post-Deployment Testing](#part-4-post-deployment-testing)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This guide will help you deploy your full-stack Employee Management System:

- **Frontend**: Vercel (React + Vite)
- **Backend**: Render or Railway (Express + Node.js)
- **Database**: MongoDB Atlas (Cloud Database)

**Total Time**: ~30-45 minutes

---

## ✅ Prerequisites

Before starting, ensure you have:

- [ ] GitHub account (for code hosting)
- [ ] Vercel account (free tier) - [Sign up](https://vercel.com/signup)
- [ ] MongoDB Atlas account (free tier) - [Sign up](https://www.mongodb.com/cloud/atlas/register)
- [ ] Render account (free tier) - [Sign up](https://render.com/register)
- [ ] Your code pushed to a GitHub repository

---

## 🗄️ Part 1: Database Setup (MongoDB Atlas)

### Step 1.1: Create a Cluster

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click **"Build a Database"**
3. Choose **FREE (M0)** tier
4. Select your preferred region (closest to your users)
5. Click **"Create Cluster"**

### Step 1.2: Create Database User

1. Go to **Database Access** (left sidebar)
2. Click **"Add New Database User"**
3. Choose **Password** authentication
4. Set username: `employee_admin`
5. Click **"Autogenerate Secure Password"** and **save it securely**
6. Set privileges: **"Read and write to any database"**
7. Click **"Add User"**

### Step 1.3: Whitelist IP Addresses

1. Go to **Network Access** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ In production, restrict to your server's IP
4. Click **"Confirm"**

### Step 1.4: Get Connection String

1. Go to **Database** → **Connect**
2. Choose **"Connect your application"**
3. Copy the connection string (looks like):
   ```
   mongodb+srv://employee_admin:<password>@cluster0.xxxxx.mongodb.net/
   ```
4. Replace `<password>` with your actual password
5. Add database name: `employee_management` at the end
6. **Save this connection string** - you'll need it for backend deployment

**Final format**:

```
mongodb+srv://employee_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/employee_management
```

---

## 🖥️ Part 2: Backend Deployment (Render)

### Step 2.1: Push Code to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Ready for deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### Step 2.2: Create Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

   **Basic Settings**:
   - **Name**: `employee-management-api`
   - **Region**: Select closest to your users
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

   **Environment**:
   - Click **"Advanced"** → **"Add Environment Variable"**
   - Add the following variables:

   | Key           | Value                                                                                |
   | ------------- | ------------------------------------------------------------------------------------ |
   | `NODE_ENV`    | `production`                                                                         |
   | `PORT`        | `5000`                                                                               |
   | `MONGODB_URI` | Your MongoDB Atlas connection string                                                 |
   | `JWT_SECRET`  | Generate: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
   | `JWT_EXPIRE`  | `7d`                                                                                 |
   | `CLIENT_URL`  | `https://your-app.vercel.app` (update after frontend deployment)                     |

5. Click **"Create Web Service"**

### Step 2.3: Wait for Deployment

- Render will automatically build and deploy
- Wait ~5-10 minutes
- Once deployed, you'll get a URL like: `https://employee-management-api.onrender.com`
- **Save this URL** - you'll need it for frontend

### Step 2.4: Test Backend

```bash
# Test health endpoint
curl https://employee-management-api.onrender.com/api/health

# Should return:
# {"success":true,"message":"API is running"}
```

---

## 🌐 Part 3: Frontend Deployment (Vercel)

### Step 3.1: Update Environment Variable

1. Open `.env.production` file
2. Update `VITE_API_URL` with your Render backend URL:
   ```env
   VITE_API_URL=https://employee-management-api.onrender.com/api
   ```
3. Commit the change:
   ```bash
   git add .env.production
   git commit -m "Update production API URL"
   git push
   ```

### Step 3.2: Deploy to Vercel

**Option A: Using Vercel CLI (Recommended)**

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? employee-management-system
# - In which directory is your code? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

**Option B: Using Vercel Dashboard**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add **Environment Variables**:
   - Key: `VITE_API_URL`
   - Value: `https://employee-management-api.onrender.com/api`
6. Click **"Deploy"**

### Step 3.3: Get Vercel URL

- After deployment, you'll get a URL like: `https://employee-management-system.vercel.app`
- **Update Backend CORS**:
  1. Go back to Render dashboard
  2. Navigate to your backend service
  3. Update `CLIENT_URL` environment variable to your Vercel URL
  4. Render will auto-redeploy

---

## ✅ Part 4: Post-Deployment Testing

### 4.1 Update Backend CORS

```bash
# Go to Render → Your Service → Environment
# Update CLIENT_URL to your Vercel URL
CLIENT_URL=https://employee-management-system.vercel.app
```

### 4.2 Seed Database (Optional)

```bash
# SSH into Render (or use local connection)
# Update MONGODB_URI in local .env to production database
npm run seed
```

### 4.3 Test Complete Flow

1. **Open Frontend**: `https://employee-management-system.vercel.app`
2. **Register Admin Account**:
   - Click "Register as Company"
   - Fill in company details
   - Submit
3. **Login**:
   - Use registered email/password
   - Should redirect to dashboard
4. **Create Employee**:
   - Go to Employees tab
   - Add new employee
   - Verify creation
5. **Create Task**:
   - Go to Create Task tab
   - Assign to employee
   - Submit

---

## 🐛 Troubleshooting

### Issue: 401 Unauthorized Errors

**Solution**:

```bash
# Check JWT_SECRET is set in Render
# Ensure it's at least 32 characters long
```

### Issue: CORS Errors

**Solution**:

```bash
# Verify CLIENT_URL in Render matches your Vercel URL exactly
# No trailing slash
CLIENT_URL=https://employee-management-system.vercel.app
```

### Issue: Database Connection Failed

**Solution**:

- Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Check MONGODB_URI format and password
- Test connection string locally first

### Issue: API Returns 404

**Solution**:

- Check API base URL in frontend
- Should be: `https://your-backend.onrender.com/api`
- NOT: `https://your-backend.onrender.com` (missing /api)

### Issue: Render Free Tier Spins Down

**Solution**:

- Free tier sleeps after 15 minutes of inactivity
- First request takes ~30-60 seconds to wake up
- Upgrade to paid tier for always-on service
- Or use a service like [UptimeRobot](https://uptimerobot.com/) to ping every 10 minutes

---

## 📊 Monitoring & Maintenance

### Backend Logs (Render)

```bash
# View real-time logs
Go to Render Dashboard → Your Service → Logs
```

### Frontend Analytics (Vercel)

```bash
# View deployment logs and analytics
Go to Vercel Dashboard → Your Project → Deployments
```

### Database Monitoring (MongoDB Atlas)

```bash
# Monitor database performance
Go to MongoDB Atlas → Metrics
```

---

## 🎉 Congratulations!

Your Employee Management System is now live!

- **Frontend**: https://employee-management-system.vercel.app
- **Backend**: https://employee-management-api.onrender.com
- **Database**: MongoDB Atlas (Cloud)

### Next Steps:

- [ ] Set up custom domain (optional)
- [ ] Enable HTTPS (auto-enabled on Vercel)
- [ ] Set up CI/CD pipelines
- [ ] Configure monitoring alerts
- [ ] Implement backup strategy
- [ ] Add rate limiting for production
- [ ] Enable database backups on Atlas

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

**Need Help?** Check the troubleshooting section or review deployment logs for specific errors.
