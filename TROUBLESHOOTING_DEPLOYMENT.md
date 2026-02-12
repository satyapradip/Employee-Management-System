# 🔧 Deployment Troubleshooting Guide

## Common Issue: "Something went wrong" + Authentication Error

### 🎯 Quick Fix Checklist

#### ✅ Step 1: Verify Backend is Running

Open your browser and visit:

```
https://YOUR-RENDER-URL.onrender.com/api/health
```

**Expected Response:**

```json
{ "success": true, "message": "API is running" }
```

**If you get an error:**

- ⏰ **503 Service Unavailable**: Backend is waking up (wait 30-60 seconds on free tier)
- ❌ **404 Not Found**: Wrong URL or backend deployment failed
- ⚠️ **No response**: Backend not deployed correctly

---

#### ✅ Step 2: Check Vercel Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click your project
3. Go to **Settings** → **Environment Variables**
4. Verify `VITE_API_URL` exists and is correct:

**Correct Format:**

```
VITE_API_URL=https://your-backend.onrender.com/api
```

**Common Mistakes:**

```
❌ http://your-backend.onrender.com/api   (missing 's' in https)
❌ https://your-backend.onrender.com      (missing /api at end)
❌ https://your-backend.onrender.com/api/ (extra / at end)
```

**After fixing, you MUST redeploy:**

- Deployments tab → Click "..." → **Redeploy**

---

#### ✅ Step 3: Check Render Environment Variables

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click your backend service
3. Go to **Environment** tab
4. Verify these are set:

| Variable      | Should Be                                          |
| ------------- | -------------------------------------------------- |
| `NODE_ENV`    | `production`                                       |
| `PORT`        | `5000`                                             |
| `MONGODB_URI` | `mongodb+srv://...` (your Atlas connection string) |
| `JWT_SECRET`  | Long random string (128 characters)                |
| `JWT_EXPIRE`  | `7d`                                               |
| `CLIENT_URL`  | `https://your-app.vercel.app` (NO trailing slash)  |

**If CLIENT_URL is wrong:**

- Update it to your EXACT Vercel URL
- Service will auto-redeploy

---

#### ✅ Step 4: Check Browser Console for Errors

1. Open your Vercel site
2. Press **F12** (Developer Tools)
3. Go to **Console** tab
4. Look for errors

**Common Errors & Fixes:**

##### Error: "CORS policy: No 'Access-Control-Allow-Origin'"

**Cause:** CLIENT_URL in Render doesn't match your Vercel URL

**Fix:**

1. Go to Render → Your Service → Environment
2. Update `CLIENT_URL` to exact Vercel URL
3. Wait for auto-redeploy (2-3 minutes)

##### Error: "Failed to fetch" or "Network Error"

**Cause:** VITE_API_URL is wrong or backend is down

**Fix:**

1. Test backend URL in browser
2. Update `VITE_API_URL` in Vercel
3. Redeploy Vercel

##### Error: "401 Unauthorized"

**Cause:** JWT_SECRET too short or not set

**Fix:**

1. Go to Render → Environment
2. Generate new JWT_SECRET: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
3. Paste the 128-character string
4. Wait for auto-redeploy

##### Error: "Cannot read properties of undefined"

**Cause:** API not responding correctly

**Fix:**

1. Check backend logs in Render
2. Verify MongoDB connection string is correct
3. Check MongoDB Atlas IP whitelist (should allow 0.0.0.0/0)

---

## 🔍 Detailed Debugging Steps

### Test Backend Directly

Open PowerShell and test:

```powershell
# Test health endpoint
curl https://YOUR-RENDER-URL.onrender.com/api/health

# Test registration (should work)
curl -X POST https://YOUR-RENDER-URL.onrender.com/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"Test\",\"email\":\"test@test.com\",\"password\":\"Test123!\"}'
```

### Check Vercel Deployment Logs

1. Vercel Dashboard → Your Project
2. Click latest deployment
3. Look for build errors
4. Check **Function Logs** for runtime errors

### Check Render Deployment Logs

1. Render Dashboard → Your Service
2. Click **Logs** tab
3. Look for:
   - `Server running on port 5000` ✅
   - `MongoDB Connected` ✅
   - Any error messages ❌

---

## 🛠️ Step-by-Step Fix Procedure

### If Backend Won't Start:

1. **Check Render Logs:**

   ```
   Look for: "MongoServerError" → Fix MONGODB_URI
   Look for: "EADDRINUSE" → Service crashed, click "Manual Deploy"
   ```

2. **Verify package.json start command:**

   ```json
   "start": "node server.js"  // Should be in server/package.json
   ```

3. **Check Root Directory setting:**
   ```
   Should be: server
   NOT: ./ or empty
   ```

### If Frontend Can't Connect:

1. **Re-add Environment Variable in Vercel:**

   ```bash
   # Settings → Environment Variables → Add
   Name: VITE_API_URL
   Value: https://your-backend.onrender.com/api
   Target: Production, Preview, Development (check all)
   ```

2. **Trigger Redeploy:**
   ```bash
   # Deployments → Latest → Redeploy
   # OR
   git commit --allow-empty -m "Trigger redeploy"
   git push
   ```

### If CORS Errors Persist:

1. **Double-check CLIENT_URL in Render:**

   ```bash
   # Must be EXACT match (case-sensitive, no trailing slash)
   CLIENT_URL=https://employee-management-system.vercel.app

   # NOT:
   # https://employee-management-system.vercel.app/
   # http://employee-management-system.vercel.app
   ```

2. **Wait for Backend Redeploy:**
   - Render auto-deploys when env vars change
   - Check Logs tab for "Build succeeded"
   - Wait for "Live" status

---

## 🧪 Testing After Fixes

### 1. Test Backend Health

```bash
https://your-backend.onrender.com/api/health
# Should return: {"success":true,"message":"API is running"}
```

### 2. Open Vercel Site

```bash
https://your-app.vercel.app
# Should load without errors
```

### 3. Check Console (F12)

```bash
# Should see:
✓ No CORS errors
✓ No network errors
✓ API requests going to correct URL
```

### 4. Try Registration

```bash
1. Click "Register as Company"
2. Fill form and submit
3. Should succeed without errors
```

---

## 📊 Environment Variables Reference

### Vercel (.env.production)

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

### Render (Backend)

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/employee_management
JWT_SECRET=<128-character-random-string>
JWT_EXPIRE=7d
CLIENT_URL=https://your-app.vercel.app
```

---

## 🚨 Still Not Working?

### Collect This Information:

1. **Backend URL:** **************\_\_**************
2. **Vercel URL:** **************\_\_**************
3. **Browser Console Error:** **************\_\_**************
4. **Render Logs Error:** **************\_\_**************

### Nuclear Option (Start Fresh):

```powershell
# 1. Delete and recreate Render service
# 2. Delete and recreate Vercel project
# 3. Use exact URLs from this guide
# 4. Wait 5 minutes after each deployment
```

---

## ✅ Success Checklist

- [ ] Backend health endpoint returns 200 OK
- [ ] VITE_API_URL set correctly in Vercel
- [ ] CLIENT_URL set correctly in Render
- [ ] No CORS errors in browser console
- [ ] Registration works without errors
- [ ] Login works and shows dashboard
- [ ] Both services show "Live" status

---

**Last Updated:** February 13, 2026  
**Your deployment should work after following these steps!** 🎉
