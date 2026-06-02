#!/bin/bash

# ============================================
# File Watcher - مراقب الملفات
# يرفع أي تغيير تلقائياً لـ GitHub و Cloudflare
# ============================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PUSH_SCRIPT="$SCRIPT_DIR/auto-push.sh"
INTERVAL=30  # ثانية بين كل فحص

echo "======================================"
echo "  Auto Deploy - نشر تلقائي"
echo "======================================"
echo "📁 مراقبة: $SCRIPT_DIR"
echo "⏱  فحص كل: ${INTERVAL} ثانية"
echo "🎯 GitHub: abo330899-debug/ECHandSKA-1"
echo "🌐 Cloudflare: echandska-1.pages.dev"
echo "======================================"
echo ""

# تحقق من وجود GITHUB_TOKEN
if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ خطأ: GITHUB_TOKEN غير موجود!"
    echo ""
    echo "الحل:"
    echo "  1. روح Replit → Secrets (القفل 🔒 بالجانب)"
    echo "  2. أضف: GITHUB_TOKEN = <your_token>"
    echo "  3. أعد تشغيل هذا السكريبت"
    exit 1
fi

echo "✅ GITHUB_TOKEN موجود"
echo "👀 بدأت مراقبة التغييرات..."
echo ""

# دفع أولي عند البدء
echo "📤 رفع أولي للمشروع..."
bash "$PUSH_SCRIPT"
echo ""

LAST_HASH=""

while true; do
    sleep $INTERVAL

    # احسب hash لكل الملفات
    CURRENT_HASH=$(find "$SCRIPT_DIR" \
        -not -path '*/.git/*' \
        -not -path '*/node_modules/*' \
        -not -name '*.log' \
        -not -name '*.tmp' \
        -type f \
        -printf '%T@%p\n' 2>/dev/null | sort | md5sum 2>/dev/null || \
        find "$SCRIPT_DIR" \
        -not -path '*/.git/*' \
        -not -path '*/node_modules/*' \
        -not -name '*.log' \
        -type f | sort | xargs ls -la 2>/dev/null | md5sum)

    if [ -n "$LAST_HASH" ] && [ "$CURRENT_HASH" != "$LAST_HASH" ]; then
        echo "📁 تم اكتشاف تغييرات! [$(date '+%H:%M:%S')]"
        bash "$PUSH_SCRIPT"
        echo ""
        echo "👀 متابعة المراقبة..."
        echo ""
    fi

    LAST_HASH="$CURRENT_HASH"
done
