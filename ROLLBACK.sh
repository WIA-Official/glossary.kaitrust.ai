#!/bin/bash
# ==========================================
# 🔄 glossary.kaitrust.ai 롤백 스크립트
# 실행: sudo bash /var/www/glossary.kaitrust.ai/ROLLBACK.sh
# ==========================================

BACKUP="/var/www/glossary.kaitrust.ai/BACKUP_SITEKIT_20260128_070022"

echo "🔄 롤백 시작..."

# index.html 복원
sudo cp $BACKUP/index.html /var/www/glossary.kaitrust.ai/
echo "✅ index.html 복원"

# term.html 복원
sudo cp $BACKUP/term.html /var/www/glossary.kaitrust.ai/
echo "✅ term.html 복원"

# site-kit 복원
sudo rm -rf /var/www/glossary.kaitrust.ai/components/site-kit
sudo cp -r $BACKUP/site-kit /var/www/glossary.kaitrust.ai/components/
echo "✅ site-kit 복원"

# 권한 설정
sudo chown -R apache:apache /var/www/glossary.kaitrust.ai/

echo ""
echo "🎉 롤백 완료! 확인: https://glossary.kaitrust.ai/"
