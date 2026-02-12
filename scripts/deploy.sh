#!/bin/bash

# Production Deployment Script
# This script automates the deployment process

set -e  # Exit on error

echo "🚀 Starting Deployment Process..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Step 1: Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    exit 1
fi
print_step "Node.js installed: $(node --version)"

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi
print_step "npm installed: $(npm --version)"

if ! command -v git &> /dev/null; then
    print_error "git is not installed"
    exit 1
fi
print_step "git installed: $(git --version)"

echo ""

# Step 2: Check environment files
echo "🔍 Checking environment files..."

if [ ! -f ".env.production" ]; then
    print_warning ".env.production not found - using example"
    cp .env.example .env.production
fi
print_step "Frontend .env.production exists"

if [ ! -f "server/.env.production" ]; then
    print_warning "server/.env.production not found - using example"
    cp server/.env.example server/.env.production
fi
print_step "Backend .env.production exists"

echo ""

# Step 3: Install dependencies
echo "📦 Installing dependencies..."

echo "  Installing frontend dependencies..."
npm install
print_step "Frontend dependencies installed"

echo "  Installing backend dependencies..."
cd server && npm install && cd ..
print_step "Backend dependencies installed"

echo ""

# Step 4: Run tests
echo "🧪 Running tests..."

cd server
if npm run test; then
    print_step "All tests passed"
else
    print_warning "Some tests failed - review before deploying"
fi
cd ..

echo ""

# Step 5: Build frontend
echo "🏗️  Building frontend for production..."

if npm run build; then
    print_step "Frontend build successful"
else
    print_error "Frontend build failed"
    exit 1
fi

echo ""

# Step 6: Git status
echo "📝 Checking git status..."

if [ -n "$(git status --porcelain)" ]; then
    print_warning "Uncommitted changes detected"
    git status --short
    echo ""
    read -p "Commit changes? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        read -p "Enter commit message: " commit_msg
        git commit -m "$commit_msg"
        print_step "Changes committed"
    fi
else
    print_step "Working directory clean"
fi

echo ""

# Step 7: Push to repository
echo "☁️  Pushing to GitHub..."

read -p "Push to GitHub? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git push origin main
    print_step "Code pushed to GitHub"
fi

echo ""
echo "=========================================="
echo "✅ Deployment preparation complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Deploy backend to Render/Railway (will auto-deploy from GitHub)"
echo "2. Deploy frontend to Vercel (will auto-deploy from GitHub)"
echo "3. Update environment variables in hosting platforms"
echo "4. Test the deployed application"
echo ""
echo "📚 See DEPLOYMENT.md for detailed instructions"
echo ""
