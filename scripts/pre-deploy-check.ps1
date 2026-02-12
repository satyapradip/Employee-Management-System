# Pre-Deployment Validation Script (PowerShell)
# Checks all requirements before deployment

Write-Host "🔍 Pre-Deployment Validation" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

$ERRORS = 0
$WARNINGS = 0

function Check-Pass {
  param($message)
  Write-Host "✓ $message" -ForegroundColor Green
}

function Check-Fail {
  param($message)
  Write-Host "✗ $message" -ForegroundColor Red
  $global:ERRORS++
}

function Check-Warn {
  param($message)
  Write-Host "⚠ $message" -ForegroundColor Yellow
  $global:WARNINGS++
}

# 1. Environment Files
Write-Host "📄 Checking environment files..." -ForegroundColor Cyan
if (Test-Path ".env.production") {
  $content = Get-Content .env.production -Raw
  if ($content -match "your-backend-url") {
    Check-Fail ".env.production has placeholder values"
  }
  else {
    Check-Pass ".env.production configured"
  }
}
else {
  Check-Fail ".env.production missing"
}

if (Test-Path "server\.env.production") {
  $content = Get-Content server\.env.production -Raw
  if ($content -match "your-super-secret") {
    Check-Fail "server\.env.production has placeholder JWT_SECRET"
  }
  elseif ($content -match "localhost") {
    Check-Fail "server\.env.production has localhost URLs"
  }
  else {
    Check-Pass "server\.env.production configured"
  }
}
else {
  Check-Fail "server\.env.production missing"
}

Write-Host ""

# 2. Dependencies
Write-Host "📦 Checking dependencies..." -ForegroundColor Cyan
if (Test-Path "node_modules") {
  Check-Pass "Frontend dependencies installed"
}
else {
  Check-Fail "Frontend dependencies not installed (run: npm install)"
}

if (Test-Path "server\node_modules") {
  Check-Pass "Backend dependencies installed"
}
else {
  Check-Fail "Backend dependencies not installed (run: cd server; npm install)"
}

Write-Host ""

# 3. Build Test
Write-Host "🏗️  Testing production build..." -ForegroundColor Cyan
$buildOutput = npm run build:prod 2>&1
if ($LASTEXITCODE -eq 0) {
  Check-Pass "Frontend builds successfully"
}
else {
  Check-Fail "Frontend build failed (run: npm run build:prod)"
}

Write-Host ""

# 4. Git Status
Write-Host "📝 Checking git status..." -ForegroundColor Cyan
if (Test-Path ".git") {
  $gitStatus = git status --porcelain
  if (-not $gitStatus) {
    Check-Pass "No uncommitted changes"
  }
  else {
    Check-Warn "Uncommitted changes detected"
  }
    
  $remotes = git remote -v
  if ($remotes -match "github.com") {
    Check-Pass "GitHub remote configured"
  }
  else {
    Check-Fail "No GitHub remote found"
  }
}
else {
  Check-Fail "Not a git repository"
}

Write-Host ""

# 5. Security Checks
Write-Host "🔒 Security checks..." -ForegroundColor Cyan
$badPatterns = Get-ChildItem -Path server -Recurse -File -Exclude node_modules, *.example, DEPLOYMENT* | 
Select-String -Pattern "password.*=.*123|secret.*=.*test" | 
Where-Object { $_.Line -notmatch "test|example" }

if ($badPatterns) {
  Check-Fail "Hardcoded credentials found in code"
}
else {
  Check-Pass "No hardcoded credentials in code"
}

if ((Test-Path ".env") -and -not (Get-Content .gitignore | Select-String -Pattern "\.env")) {
  Check-Fail ".env not in .gitignore"
}
else {
  Check-Pass ".env files properly ignored"
}

Write-Host ""

# 6. Configuration Files
Write-Host "⚙️  Checking configuration files..." -ForegroundColor Cyan
if (Test-Path "vercel.json") {
  Check-Pass "vercel.json exists"
}
else {
  Check-Warn "vercel.json missing (optional)"
}

if ((Test-Path "render.yaml") -or (Test-Path "railway.json")) {
  Check-Pass "Backend deployment config exists"
}
else {
  Check-Warn "Backend deployment config missing (optional)"
}

Write-Host ""

# Summary
Write-Host "==============================" -ForegroundColor Cyan
if ($ERRORS -eq 0) {
  Write-Host "✅ All checks passed!" -ForegroundColor Green
  if ($WARNINGS -gt 0) {
    Write-Host "⚠️  $WARNINGS warnings (review recommended)" -ForegroundColor Yellow
  }
  Write-Host ""
  Write-Host "Ready to deploy! 🚀" -ForegroundColor Green
  Write-Host ""
  Write-Host "Next steps:" -ForegroundColor Yellow
  Write-Host "1. Push to GitHub: git push origin main"
  Write-Host "2. Deploy backend to Render/Railway"
  Write-Host "3. Deploy frontend to Vercel"
  exit 0
}
else {
  Write-Host "❌ $ERRORS errors found" -ForegroundColor Red
  if ($WARNINGS -gt 0) {
    Write-Host "⚠️  $WARNINGS warnings" -ForegroundColor Yellow
  }
  Write-Host ""
  Write-Host "Please fix errors before deploying." -ForegroundColor Red
  exit 1
}
