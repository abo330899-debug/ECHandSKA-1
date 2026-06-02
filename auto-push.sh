#!/bin/bash

# ============================================
# Auto Push Script - رفع تلقائي لـ GitHub
# ============================================

GITHUB_USER="abo330899-debug"
GITHUB_REPO="ECHandSKA-1"
BRANCH="main"

# تحقق من وجود GITHUB_TOKEN
if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ خطأ: GITHUB_TOKEN غير موجود في الـ secrets"
    echo "   أضفه من: Replit → Secrets (🔒) → GITHUB_TOKEN"
    exit 1
fi

REPO_URL="https://${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${GITHUB_REPO}.git"

# إعداد git
git config user.email "replit-auto@deploy.com"
git config user.name "Replit Auto Deploy"

# إعداد الـ remote
git remote get-url origin 2>/dev/null || git remote add origin "$REPO_URL"
git remote set-url origin "$REPO_URL"

# أضف كل الملفات
git add -A

# تحقق إذا في تغييرات
if git diff --cached --quiet; then
    echo "ℹ️  لا توجد تغييرات جديدة"
    exit 0
fi

# Commit
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
git commit -m "🚀 Auto-deploy: $TIMESTAMP"

# Push
echo "📤 جاري الرفع لـ GitHub..."
if git push origin HEAD:$BRANCH 2>&1; then
    echo "✅ تم الرفع بنجاح!"
    echo "🌐 GitHub Actions سيبدأ النشر على Cloudflare Pages..."
else
    echo "⚠️  فشل push عادي، جاري المحاولة بـ force..."
    git push origin HEAD:$BRANCH --force
    echo "✅ تم الرفع (force) بنجاح!"
fi
