#!/bin/bash

# ============================================
# First Time Setup - إعداد أولي
# شغّل هذا السكريبت مرة واحدة فقط
# ============================================

echo "🔧 جاري الإعداد..."

# تحقق من GITHUB_TOKEN
if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ أضف GITHUB_TOKEN في Replit Secrets أولاً"
    exit 1
fi

GITHUB_USER="abo330899-debug"
GITHUB_REPO="ECHandSKA-1"
REPO_URL="https://${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${GITHUB_REPO}.git"

# إعداد git
git config user.email "replit-auto@deploy.com"
git config user.name "Replit Auto Deploy"

# تهيئة git إذا مو مهيأ
if [ ! -d ".git" ]; then
    git init
    git branch -M main
    echo "✅ تم تهيئة git"
fi

# إعداد .gitignore
if [ ! -f ".gitignore" ]; then
cat > .gitignore << 'EOF'
node_modules/
.env
.env.local
*.log
.DS_Store
dist/
build/
.cache/
EOF
    echo "✅ تم إنشاء .gitignore"
fi

# ربط الـ remote
git remote get-url origin 2>/dev/null && git remote set-url origin "$REPO_URL" || git remote add origin "$REPO_URL"
echo "✅ تم ربط GitHub repo"

# Push أولي
git add -A
git diff --cached --quiet || git commit -m "🚀 Initial commit from Replit"
git push -u origin main --force 2>&1 && echo "✅ تم الرفع الأولي لـ GitHub!" || echo "⚠️  تحقق من الـ Token وإعادة المحاولة"

echo ""
echo "======================================"
echo "✅ الإعداد اكتمل!"
echo ""
echo "الخطوة التالية:"
echo "  bash watch-and-push.sh"
echo "======================================"
