#!/bin/bash

echo "🚀 AI-Bod-CO Deployment - Step by Step"
echo "======================================"

# Navigate to project
cd /Users/jeffl/Desktop/AI-Bod-CO

echo "📍 Current directory: $(pwd)"

# Check if this is a git repository
if [ ! -d ".git" ]; then
    echo "⚠️ No git repository found. Initializing..."
    git init
    git remote add origin https://github.com/LeviathanTX/AI-Bod-CO.git
fi

# Install dependencies
echo "📦 Installing dependencies..."
if npm install; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Try to build
echo "🔨 Building project..."
if npm run build; then
    echo "✅ Build successful"
else
    echo "❌ Build failed - checking for errors..."
    echo "🔍 Common build issues:"
    echo "  - Module import/export errors"
    echo "  - Missing dependencies"
    echo "  - Syntax errors in React components"
    exit 1
fi

# Check git status
echo "📊 Git status:"
git status

# Add changes
echo "📝 Adding files to git..."
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo "ℹ️ No changes to commit"
else
    echo "💾 Committing changes..."
    git commit -m "Deploy V20 Claude Integration + V27 Subscription Management"
fi

# Push to GitHub
echo "⬆️ Pushing to GitHub..."
if git push origin main; then
    echo "✅ Successfully pushed to GitHub"
else
    echo "❌ Failed to push to GitHub"
    echo "🔍 Possible issues:"
    echo "  - GitHub authentication required"
    echo "  - Remote repository not configured"
    echo "  - Network connection issues"
fi

# Check if Vercel CLI is installed
if command -v vercel &> /dev/null; then
    echo "🌐 Deploying to Vercel..."
    vercel --prod
else
    echo "⚠️ Vercel CLI not found. Installing..."
    npm install -g vercel
    echo "🔑 Please run 'vercel login' first, then run this script again"
    exit 1
fi

echo "✅ Deployment process completed!"
echo "🔗 Check your Vercel dashboard for the live URL"