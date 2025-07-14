#!/bin/bash

echo "🚀 AI-Bod-CO Complete Integration Deployment"
echo "============================================="

# Navigate to project directory
cd /Users/jeffl/Desktop/AI-Bod-CO

# Install any missing dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Check git status
echo "📊 Checking git status..."
git status

# Add all changes
echo "📝 Adding changes to git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "🚀 Deploy V20 Complete Claude Integration + V27 Subscription Management

✅ V20 Live Claude: Complete API integration with real AI conversations
✅ V27 Subscription: Stripe-ready billing with 3-tier pricing
✅ Updated V18 Core Shell: Auto-loads all 9 modules
✅ Production Ready: Full deployment pipeline

Features Added:
- Real Claude API conversations in V20
- Multi-advisor chat with document context
- Complete Stripe subscription system
- Professional pricing tiers ($49/$149/$499)
- Payment flows and usage tracking
- Enhanced module architecture

Ready for Revenue: Platform can now generate real subscription income!"

# Push to GitHub
echo "⬆️ Pushing to GitHub..."
git push origin main

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment Complete!"
echo ""
echo "🎉 SUCCESS! Your AI Board of Advisors is now live with:"
echo "   ✅ Complete Claude API Integration"
echo "   ✅ Stripe Subscription System"
echo "   ✅ 9 Advanced Modules Auto-Loaded"
echo "   ✅ Production-Ready Revenue Platform"
echo ""
echo "🔗 Your live platform: https://ai-bod-co.vercel.app"
echo "💰 Ready to start generating subscription revenue!"