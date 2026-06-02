#!/bin/bash

# ============================================
# File Watcher - مراقب الملفات
# ============================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PUSH_SCRIPT="$SCRIPT_DIR/auto-push.sh"
INTERVAL=30

echo "======================================"
echo "  Auto Deploy - نشر تلقائي"
echo "======================================"
echo "📁 مراقبة: $SCRIPT_DIR"
echo "⏱  فحص كل: ${INTERVAL} ثانية"
echo "🎯 GitHub: abo330899-debug/ECHandSKA-1"
echo "🌐 Cloudflare: echandska-1.pages.dev"
echo "======================================"
echo ""

if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ GITHUB_TOKEN غير موجود!"
    echo "أضفه من: Replit → Secrets (🔒) → GITHUB_TOKEN"
    exit 1
fi

echo "✅ GITHUB_TOKEN موجود"
echo "👀 بدأت مراقبة التغييرات..."
echo ""

# دفع أولي
echo "📤 رفع أولي للمشروع..."
bash "$PUSH_SCRIPT"
echo ""

LAST_HASH=""

while true; do
    sleep $INTERVAL

    CURRENT_HASH=$(git --no-optional-locks status --porcelain 2>/dev/null | md5sum)

    if [ -n "$LAST_HASH" ] && [ "$CURRENT_HASH" != "$LAST_HASH" ]; then
        echo "📁 تم اكتشاف تغييرات! [$(date '+%H:%M:%S')]"
        bash "$PUSH_SCRIPT"
        echo ""
        echo "👀 متابعة المراقبة..."
        echo ""
    fi

    LAST_HASH="$CURRENT_HASH"
done
