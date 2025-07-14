#!/bin/bash

echo "🔧 Quick Fix & Deploy"
echo "===================="

cd /Users/jeffl/Desktop/AI-Bod-CO

echo "🔨 Testing build after fix..."
if npm run build; then
    echo "✅ Build successful! Deploying..."
    
    # Add and commit the fix
    git add .
    git commit -m "🔧 Fix: Replace Record icon with Circle - resolves build error

✅ Fixed lucide-react import error in V25 module
✅ Build now succeeds without errors  
✅ Ready for production deployment"
    
    # Push to GitHub
    git push origin main
    
    # Deploy to Vercel
    if command -v vercel &> /dev/null; then
        vercel --prod
        echo "🎉 Deployment complete!"
        echo "🔗 Your live platform: https://ai-bod-co.vercel.app"
    else
        echo "⚠️ Vercel CLI not found. Installing..."
        npm install -g vercel
        echo "🔑 Run 'vercel login' then 'vercel --prod' to deploy"
    fi
else
    echo "❌ Build still failing. Please check the error above."
fi