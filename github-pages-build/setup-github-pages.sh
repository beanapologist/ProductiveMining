#!/bin/bash

# GitHub Pages Setup Script for Productive Mining Platform
# This script helps configure the repository for GitHub Pages deployment

echo "🚀 Setting up Productive Mining Platform for GitHub Pages deployment..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📝 Initializing git repository..."
    git init
fi

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo "📄 Creating .gitignore..."
    cat > .gitignore << EOL
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist/
build/

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
logs
*.log

# Cache
.cache/
EOL
fi

# Check if user has configured their repository URL
echo "📋 Please configure your GitHub repository details:"
echo ""
echo "1. Update package.json 'homepage' field:"
echo "   \"homepage\": \"https://YOUR_USERNAME.github.io/productive-mining-platform\""
echo ""
echo "2. Ensure vite.config.ts has correct base path:"
echo "   base: \"/productive-mining-platform/\""
echo ""

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm ci
else
    echo "✅ Dependencies already installed"
fi

# Build the project
echo "🔨 Building project for production..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🎉 Setup complete! Next steps:"
    echo ""
    echo "1. Create a new GitHub repository named 'productive-mining-platform'"
    echo "2. Upload all files from this directory to the repository"
    echo "3. Go to repository Settings → Pages"
    echo "4. Select 'Deploy from a branch' and choose 'main' branch"
    echo "5. Your site will be available at: https://YOUR_USERNAME.github.io/productive-mining-platform/"
    echo ""
    echo "🔄 The GitHub Actions workflow will automatically rebuild and deploy when you push changes."
else
    echo "❌ Build failed. Please check the error messages above."
    exit 1
fi