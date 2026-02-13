#!/usr/bin/env pwsh
# Quick CI/CD Diagnosis Script
# Run this before pushing to check for common CI issues

Write-Host "🔍 CI/CD Pre-Flight Check" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check Node version
Write-Host "📌 Checking Node.js version..." -ForegroundColor Yellow
$nodeVersion = node --version
Write-Host "   Current: $nodeVersion (CI uses: v18.x)" -ForegroundColor Gray

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
  Write-Host "❌ Not in project root directory!" -ForegroundColor Red
  exit 1
}

# Frontend Checks
Write-Host ""
Write-Host "🎨 Frontend Checks" -ForegroundColor Yellow
Write-Host "   Running lint..." -ForegroundColor Gray
try {
  npm run lint 2>&1 | Out-Null
  if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Lint passed" -ForegroundColor Green
  }
  else {
    Write-Host "   ⚠️  Lint warnings/errors found" -ForegroundColor Yellow
  }
}
catch {
  Write-Host "   ❌ Lint failed" -ForegroundColor Red
}

Write-Host "   Testing build with CI mode..." -ForegroundColor Gray
$env:CI = "true"
try {
  npm run build 2>&1 | Out-Null
  if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Build successful" -ForegroundColor Green
  }
  else {
    Write-Host "   ❌ Build failed" -ForegroundColor Red
  }
}
catch {
  Write-Host "   ❌ Build error" -ForegroundColor Red
}
Remove-Item Env:\CI

# Backend Checks
Write-Host ""
Write-Host "🔧 Backend Checks" -ForegroundColor Yellow
Push-Location server

if (Test-Path "package.json") {
  Write-Host "   Checking backend tests..." -ForegroundColor Gray
    
  # Check if MongoDB is running
  try {
    $mongoTest = Test-NetConnection -ComputerName localhost -Port 27017 -WarningAction SilentlyContinue
    if ($mongoTest.TcpTestSucceeded) {
      Write-Host "   ✅ MongoDB detected on localhost:27017" -ForegroundColor Green
            
      $env:NODE_ENV = "test"
      $env:MONGODB_URI = "mongodb://localhost:27017/test_db"
      $env:JWT_SECRET = "test-secret-key-for-ci-pipeline-minimum-32-characters"
            
      try {
        npm test 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
          Write-Host "   ✅ Backend tests passed" -ForegroundColor Green
        }
        else {
          Write-Host "   ⚠️  Some tests failed" -ForegroundColor Yellow
        }
      }
      catch {
        Write-Host "   ❌ Test execution error" -ForegroundColor Red
      }
            
      Remove-Item Env:\NODE_ENV
      Remove-Item Env:\MONGODB_URI
      Remove-Item Env:\JWT_SECRET
    }
    else {
      Write-Host "   ⚠️  MongoDB not running - skipping tests" -ForegroundColor Yellow
      Write-Host "   💡 Start MongoDB to run backend tests" -ForegroundColor Gray
    }
  }
  catch {
    Write-Host "   ⚠️  Cannot check MongoDB status" -ForegroundColor Yellow
  }
}

Pop-Location

# Git Status
Write-Host ""
Write-Host "📋 Git Status" -ForegroundColor Yellow
$gitStatus = git status --short
if ($gitStatus) {
  Write-Host "   Modified files:" -ForegroundColor Gray
  $gitStatus | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
}
else {
  Write-Host "   ✅ Working tree clean" -ForegroundColor Green
}

# Check for package-lock.json
Write-Host ""
Write-Host "📦 Dependency Files" -ForegroundColor Yellow
if (Test-Path "package-lock.json") {
  Write-Host "   ✅ package-lock.json exists (frontend)" -ForegroundColor Green
}
else {
  Write-Host "   ❌ package-lock.json missing (frontend)" -ForegroundColor Red
}

if (Test-Path "server/package-lock.json") {
  Write-Host "   ✅ package-lock.json exists (backend)" -ForegroundColor Green
}
else {
  Write-Host "   ❌ package-lock.json missing (backend)" -ForegroundColor Red
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "✨ Pre-flight check complete!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Review any warnings or errors above" -ForegroundColor Gray
Write-Host "2. Commit your changes: git add . && git commit -m 'Fix CI/CD issues'" -ForegroundColor Gray
Write-Host "3. Push to GitHub: git push" -ForegroundColor Gray
Write-Host "4. Monitor CI: Check GitHub Actions tab" -ForegroundColor Gray
Write-Host ""
