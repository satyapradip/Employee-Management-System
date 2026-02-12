# Production Deployment Script for Windows
# PowerShell script to automate deployment

Write-Host "🚀 Starting Deployment Process..." -ForegroundColor Cyan
Write-Host ""

# Function to print colored output
function Print-Step {
  param($message)
  Write-Host "✓ $message" -ForegroundColor Green
}

function Print-Warning {
  param($message)
  Write-Host "⚠ $message" -ForegroundColor Yellow
}

function Print-Error {
  param($message)
  Write-Host "✗ $message" -ForegroundColor Red
}

# Step 1: Check prerequisites
Write-Host "📋 Checking prerequisites..." -ForegroundColor Cyan

try {
  $nodeVersion = node --version
  Print-Step "Node.js installed: $nodeVersion"
}
catch {
  Print-Error "Node.js is not installed"
  exit 1
}

try {
  $npmVersion = npm --version
  Print-Step "npm installed: $npmVersion"
}
catch {
  Print-Error "npm is not installed"
  exit 1
}

try {
  $gitVersion = git --version
  Print-Step "git installed: $gitVersion"
}
catch {
  Print-Error "git is not installed"
  exit 1
}

Write-Host ""

# Step 2: Check environment files
Write-Host "🔍 Checking environment files..." -ForegroundColor Cyan

if (-Not (Test-Path ".env.production")) {
  Print-Warning ".env.production not found - using example"
  Copy-Item .env.example .env.production
}
Print-Step "Frontend .env.production exists"

if (-Not (Test-Path "server\.env.production")) {
  Print-Warning "server\.env.production not found - using example"
  Copy-Item server\.env.example server\.env.production
}
Print-Step "Backend .env.production exists"

Write-Host ""

# Step 3: Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan

Write-Host "  Installing frontend dependencies..."
npm install
if ($LASTEXITCODE -eq 0) {
  Print-Step "Frontend dependencies installed"
}
else {
  Print-Error "Failed to install frontend dependencies"
  exit 1
}

Write-Host "  Installing backend dependencies..."
Push-Location server
npm install
$backendInstall = $LASTEXITCODE
Pop-Location

if ($backendInstall -eq 0) {
  Print-Step "Backend dependencies installed"
}
else {
  Print-Error "Failed to install backend dependencies"
  exit 1
}

Write-Host ""

# Step 4: Run tests
Write-Host "🧪 Running tests..." -ForegroundColor Cyan

Push-Location server
npm run test
if ($LASTEXITCODE -eq 0) {
  Print-Step "All tests passed"
}
else {
  Print-Warning "Some tests failed - review before deploying"
}
Pop-Location

Write-Host ""

# Step 5: Build frontend
Write-Host "🏗️  Building frontend for production..." -ForegroundColor Cyan

npm run build
if ($LASTEXITCODE -eq 0) {
  Print-Step "Frontend build successful"
}
else {
  Print-Error "Frontend build failed"
  exit 1
}

Write-Host ""

# Step 6: Git status
Write-Host "📝 Checking git status..." -ForegroundColor Cyan

$gitStatus = git status --porcelain
if ($gitStatus) {
  Print-Warning "Uncommitted changes detected"
  git status --short
  Write-Host ""
    
  $commit = Read-Host "Commit changes? (y/n)"
  if ($commit -eq 'y' -or $commit -eq 'Y') {
    git add .
    $commitMsg = Read-Host "Enter commit message"
    git commit -m "$commitMsg"
    Print-Step "Changes committed"
  }
}
else {
  Print-Step "Working directory clean"
}

Write-Host ""

# Step 7: Push to repository
Write-Host "☁️  Pushing to GitHub..." -ForegroundColor Cyan

$push = Read-Host "Push to GitHub? (y/n)"
if ($push -eq 'y' -or $push -eq 'Y') {
  git push origin main
  if ($LASTEXITCODE -eq 0) {
    Print-Step "Code pushed to GitHub"
  }
  else {
    Print-Error "Failed to push to GitHub"
    exit 1
  }
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "✅ Deployment preparation complete!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Deploy backend to Render/Railway (will auto-deploy from GitHub)"
Write-Host "2. Deploy frontend to Vercel (will auto-deploy from GitHub)"
Write-Host "3. Update environment variables in hosting platforms"
Write-Host "4. Test the deployed application"
Write-Host ""
Write-Host "📚 See DEPLOYMENT.md for detailed instructions" -ForegroundColor Cyan
Write-Host ""
