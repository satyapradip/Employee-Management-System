# 🛠️ DevOps Best Practices & Operations Guide

## 📋 Table of Contents

- [Monitoring & Logging](#monitoring--logging)
- [Performance Optimization](#performance-optimization)
- [Security Checklist](#security-checklist)
- [Backup & Recovery](#backup--recovery)
- [Scaling Strategy](#scaling-strategy)
- [Incident Response](#incident-response)

---

## 📊 Monitoring & Logging

### Application Monitoring

#### Vercel Analytics (Frontend)

```bash
# Enable in vercel.json (already configured)
# View: Vercel Dashboard → Project → Analytics
```

**Metrics to Monitor**:

- Page load times
- Core Web Vitals (LCP, FID, CLS)
- Geographic distribution
- Error rates

#### Render Metrics (Backend)

```bash
# View: Render Dashboard → Service → Metrics
```

**Metrics to Monitor**:

- CPU usage (should stay < 80%)
- Memory usage (Free tier: 512MB)
- Response times (target: < 200ms)
- Request rate
- Error rate (target: < 1%)

### Database Monitoring (MongoDB Atlas)

```bash
# Go to: Atlas Dashboard → Cluster → Metrics
```

**Key Metrics**:

- Connections (Free tier max: 100)
- Operations per second
- Network I/O
- Storage usage (Free tier: 512MB)
- Query performance

**Set Up Alerts**:

1. Atlas → Alerts → Configure
2. Alert on:
   - Connections > 80
   - Storage > 90% capacity
   - Query execution time > 1000ms

### Logging Strategy

#### Frontend Logging

```javascript
// src/utils/logger.js (already implemented)
// Logs sent to console in dev, can integrate with:
- Sentry (errors)
- LogRocket (session replay)
- Google Analytics (events)
```

#### Backend Logging

```javascript
// server/src/app.js (morgan middleware configured)
// Log levels:
- Error: Critical issues requiring immediate attention
- Warn: Potential issues to investigate
- Info: Important application events
- Debug: Detailed debugging information
```

**Centralized Logging** (Production):

```bash
# Option 1: Render Logs
Render Dashboard → Service → Logs (last 7 days on free tier)

# Option 2: External Service (recommended)
- Logtail: https://logtail.com
- Papertrail: https://papertrailapp.com
- Better Stack: https://betterstack.com
```

---

## ⚡ Performance Optimization

### Frontend Optimization

#### Code Splitting

```javascript
// Lazy load routes (implement in App.jsx)
import { lazy, Suspense } from "react";

const AdminDashboard = lazy(() => import("./components/Admin/AdminDashboard"));
const EmployeeDashboard = lazy(
  () => import("./components/Dashboard/EmployeeDashboard"),
);

// Wrap in Suspense
<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/admin" element={<AdminDashboard />} />
    <Route path="/employee" element={<EmployeeDashboard />} />
  </Routes>
</Suspense>;
```

#### Asset Optimization

```bash
# Images
- Use WebP format
- Lazy load images below the fold
- Set explicit width/height to prevent CLS

# Fonts
- Use system fonts when possible
- Preload critical fonts

# Bundle Size
- Check: npm run build (analyze bundle size)
- Target: < 500KB initial bundle
```

#### Caching Strategy

```javascript
// vercel.json (already configured)
- Static assets: 1 year cache
- API responses: Set Cache-Control headers
```

### Backend Optimization

#### Database Indexing

```javascript
// Add to server/src/models/User.js
UserSchema.index({ email: 1 }); // Already exists
UserSchema.index({ role: 1, isActive: 1 }); // Add for faster queries

// Add to server/src/models/Task.js
TaskSchema.index({ assignedTo: 1, status: 1 });
TaskSchema.index({ createdBy: 1 });
TaskSchema.index({ dueDate: 1 });
```

Create indexes:

```bash
# SSH into Render or use MongoDB Compass
node scripts/create-indexes.js
```

#### Response Compression

```javascript
// Already enabled in server/src/app.js
import compression from "compression";
app.use(compression());
```

#### API Response Caching (Optional)

```javascript
// Install Redis (paid tier)
npm install redis

// Cache frequent queries
const cache = await redis.get(`tasks:${userId}`);
if (cache) return JSON.parse(cache);

// Set with TTL
await redis.setex(`tasks:${userId}`, 300, JSON.stringify(tasks));
```

---

## 🔒 Security Checklist

### Pre-Deployment Security

- [ ] Environment variables secure (no hardcoded secrets)
- [ ] `.env` files in `.gitignore`
- [ ] CORS configured for production domain only
- [ ] Rate limiting enabled (already configured)
- [ ] SQL injection protection (mongo-sanitize enabled)
- [ ] XSS protection (xss-clean enabled)
- [ ] HTTP headers secured (helmet enabled)
- [ ] JWT secret is strong (64+ characters)
- [ ] MongoDB user has minimal permissions
- [ ] Database IP whitelist configured

### Runtime Security

#### Enable HTTPS

```bash
# Automatically enabled on Vercel and Render
# Verify: https:// in URLs
```

#### Security Headers

```javascript
// server/src/app.js (already configured)
import helmet from 'helmet';
app.use(helmet());

// Adds:
- X-Content-Type-Options: nosniff
- X-Frame-Options: SAMEORIGIN
- Strict-Transport-Security
```

#### Rate Limiting

```javascript
// server/src/app.js (configured)
- Login: 100 requests per 15 minutes
- Global: 1000 requests per 15 minutes
```

#### Input Validation

```javascript
// server/src/validators/ (implemented)
- Email format validation
- Password strength requirements
- Data sanitization
```

### Security Monitoring

#### Enable Alerts

```bash
# MongoDB Atlas
- Failed authentication attempts
- Unusual IP locations
- High query volume

# Render
- High CPU usage (possible DDoS)
- Memory spikes
- Error rate > 5%
```

#### Security Audits

```bash
# Run weekly
npm audit
npm audit fix

# Check for outdated packages
npm outdated
```

---

## 💾 Backup & Recovery

### Database Backups (MongoDB Atlas)

#### Automatic Backups

```bash
# Free tier: Basic backups (restore last 48 hours)
# Paid tier: Continuous backups (point-in-time recovery)

# Enable: Atlas → Backup → Configure
```

#### Manual Backup

```bash
# Export entire database
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/dbname"

# Import backup
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net" dump/
```

### Application Backup

#### Code (Git)

```bash
# Always push to GitHub
git push origin main

# Tag releases
git tag -a v1.0.0 -m "Production release 1.0.0"
git push origin v1.0.0
```

#### Environment Variables

```bash
# Store securely (encrypted)
# Use password manager: 1Password, LastPass, Bitwarden
# Team: Use Vercel/Render built-in secrets management
```

### Recovery Procedures

#### Rollback Deployment

```bash
# Vercel
1. Dashboard → Deployments
2. Click previous successful deployment
3. Click "Promote to Production"

# Render
1. Dashboard → Service
2. Manual Deploy → Select previous commit
```

#### Database Recovery

```bash
# Restore from Atlas backup
1. Atlas → Backup
2. Select restore point
3. Choose target cluster
4. Wait for restore completion

# Restore from manual dump
mongorestore --uri="mongodb+srv://..." dump/
```

---

## 📈 Scaling Strategy

### Vertical Scaling (Increase Resources)

#### Free → Paid Tiers

| Service     | Free            | Starter          | Pro                        |
| ----------- | --------------- | ---------------- | -------------------------- |
| **Vercel**  | 100GB bandwidth | $20/mo unlimited | $20/mo + advanced features |
| **Render**  | 512MB RAM       | $7/mo 1GB RAM    | $25/mo 4GB RAM             |
| **MongoDB** | 512MB storage   | $9/mo 2GB        | $25/mo 5GB                 |

**When to Upgrade**:

- Backend response time > 500ms consistently
- Memory usage > 80%
- Database storage > 80%
- Bandwidth approaching limit

### Horizontal Scaling

#### Load Balancing (Paid Tier)

```bash
# Render: Enable autoscaling
1. Upgrade to Standard or above
2. Set min/max instances
3. Configure scaling triggers
```

#### Database Scaling

```bash
# MongoDB Atlas
1. Scale cluster tier
2. Add read replicas
3. Enable sharding (large datasets)
```

#### CDN for Static Assets

```bash
# Vercel automatically uses Edge CDN
# Additional: Cloudflare for images
```

---

## 🚨 Incident Response

### Monitoring Alerts Setup

#### Uptime Monitoring

```bash
# Use: UptimeRobot (free tier)
1. Add monitor: https://your-api.onrender.com/api/health
2. Check interval: 5 minutes
3. Alert contacts: Email/SMS
4. Create status page

# Or: Better Uptime (paid)
```

#### Error Tracking

```bash
# Sentry (recommended)
npm install @sentry/react @sentry/node

# Frontend: src/main.jsx
import * as Sentry from '@sentry/react';
Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
});

# Backend: server/src/app.js
import * as Sentry from '@sentry/node';
Sentry.init({ dsn: process.env.SENTRY_DSN });
```

### Incident Response Playbook

#### Backend Down

```bash
1. Check Render status: status.render.com
2. Check logs in Render dashboard
3. Check MongoDB Atlas connectivity
4. Restart service if needed
5. Review recent deployments
```

#### Frontend Down

```bash
1. Check Vercel status: status.vercel.com
2. Check deployment logs
3. Verify build passed
4. Check DNS settings (if custom domain)
5. Rollback if needed
```

#### Database Issues

```bash
1. Check Atlas status
2. Review metrics (connections, CPU)
3. Check slow queries
4. Verify IP whitelist
5. Scale cluster if needed
```

#### High Response Times

```bash
1. Check backend metrics (CPU, memory)
2. Review database query performance
3. Check for N+1 queries
4. Add database indexes
5. Implement caching
6. Scale resources
```

---

## 📋 Maintenance Checklist

### Daily

- [ ] Review error logs
- [ ] Check uptime monitoring
- [ ] Monitor critical alerts

### Weekly

- [ ] Review performance metrics
- [ ] Check for security updates (`npm audit`)
- [ ] Review database slow queries
- [ ] Check storage usage

### Monthly

- [ ] Update dependencies
- [ ] Review and rotate API keys
- [ ] Backup verification
- [ ] Performance optimization review
- [ ] Security audit
- [ ] Cost optimization review

### Quarterly

- [ ] Load testing
- [ ] Disaster recovery drill
- [ ] Security penetration testing
- [ ] Architecture review
- [ ] Capacity planning

---

## 📚 Additional Resources

- [MongoDB Atlas Best Practices](https://docs.atlas.mongodb.com/best-practices/)
- [Vercel Performance Guide](https://vercel.com/docs/concepts/functions/serverless-functions/edge-caching)
- [Render Scaling Guide](https://render.com/docs/scaling)
- [Web Performance Checklist](https://www.smashingmagazine.com/2021/01/front-end-performance-2021-free-pdf-checklist/)

---

**Last Updated**: February 2026  
**Next Review**: May 2026
