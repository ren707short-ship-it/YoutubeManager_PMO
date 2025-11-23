#!/bin/bash
# GitHub Push Script
# Usage: Replace YOUR_TOKEN with your actual GitHub Personal Access Token

TOKEN="YOUR_TOKEN"
REPO="github.com/ren707short-ship-it/YoutubeManager_PMO.git"

cd /home/user/webapp

# Configure git user (if not set)
git config user.name "ren707short-ship-it" 2>/dev/null || true
git config user.email "noreply@github.com" 2>/dev/null || true

# Push to GitHub using token
git push https://${TOKEN}@${REPO} main

echo ""
echo "✅ Push completed!"
echo "🔗 Repository: https://github.com/ren707short-ship-it/YoutubeManager_PMO"
