# 🚀 Quick Deployment Cheatsheet

## ⚡ TL;DR - Deploy in 15 Minutes

### 1️⃣ Setup MongoDB Atlas (5 min)

```bash
1. Go to cloud.mongodb.com → Sign up
2. Create FREE cluster (M0)
3. Database Access → Add User → Save password
4. Network Access → Allow 0.0.0.0/0
5. Connect → Get connection string
```

### 2️⃣ Deploy Backend to Render (5 min)

```bash
1. Go to render.com → Sign up
2. New Web Service → Connect GitHub repo
3. Settings:
   - Root Directory: server
   - Build: npm install
   - Start: npm start
4. Environment Variables:
   - MONGODB_URI=<your-mongo-string>
   - JWT_SECRET=<generate-long-random-string>
   - NODE_ENV=production
   - CLIENT_URL=https://your-app.vercel.app
5. Create Service → Copy URL
```

### 3️⃣ Deploy Frontend to Vercel (5 min)

```bash
# Option A: CLI
npm i -g vercel
vercel login
vercel --prod

# Option B: Dashboard
1. Go to vercel.com → Import GitHub repo
2. Framework: Vite
3. Environment Variable:
   - VITE_API_URL=https://your-backend.onrender.com/api
4. Deploy
```

---

## 📋 Pre-Deployment Checklist

### Code Quality

- [ ] All tests passing (`npm run test`)
- [ ] No console errors in browser
- [ ] Lint errors fixed (`npm run lint`)
- [ ] Production build successful (`npm run build:prod`)

### Configuration

- [ ] MongoDB Atlas cluster created
- [ ] Connection string obtained
- [ ] JWT secret generated (32+ chars)
- [ ] Environment variables documented

### Security

- [ ] No hardcoded secrets in code
- [ ] `.env` files in `.gitignore`
- [ ] CORS configured for production domain
- [ ] Rate limiting enabled

### Git

- [ ] All changes committed
- [ ] Pushed to GitHub main branch
- [ ] Repository public or connected to hosting platform

---

## 🔧 Environment Variables Reference

### Frontend (.env.production)

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

### Backend (Render/Railway)

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=<super-long-random-string-min-32-chars>
JWT_EXPIRE=7d
CLIENT_URL=https://your-app.vercel.app
```

**Generate JWT Secret:**

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# OpenSSL
openssl rand -base64 64

# Online
https://randomkeygen.com/ (use "CodeIgniter Encryption Keys")
```

---

## 🌐 Deployment URLs

After deployment, save these URLs:

| Service      | URL                              | Purpose             |
| ------------ | -------------------------------- | ------------------- |
| **Frontend** | `https://[project].vercel.app`   | User-facing website |
| **Backend**  | `https://[project].onrender.com` | API server          |
| **Database** | MongoDB Atlas Dashboard          | Database management |

---

## 🧪 Post-Deployment Testing

### Quick Health Checks

```bash
# Backend health
curl https://your-backend.onrender.com/api/health
# Expected: {"success":true,"message":"API is running"}

# Frontend loading
curl -I https://your-app.vercel.app
# Expected: HTTP/2 200
```

### Full Flow Test

1. ✅ Visit frontend URL
2. ✅ Register new admin account
3. ✅ Login successfully
4. ✅ Create employee
5. ✅ Assign task
6. ✅ Logout/Login as employee
7. ✅ View assigned tasks

---

## ⚠️ Common Issues & Quick Fixes

### Issue: CORS Error

```javascript
// Symptom: "Access-Control-Allow-Origin" error in console
// Fix: Update CLIENT_URL in backend to match Vercel URL exactly
CLIENT_URL=https://your-app.vercel.app  // ✅ Correct
CLIENT_URL=https://your-app.vercel.app/ // ❌ Wrong (trailing slash)
```

### Issue: 401 Unauthorized

```javascript
// Symptom: API returns 401 on all requests
// Fix: Check JWT_SECRET is set in backend and is long enough (32+ chars)
```

### Issue: Database Connection Failed

```javascript
// Symptom: Backend logs show "MongooseServerSelectionError"
// Fix:
1. Check MongoDB IP whitelist includes 0.0.0.0/0
2. Verify connection string format
3. Test connection string locally first
```

### Issue: Build Failed on Vercel

```javascript
// Symptom: Vercel build fails with module errors
// Fix:
1. Ensure package.json has all dependencies (not devDependencies)
2. Check Node version compatibility
3. Clear cache and redeploy
```

### Issue: Backend Keeps Sleeping (Render Free Tier)

```javascript
// Symptom: First request takes 30-60 seconds
// Fix:
1. Upgrade to paid tier ($7/month for always-on)
2. Use UptimeRobot to ping every 10 minutes
3. Implement frontend loading state for cold starts
```

---

## 🔄 Update Deployment

### Frontend Update

```bash
git add .
git commit -m "Update feature"
git push origin main
# Vercel auto-deploys in ~2 minutes
```

### Backend Update

```bash
git push origin main
# Render auto-deploys in ~5 minutes
# Check logs in Render dashboard
```

### Rollback Deployment

```bash
# Vercel: Dashboard → Deployments → Previous deploy → Promote to Production
# Render: Dashboard → Rollback to previous commit
```

---

## 📊 Monitoring Commands

### View Logs

```bash
# Vercel (via CLI)
vercel logs

# Render
# Go to Dashboard → Service → Logs tab

# MongoDB Atlas
# Go to Atlas → Metrics tab
```

### Check Service Status

```bash
# All services up?
curl https://your-backend.onrender.com/api/health
curl -I https://your-app.vercel.app
```

---

## 💰 Cost Breakdown (Free Tier)

| Service           | Free Tier    | Limits                                         |
| ----------------- | ------------ | ---------------------------------------------- |
| **Vercel**        | ✅ Free      | 100GB bandwidth, unlimited deployments         |
| **Render**        | ✅ Free      | 750 hours/month, sleeps after 15min inactivity |
| **MongoDB Atlas** | ✅ Free      | 512MB storage, shared cluster                  |
| **Total**         | **$0/month** | Sufficient for development & small projects    |

### When to Upgrade?

- Backend needs to be always-on → Render ($7/month)
- More database storage/speed → MongoDB Atlas ($9/month)
- Custom domain SSL → Included free on Vercel/Render
- High traffic (>100GB/month) → Vercel Pro ($20/month)

---

## 🎯 Performance Optimization

### Frontend

- [ ] Enable code splitting (Vite does this automatically)
- [ ] Lazy load routes with React.lazy()
- [ ] Optimize images (use WebP format)
- [ ] Enable Vercel Analytics

### Backend

- [ ] Add database indexes for frequent queries
- [ ] Implement Redis caching (optional)
- [ ] Enable compression middleware (already configured)
- [ ] Monitor response times in Render metrics

### Database

- [ ] Create indexes on User.email and Task.assignedTo
- [ ] Enable replica set (paid tier)
- [ ] Regular backups configured

---

## 🆘 Get Help

- **Vercel Issues**: [vercel.com/support](https://vercel.com/support)
- **Render Issues**: [render.com/docs](https://render.com/docs)
- **MongoDB Issues**: [mongodb.com/docs](https://docs.mongodb.com/)

---

**Created**: February 2026  
**Last Updated**: February 2026  
**Maintained by**: Your Team
