#!/bin/bash

# HOOPS Trainer Deployment Script
echo "🚀 Deploying HOOPS Trainer to production..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are you in the project root?"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run linting
echo "🔍 Running linting..."
npm run lint

# Build the application
echo "🏗️ Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🎯 Next steps:"
    echo "1. Push to GitHub: git push origin main"
    echo "2. Go to Vercel.com and import your repository"
    echo "3. Add environment variables:"
    echo "   - NEXTAUTH_URL: https://your-domain.com"
    echo "   - NEXTAUTH_SECRET: $(openssl rand -base64 32)"
    echo "4. Deploy!"
    echo ""
    echo "🌐 Your app will be live at your custom domain!"
else
    echo "❌ Build failed. Please fix the errors above."
    exit 1
fi
