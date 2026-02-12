#!/bin/bash

# Pre-Deployment Validation Script
# Checks all requirements before deployment

set -e

echo "🔍 Pre-Deployment Validation"
echo "=============================="
echo ""

ERRORS=0
WARNINGS=0

# Colors
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

check_pass() {
    echo -e "${GREEN}✓${NC} $1"
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
    ERRORS=$((ERRORS + 1))
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    WARNINGS=$((WARNINGS + 1))
}

# 1. Environment Files
echo "📄 Checking environment files..."
if [ -f ".env.production" ]; then
    if grep -q "your-backend-url" .env.production; then
        check_fail ".env.production has placeholder values"
    else
        check_pass ".env.production configured"
    fi
else
    check_fail ".env.production missing"
fi

if [ -f "server/.env.production" ]; then
    if grep -q "your-super-secret" server/.env.production; then
        check_fail "server/.env.production has placeholder JWT_SECRET"
    elif grep -q "localhost" server/.env.production; then
        check_fail "server/.env.production has localhost URLs"
    else
        check_pass "server/.env.production configured"
    fi
else
    check_fail "server/.env.production missing"
fi

echo ""

# 2. Dependencies
echo "📦 Checking dependencies..."
if [ -d "node_modules" ]; then
    check_pass "Frontend dependencies installed"
else
    check_fail "Frontend dependencies not installed (run: npm install)"
fi

if [ -d "server/node_modules" ]; then
    check_pass "Backend dependencies installed"
else
    check_fail "Backend dependencies not installed (run: cd server && npm install)"
fi

echo ""

# 3. Build Test
echo "🏗️  Testing production build..."
if npm run build:prod > /dev/null 2>&1; then
    check_pass "Frontend builds successfully"
else
    check_fail "Frontend build failed (run: npm run build:prod)"
fi

echo ""

# 4. Git Status
echo "📝 Checking git status..."
if [ -d ".git" ]; then
    if [ -z "$(git status --porcelain)" ]; then
        check_pass "No uncommitted changes"
    else
        check_warn "Uncommitted changes detected"
    fi
    
    if git remote -v | grep -q "github.com"; then
        check_pass "GitHub remote configured"
    else
        check_fail "No GitHub remote found"
    fi
else
    check_fail "Not a git repository"
fi

echo ""

# 5. Security Checks
echo "🔒 Security checks..."
if grep -r "password.*=.*123\|secret.*=.*test" server/ 2>/dev/null | grep -v node_modules | grep -v ".example" | grep -v "DEPLOYMENT"; then
    check_fail "Hardcoded credentials found in code"
else
    check_pass "No hardcoded credentials in code"
fi

if [ -f ".env" ] && ! grep -q ".env" .gitignore; then
    check_fail ".env not in .gitignore"
else
    check_pass ".env files properly ignored"
fi

echo ""

# 6. Configuration Files
echo "⚙️  Checking configuration files..."
if [ -f "vercel.json" ]; then
    check_pass "vercel.json exists"
else
    check_warn "vercel.json missing (optional)"
fi

if [ -f "render.yaml" ] || [ -f "railway.json" ]; then
    check_pass "Backend deployment config exists"
else
    check_warn "Backend deployment config missing (optional)"
fi

echo ""

# Summary
echo "=============================="
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed!${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠️  $WARNINGS warnings (review recommended)${NC}"
    fi
    echo ""
    echo "Ready to deploy! 🚀"
    echo ""
    echo "Next steps:"
    echo "1. Push to GitHub: git push origin main"
    echo "2. Deploy backend to Render/Railway"
    echo "3. Deploy frontend to Vercel"
    exit 0
else
    echo -e "${RED}❌ $ERRORS errors found${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠️  $WARNINGS warnings${NC}"
    fi
    echo ""
    echo "Please fix errors before deploying."
    exit 1
fi
