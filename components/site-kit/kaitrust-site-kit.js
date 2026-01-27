/**
 * KAITRUST Site Kit - 라이트모드 CSS + A11Y 설정
 * Ask AI, 다크모드 토글은 kaitrust-ai-modal.js에서 담당
 * @version 3.2.0 (중복 제거)
 */

(function() {
    'use strict';
    
    // 테마 상태 (kaitrust-ai-modal.js와 공유)
    let isDark = localStorage.getItem('kaitrust_theme') !== 'light';

    // WIA A11Y Toolkit 설정 - 황금비율!
    window.WIA_A11Y_CONFIG = {
        fabBottom: '78px',
        fabRight: '170px'
    };

    // 스타일 주입 - 라이트모드 CSS만!
    const style = document.createElement('style');
    style.id = 'kaitrust-site-kit-styles';
    style.textContent = `
        /* ========== 라이트 모드 완전 적용 ========== */
        body.light-mode {
            background: #f8fafc !important;
            color: #1e293b !important;
        }

        body.light-mode header {
            background: rgba(255, 255, 255, 0.98) !important;
            border-bottom: 1px solid #e2e8f0 !important;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
        }

        body.light-mode .logo-text,
        body.light-mode nav a,
        body.light-mode .nav-link,
        body.light-mode .nav-about,
        body.light-mode .dropdown-toggle {
            color: #334155 !important;
        }

        body.light-mode .hero {
            background: linear-gradient(180deg, #e0f2fe 0%, #f0f9ff 50%, #ffffff 100%) !important;
        }

        body.light-mode .hero h1,
        body.light-mode .hero-title {
            background: linear-gradient(135deg, #0284c7, #0891b2) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            background-clip: text !important;
        }

        body.light-mode .hero p,
        body.light-mode .hero-subtitle {
            color: #475569 !important;
        }

        body.light-mode h1, 
        body.light-mode h2, 
        body.light-mode h3,
        body.light-mode .services-title {
            color: #0f172a !important;
        }

        body.light-mode .services-section {
            background: #ffffff !important;
        }

        body.light-mode .service-card {
            background: #ffffff !important;
            border: 1px solid #e2e8f0 !important;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.04) !important;
        }

        body.light-mode .service-card:hover {
            border-color: #3b82f6 !important;
            box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15) !important;
        }

        body.light-mode .service-name {
            color: #1e293b !important;
        }

        body.light-mode .service-desc {
            color: #64748b !important;
        }

        body.light-mode .mission-section,
        body.light-mode .laws-section {
            background: #f8fafc !important;
        }

        body.light-mode footer {
            background: #f1f5f9 !important;
            border-top: 1px solid #e2e8f0 !important;
        }

        body.light-mode footer,
        body.light-mode footer p,
        body.light-mode footer span,
        body.light-mode footer a {
            color: #475569 !important;
        }

        body.light-mode .category-filter {
            background: #f1f5f9 !important;
        }

        body.light-mode .filter-btn {
            background: #ffffff !important;
            color: #475569 !important;
            border-color: #e2e8f0 !important;
        }

        body.light-mode .filter-btn.active,
        body.light-mode .filter-btn:hover {
            background: #3b82f6 !important;
            color: white !important;
            border-color: #3b82f6 !important;
        }

        body.light-mode .search-container input {
            background: #ffffff !important;
            border-color: #e2e8f0 !important;
            color: #1e293b !important;
        }

        body.light-mode .dropdown-menu {
            background: #ffffff !important;
            border-color: #e2e8f0 !important;
        }

        body.light-mode .dropdown-menu a {
            color: #334155 !important;
        }

        /* 라이트모드 히어로 통계 숫자 */
        body.light-mode .stats .stat-number {
            color: #0891b2 !important;
        }

        body.light-mode .stats .stat-label {
            color: #64748b !important;
        }

        /* 라이트모드 버튼 */
        body.light-mode .btn-primary {
            background: linear-gradient(135deg, #0284c7, #0891b2) !important;
        }

        body.light-mode .btn-secondary {
            background: #ffffff !important;
            border-color: #0891b2 !important;
            color: #0891b2 !important;
        }
    `;
    document.head.appendChild(style);

    // 초기 테마 적용
    if (!isDark) {
        document.body.classList.add('light-mode');
    }

    console.log('✅ KAITRUST Site Kit v3.2 - 라이트모드 CSS 로드됨 (Ask AI/다크모드는 kaitrust-ai-modal.js)');
})();
