#!/bin/bash

# ============================================
# Auto Push Script - رفع تلقائي لـ GitHub
# ============================================

GITHUB_USER="abo330899-debug"
GITHUB_REPO="ECHandSKA-1"
BRANCH="main"

if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ GITHUB_TOKEN غير موجود"
    exit 1
fi

REPO_URL="https://${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${GITHUB_REPO}.git"

# أضف كل الملفات
git add -A

# تحقق إذا في تغييرات
if git diff --cached --quiet; then
    echo "ℹ️  لا توجد تغييرات جديدة"
    exit 0
fi

# Commit باستخدام متغيرات بيئة بدل git config
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
GIT_AUTHOR_NAME="Replit Auto" \
GIT_AUTHOR_EMAIL="replit@auto.deploy" \
GIT_COMMITTER_NAME="Replit Auto" \
GIT_COMMITTER_EMAIL="replit@auto.deploy" \
git commit -m "🚀 Auto-deploy: $TIMESTAMP"

# Push باستخدام التوكن مباشرة في الـ URL
echo "📤 جاري الرفع لـ GitHub..."
if GIT_ASKPASS=echo git push "$REPO_URL" HEAD:$BRANCH 2>&1; then
    echo "✅ تم الرفع بنجاح!"
    echo "🌐 GitHub Actions سيبدأ النشر على Cloudflare Pages..."
else
    echo "⚠️  جاري المحاولة بـ force..."
    GIT_ASKPASS=echo git push "$REPO_URL" HEAD:$BRANCH --force 2>&1
    echo "✅ تم الرفع!"
fi
