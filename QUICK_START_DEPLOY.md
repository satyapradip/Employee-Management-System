# 🚀 QUICK START - Deploy in 30 Minutes

## 📋 What You'll Need

- GitHub account
- Vercel account (free)
- MongoDB Atlas account (free)
- Render account (free)

---

## ⚡ Step-by-Step (30 minutes)

### STEP 1: MongoDB Atlas Setup (7 minutes)

```bash
1. Go to: https://cloud.mongodb.com
2. Sign up / Login
3. Click "Build a Database"
4. Choose FREE (M0 tier)
5. Select region closest to you
6. Click "Create Cluster"
```

**Create User**:

```bash
1. Database Access → Add New Database User
2. Username: employee_admin
3. Click "Autogenerate Secure Password"
4. SAVE THIS PASSWORD! You'll need it!
5. Built-in Role: "Read and write to any database"
6. Click "Add User"
```

**Allow Access**:

```bash
1. Network Access → Add IP Address
2. Click "Allow Access from Anywhere"
3. Confirm
```

**Get Connection String**:

```bash
1. Database → Connect → Drivers
2. Copy the connection string
3. It looks like: mongodb+srv://employee_admin:<password>@cluster0.xxxxx.mongodb.net/
4. Replace <password> with your actual password
5. Add database name at end: /employee_management
```

**Final String**:

```
mongodb+srv://employee_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/employee_management
```

✅ **Save this string - you'll need it for Step 2!**

---

### STEP 2: Backend Deployment - Render (8 minutes)

```bash
1. Go to: https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
```

**Configuration**:

```
Name: employee-management-api
Region: Oregon (or closest to you)
Branch: main
Root Directory: server
Runtime: Node
Build Command: npm install
Start Command: npm start
Instance Type: Free
```

**Environment Variables** (Click "Advanced" → "Add Environment Variable"):

| Key           | Value                                    |
| ------------- | ---------------------------------------- |
| `NODE_ENV`    | `production`                             |
| `PORT`        | `5000`                                   |
| `MONGODB_URI` | Your MongoDB string from Step 1          |
| `JWT_SECRET`  | Click below to generate ⬇️               |
| `JWT_EXPIRE`  | `7d`                                     |
| `CLIENT_URL`  | `https://temp.com` (update after Step 3) |

**Generate JWT_SECRET**:

```bash
# Open PowerShell and run:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Copy the output (looks like: a7f8d9e3c2b1...)
# Paste into JWT_SECRET value
```

```bash
5. Click "Create Web Service"
6. Wait 3-5 minutes for deployment
7. Copy your backend URL (looks like: https://employee-management-api.onrender.com)
8. ✅ SAVE THIS URL!
```

**Test Backend**:

```bash
# Open browser and go to:
https://your-backend-url.onrender.com/api/health

# Should see: {"success":true,"message":"API is running"}
```

---

### STEP 3: Frontend Deployment - Vercel (10 minutes)

#### Option A: Using Vercel CLI (Faster)

```powershell
# Install Vercel CLI
npm install -g vercel

# Login
vercel login
# Follow the browser login process

# Deploy
vercel

# Answer prompts:
Set up and deploy? → Yes
Which scope? → Your account
Link to existing project? → No
Project name? → employee-management-system
In which directory? → ./ (press Enter)
Want to override settings? → No

# Deploy to Production
vercel --prod
```

#### Option B: Using Vercel Dashboard

```bash
1. Go to: https://vercel.com
2. Sign up with GitHub
3. Click "Add New..." → "Project"
4. Import your GitHub repository
5. Configure:
   - Framework Preset: Vite
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: dist
6. Environment Variables:
   Key: VITE_API_URL
   Value: https://your-backend-url.onrender.com/api
   (Use URL from Step 2!)
7. Click "Deploy"
8. Wait 2-3 minutes
9. Copy your Vercel URL (looks like: https://employee-management-system.vercel.app)
```

---

### STEP 4: Update Backend CORS (2 minutes)

```bash
1. Go back to Render dashboard
2. Click your backend service
3. Environment → Edit
4. Find CLIENT_URL
5. Replace value with your Vercel URL
   CLIENT_URL=https://employee-management-system.vercel.app
6. Click "Save Changes"
7. Service will auto-redeploy (wait 1-2 minutes)
```

