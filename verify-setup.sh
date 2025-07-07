#!/bin/bash

# Verification script for GitHub Pages deployment setup
echo "🔍 Verifying GitHub Pages deployment setup..."

# Check if we're in the correct directory
if [ ! -f "vite.config.ts" ] || [ ! -d "client" ] || [ ! -f "package.json" ]; then
    echo "❌ ERROR: You must run this script from the github-pages-build directory"
    echo "📁 Current directory: $(pwd)"
    echo "📋 Please run: cd github-pages-build && ./verify-setup.sh"
    exit 1
fi

echo "✅ Directory: Correct (github-pages-build)"

# Check if package.json exists and has the right structure
if grep -q "productive-mining-platform" package.json; then
    echo "✅ Package: Configuration found"
else
    echo "❌ Package: Missing or incorrect configuration"
    exit 1
fi

# Check if main files exist
if [ -f "client/src/main.tsx" ] && [ -f "client/src/App.tsx" ]; then
    echo "✅ Files: main.tsx and App.tsx found"
else
    echo "❌ Files: Missing main.tsx or App.tsx"
    exit 1
fi

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo "✅ Dependencies: Installed"
else
    echo "⚠️  Dependencies: Not installed - run 'npm ci' first"
    echo "📦 Installing dependencies..."
    npm ci
fi

# Test build process
echo "🔨 Testing build process..."
if npm run build > /tmp/build.log 2>&1; then
    echo "✅ Build: Success"
    echo "🎉 Setup verification complete! Ready for GitHub Pages deployment."
else
    echo "❌ Build: Failed"
    echo "📋 Build log:"
    cat /tmp/build.log | tail -20
    exit 1
fi

echo ""
echo "📚 Next steps:"
echo "1. Create GitHub repository: productive-mining-platform"
echo "2. Upload all files from this directory"
echo "3. Enable GitHub Pages in repository settings"
echo "4. Update package.json homepage with your GitHub username"