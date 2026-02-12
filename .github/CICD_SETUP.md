# GitHub Actions CI/CD Setup Guide

## 🎯 Overview

This guide explains how to set up automated deployments using GitHub Actions for your Employee Management System.

## 📋 Prerequisites

- GitHub repository with your code
- Vercel account connected to GitHub
- Backend deployed on Render/Railway

## 🔧 Setup Instructions

### Step 1: Get Vercel Tokens

1. Go to [Vercel Dashboard](https://vercel.com/account/tokens)
2. Click **"Create Token"**
3. Name it: `GitHub Actions CI/CD`
4. Copy the token (you'll only see it once!)

### Step 2: Get Vercel Project IDs

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Get IDs (look in .vercel/project.json)
cat .vercel/project.json
```

You'll see:

```json
{
  "projectId": "prj_xxxxxxxxxxxxx",
  "orgId": "team_xxxxxxxxxxxxx"
}
```

### Step 3: Add GitHub Secrets

1. Go to your GitHub repository
2. **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Add these secrets:

| Secret Name         | Value             | Where to Find              |
| ------------------- | ----------------- | -------------------------- |
| `VERCEL_TOKEN`      | Your Vercel token | Step 1                     |
| `VERCEL_ORG_ID`     | Your org/team ID  | `.vercel/project.json`     |
| `VERCEL_PROJECT_ID` | Your project ID   | `.vercel/project.json`     |
| `VITE_API_URL`      | Backend API URL   | Your Render deployment URL |

### Step 4: Enable Workflows

The workflow file `.github/workflows/ci-cd.yml` is already created. It will automatically run on:

- Push to `main` branch
- Pull requests to `main` branch

## 🚀 What the CI/CD Pipeline Does

### On Every Push/PR:

1. **Frontend Checks**:
   - ✅ Lints code
   - ✅ Builds project
   - ✅ Uploads artifacts

2. **Backend Tests**:
   - ✅ Sets up MongoDB
   - ✅ Runs all tests
   - ✅ Generates coverage report

3. **Security Audit**:
   - ✅ Checks for vulnerable dependencies
   - ✅ Reports security issues

### On Main Branch Push:

4. **Deploy Frontend**:
   - 🚀 Automatically deploys to Vercel Production

## 📊 Viewing Results

1. Go to your GitHub repository
2. Click **"Actions"** tab
3. See all workflow runs
4. Click on any run to see detailed logs

## 🔍 Workflow Status Badge

Add this to your README.md:

```markdown
![CI/CD](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci-cd.yml/badge.svg)
```

Replace `YOUR_USERNAME` and `YOUR_REPO` with your GitHub username and repository name.

## 🛠️ Customization

### Disable Auto-Deploy

Remove or comment out the `deploy-frontend` job in `.github/workflows/ci-cd.yml`:

```yaml
# deploy-frontend:
#   name: Deploy Frontend to Vercel
#   ...
```

### Add Slack Notifications

1. Create a Slack webhook
2. Add it as a GitHub secret: `SLACK_WEBHOOK`
3. Update the `notify` job:

```yaml
notify:
  steps:
    - name: 📧 Slack Notification
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        webhook_url: ${{ secrets.SLACK_WEBHOOK }}
      if: always()
```

### Run Tests on Multiple Node Versions

```yaml
strategy:
  matrix:
    node-version: [16.x, 18.x, 20.x]
```

## 🐛 Troubleshooting

### Issue: Workflow Fails with "Permission denied"

**Fix**: Go to repository **Settings** → **Actions** → **General** → **Workflow permissions** → Enable "Read and write permissions"

### Issue: Vercel deployment fails

**Fix**:

1. Check `VERCEL_TOKEN` is valid
2. Verify `VERCEL_PROJECT_ID` and `VERCEL_ORG_ID` are correct
3. Ensure Vercel project is linked to the repository

### Issue: Tests fail in CI but work locally

**Fix**:

1. Check MongoDB service is running
2. Verify environment variables are set
3. Review test logs in Actions tab

## 📚 Learn More

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel CI/CD](https://vercel.com/docs/concepts/deployments/git/vercel-for-github)
- [Render Auto-Deploy](https://render.com/docs/deploys#automatic-deploys)

---

**Created**: February 2026  
**Maintained by**: Your Development Team