---

### STEP 5: Test Everything (3 minutes)

```bash
1. Open your Vercel URL in browser
2. Click "Register as Company"
3. Fill in:
   - Company: Test Corp
   - Name: Admin User
   - Email: admin@test.com
   - Password: Test123!
4. Click Register
5. Login with same credentials
6. Should see Admin Dashboard ✅
```

**Create Test Employee**:

```bash
1. Go to Employees tab
2. Click "Add New Employee"
3. Fill in details
4. Click "Create Employee"
5. Should see employee in list ✅
```

**Create Test Task**:

```bash
1. Go to Create Task tab
2. Fill in task details
3. Assign to employee
4. Click "Create Task"
5. Should see success message ✅
```

---

## 🎉 SUCCESS!

Your app is now LIVE at:

- **Frontend**: https://employee-management-system.vercel.app
- **Backend**: https://employee-management-api.onrender.com
- **Database**: MongoDB Atlas (Cloud)

---

## 📝 Save These URLs

```
Frontend: ________________________________
Backend:  ________________________________
Database: MongoDB Atlas Dashboard
```

---

## ⚠️ Important Notes

### Free Tier Limitations

**Render Free Tier**:

- Backend sleeps after 15 minutes of inactivity
- First request takes 30-60 seconds to wake up
- Solution: Use regularly OR set up ping service

**MongoDB Atlas Free Tier**:

- 512MB storage (good for ~10,000 tasks)
- 100 concurrent connections

**Vercel Free Tier**:

- 100GB bandwidth/month (good for ~10,000 visits)
- Unlimited deployments

---

## 🔧 Next Steps (Optional)

### Add Custom Domain

```bash
# Vercel
1. Settings → Domains → Add
2. Enter your domain
3. Update DNS records as shown
```

### Set Up Monitoring

```bash
# UptimeRobot (free)
1. Go to: uptimerobot.com
2. Add Monitor → HTTP(s)
3. URL: Your backend /api/health endpoint
4. Interval: 5 minutes
```

### Enable Auto-Deploy

```bash
# Already enabled!
# Just push to GitHub:
git add .
git commit -m "Update"
git push origin main

# Vercel and Render auto-deploy on push
```

---

## 🐛 Troubleshooting

### Can't login / 401 errors

```bash
Fix:
1. Check JWT_SECRET is set in Render
2. Should be 64+ characters
3. No special characters causing issues
```

### CORS errors

```bash
Fix:
1. CLIENT_URL in Render MUST match Vercel URL exactly
2. No trailing slash
3. Must start with https://
```

### Backend slow to respond

```bash
Normal on free tier!
- First request takes 30-60 seconds (cold start)
- Subsequent requests are fast
- Upgrade to paid tier ($7/mo) for always-on
```

---

## 💰 Cost Summary

| What             | Where         | Cost         |
| ---------------- | ------------- | ------------ |
| Frontend Hosting | Vercel        | FREE         |
| Backend Hosting  | Render        | FREE         |
| Database         | MongoDB Atlas | FREE         |
| **Total**        | -             | **$0/month** |

Perfect for:

- Development
- Portfolio projects
- Small businesses (< 1000 users)
- MVPs and prototypes

---

## 📞 Need Help?

### Documentation

- Full Guide: DEPLOYMENT.md
- Cheatsheet: DEPLOYMENT_CHEATSHEET.md
- DevOps: DEVOPS_GUIDE.md

### Support

- Vercel: vercel.com/support
- Render: render.com/docs
- MongoDB: docs.atlas.mongodb.com

---

**Deployment Time**: 30 minutes ⏱️  
**Total Cost**: $0/month 💰  
**Status**: Production Ready ✅

---

## ✅ Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created and password saved
- [ ] Backend deployed to Render
- [ ] Environment variables set in Render
- [ ] Frontend deployed to Vercel
- [ ] CLIENT_URL updated in Render
- [ ] Successfully registered and logged in
- [ ] Created test employee
- [ ] Created test task
- [ ] Saved all URLs

**All done?** 🎉 Congratulations! Your app is live!
