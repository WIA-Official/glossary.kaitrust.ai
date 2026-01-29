/**
 * KAITRUST Site Kit - 통합 헤더/푸터 관리
 * @version 4.6.2
 * 
 * 기능:
 * - 표준 헤더/푸터 자동 생성
 * - 모바일 햄버거 메뉴
 * - WIA Language Modal 211 연동 (211개 언어)
 * 
 * 사용법:
 * <div id="kaitrust-header"></div>
 * <div id="kaitrust-footer"></div>
 * <script src="https://kaitrust.ai/components/site-kit/kaitrust-site-kit.js"></script>
 */

(function() {
    'use strict';
    
    // ========== 표준 메뉴 정의 ==========
    const MENU_CONFIG = {
        about: [
            { name: '인사말', url: 'https://kaitrust.ai/about/greeting/' },
            { name: '연혁', url: 'https://kaitrust.ai/about/history/' },
            { name: '정관', url: 'https://kaitrust.ai/about/articles/' },
            { name: 'CI/BI', url: 'https://kaitrust.ai/about/ci/' },
            { name: '조직도', url: 'https://kaitrust.ai/about/organization/' },
            { name: '오시는길', url: 'https://kaitrust.ai/about/location/' }
        ],
        nav: [
            { name: '컨설팅 신청', url: 'https://consulting.kaitrust.ai', class: 'nav-consulting', key: 'consulting' },
            { name: 'AI 백과사전', url: 'https://glossary.kaitrust.ai', class: 'nav-highlight nav-glossary', key: 'glossary' },
            { name: '전문위원 모집', url: 'https://expert.kaitrust.ai', class: 'nav-highlight', key: 'expert' },
            { name: 'WIA Standards', url: 'https://wiastandards.com', class: 'nav-external nav-wia-box', key: 'wia' },
            { name: '로그인', url: 'https://login.kaitrust.ai', class: 'nav-login', key: 'login' }
        ]
    };

    // ========== Family Sites 데이터 (25개) ==========
    const FAMILY_SITES = [
        { name: 'KONAN', url: 'https://global.thekoreantoday.com' },
        { name: 'WIA Go', url: 'https://wiago.link' },
        { name: 'WIA SIS', url: 'https://wiasis.com' },
        { name: 'WIA Code', url: 'https://wiacode.com' },
        { name: 'WIA Talk', url: 'https://wiatalk.com' },
        { name: 'WIA Trip', url: 'https://wiatrip.com' },
        { name: 'WIA Tools', url: 'https://wia.tools' },
        { name: 'WIA Video', url: 'https://wiavideo.com' },
        { name: 'WIA Live', url: 'https://wia.live' },
        { name: 'CQM Desk', url: 'https://cqmdesk.com' },
        { name: 'WIA Books', url: 'https://wiabooks.store' },
        { name: 'WIA Verse', url: 'https://wiaverse.com' },
        { name: 'WIA Braille', url: 'https://wiabraille.com' },
        { name: 'WIA Journal', url: 'https://wiajournal.com' },
        { name: 'WIA Address', url: 'https://wiaaddress.com' },
        { name: 'WIA Pin Code', url: 'https://wiapincode.com' },
        { name: 'WIA Insurance', url: 'https://smilestory.co.kr' },
        { name: 'WIA Standards', url: 'https://wiastandards.com' },
        { name: 'WIHP 변환기', url: 'https://wihp.wiastandards.com' },
        { name: '논문 표절 검사기', url: 'https://check.wiasis.com' },
        { name: '3D 목업 페이지', url: 'https://wiabooks.store/3D' },
        { name: '한국인공지능진흥협회', url: 'https://kaitrust.ai' },
        { name: '접근성 검사기', url: 'https://a11y.wiabooks.store' },
        { name: 'Digital Guardian', url: 'https://guardian.thekoreantoday.com' },
        { name: '코리안투데이 글로벌', url: 'https://thekoreantoday.com' }
    ];

    // ========== 표준 헤더 HTML ==========
    function generateHeader(currentPage) {
        const aboutMenuItems = MENU_CONFIG.about.map(item => 
            `<a href="${item.url}" target="_blank">${item.name}</a>`
        ).join('\n                        ');

        const navItems = MENU_CONFIG.nav.map(item => {
            const isActive = currentPage === item.key;
            const activeStyle = isActive ? getActiveStyle(item.key) : '';
            return `<a href="${item.url}" target="_blank" class="${item.class}"${activeStyle}>${item.name}</a>`;
        }).join('\n                ');

        // 모바일 메뉴용 아이템
        const mobileAboutItems = MENU_CONFIG.about.map(item => 
            `<a href="${item.url}" target="_blank">${item.name}</a>`
        ).join('\n                    ');

        const mobileNavItems = MENU_CONFIG.nav.map(item => {
            const isActive = currentPage === item.key;
            const activeClass = isActive ? ' active' : '';
            return `<a href="${item.url}" target="_blank" class="${item.class}${activeClass}">${item.name}</a>`;
        }).join('\n                    ');

        return `
    <header>
        <div class="header-content">
            <a href="https://kaitrust.ai" class="logo" style="text-decoration: none;">
                <img src="https://kaitrust.ai/favicon.png" alt="KAITRUST" class="logo-icon">
                <div>
                    <div class="logo-text">KAITRUST</div>
                    <div class="logo-sub">KOREA AI TRUST ASSOCIATION</div>
                </div>
            </a>
            
            <!-- 데스크톱 네비게이션 -->
            <nav class="desktop-nav">
                <div class="nav-dropdown">
                    <a href="https://kaitrust.ai/about/" target="_blank" class="nav-dropdown-trigger nav-brand-text">KAI TRUST <span class="dropdown-arrow">▼</span></a>
                    <div class="nav-dropdown-menu">
                        ${aboutMenuItems}
                    </div>
                </div>
                ${navItems}
                <button class="nav-lang" aria-label="언어 선택"><span class="globe-icon">🌐</span><span id="desktopLangCode">KO</span><span class="chevron">▼</span></button>
            </nav>
            
            <!-- 모바일 헤더용 언어 버튼 (햄버거 앞) -->
            <button class="nav-lang mobile-header-lang" aria-label="언어 선택" onclick="openLanguageModal()"><span class="globe-icon">🌐</span><span id="mobileLangCode">KO</span><span class="chevron">▼</span></button>
            
            <!-- 모바일 햄버거 버튼 -->
            <button class="mobile-menu-btn" aria-label="메뉴 열기">
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
            </button>
        </div>
        
        <!-- 모바일 메뉴 -->
        <div class="mobile-nav">
            <div class="mobile-nav-content">
                <div class="mobile-nav-section">
                    <div class="mobile-nav-title nav-brand-text-mobile">KAITRUST</div>
                    ${mobileAboutItems}
                </div>
                <div class="mobile-nav-section">
                    <div class="mobile-nav-title">서비스</div>
                    ${mobileNavItems}
                </div>
                <div class="mobile-nav-section">
                    <button class="nav-lang mobile-lang" aria-label="언어 선택">🌐 언어 선택 (211개 언어)</button>
                </div>
            </div>
        </div>
    </header>`;
    }

    // 현재 페이지 활성 스타일
    function getActiveStyle(key) {
        const styles = {
            consulting: ' style="background: var(--success, #10b981); color: var(--dark, #0a0a0f);"',
            expert: ' style="background: var(--warning, #f59e0b); color: var(--dark, #0a0a0f);"',
            glossary: ' style="background: var(--primary, #00f5ff); color: var(--dark, #0a0a0f);"'
        };
        return styles[key] || '';
    }

    // ========== 표준 푸터 HTML ==========
    function generateFooter() {
        const currentYear = new Date().getFullYear();
        
        return `
    <footer id="about" style="background: #1e293b !important; color: #e2e8f0 !important;">
        <div class="footer-content">
            <div class="footer-main">
                <div class="footer-brand">
                    <h3>KAITRUST</h3>
                    <p style="color: #94a3b8 !important;">한국인공지능진흥협회는 민법 제32조에 따라 설립된 비영리단체로, 대한민국 AI 산업의 건전한 발전과 신뢰 기반 조성을 위해 노력합니다.</p>
                </div>
                
                <div class="footer-section">
                    <h4 style="color: #ffffff !important;">바로가기</h4>
                    <ul>
                        <li><a href="https://kaitrust.ai/#services">🏢 서비스</a></li>
                        <li><a href="https://consulting.kaitrust.ai" target="_blank" style="color: #10b981;">🎯 컨설팅 신청</a></li>
                        <li><a href="https://glossary.kaitrust.ai" target="_blank" style="color: #00f5ff;">📖 AI 백과사전</a></li>
                        <li><a href="https://expert.kaitrust.ai" target="_blank" style="color: #f59e0b;">🔥 전문위원 모집</a></li>
                        <li><a href="https://wiastandards.com" target="_blank" style="color: #a855f7;">🌐 WIA Standards</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h4 style="color: #ffffff !important;">협회 정보</h4>
                    <div class="footer-info">
                        <p style="color: #e2e8f0 !important;"><strong style="color: #ffffff !important;">한국인공지능진흥협회</strong></p>
                        <p style="color: #cbd5e1 !important;">회장: 연삼흠, Ph.D.</p>
                        <p style="color: #cbd5e1 !important;">사업자등록번호: 129-82-89277</p>
                        <p style="color: #cbd5e1 !important;">서울 강서구 마곡중앙6로 21, 507호 D14</p>
                        <p style="color: #cbd5e1 !important;">(마곡동, 이너매스마곡1차)</p>
                    </div>
                </div>
                
                <div class="footer-section" id="contact">
                    <h4 style="color: #ffffff !important;">문의</h4>
                    <div class="footer-info">
                        <p style="color: #cbd5e1 !important;">Tel: +82-70-7101-7878</p>
                        <p>📩 <a href="mailto:contact@kaitrust.ai" style="color: #00f5ff !important;">contact@kaitrust.ai</a></p>
                        <p><span style="text-decoration: none;">💼</span> <a href="https://consulting.kaitrust.ai" target="_blank" style="color: #a5f3fc !important;">컨설팅 신청</a> <span style="color: #94a3b8;">|</span> <span style="text-decoration: none;">🤝</span> <a href="https://kaitrust.ai/signup" target="_blank" style="color: #c4b5fd !important;">협회 가입</a></p>
                        <p style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1);">
                            <a href="https://kaitrust.ai/privacy/" target="_blank" style="color: #e2e8f0; font-size: 0.95rem; text-decoration: none; transition: color 0.3s;">📋 개인정보처리방침</a>
                            <span style="color: #475569; margin: 0 0.75rem;">|</span>
                            <a href="https://kaitrust.ai/terms/" target="_blank" style="color: #e2e8f0; font-size: 0.95rem; text-decoration: none; transition: color 0.3s;">📜 이용약관</a>
                        </p>
                    </div>
                </div>
                
                <div class="footer-section">
                    <h4 style="color: #ffffff !important;">Family Site</h4>
                    <div class="footer-info">
                        <button class="family-site-btn" id="familySiteBtn">
                            🌐 Family Sites (25)
                        </button>
                        <p style="color: #64748b; font-size: 0.8rem; margin-top: 0.5rem;">SmileStory Group</p>
                    </div>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p style="margin-bottom: 0.75rem; padding: 0.6rem 1.2rem; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 8px; display: inline-block; color: #f1f5f9 !important;">
                    🔥 <a href="https://expert.kaitrust.ai" target="_blank" style="color: #fef08a !important; text-decoration: none; font-weight: 600;">AI 컴플라이언스 전문위원 상시 모집</a> <span style="color: #e2e8f0 !important;">- 협회와 함께 대한민국 AI 신뢰 기반을 만들어가세요</span>
                </p>
                <p style="color: #cbd5e1 !important;">© ${currentYear} <span class="highlight" style="color: #00f5ff !important;">한국인공지능진흥협회</span> - BENEFIT ALL HUMANITY</p>
            </div>
        </div>
    </footer>`;
    }

    // ========== 표준 CSS ==========
    const siteKitCSS = `
/* ========== KAITRUST Site Kit v4.6 CSS ========== */

/* 헤더 기본 */
header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: rgba(3, 0, 20, 0.95);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(99, 102, 241, 0.2);
    padding: 1rem 2rem;
}

.header-content {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    display: flex;
    align-items: center;
    gap: 1rem;
    text-decoration: none;
}

.logo-icon {
    width: 45px;
    height: 45px;
    border-radius: 10px;
}

.logo-text {
    font-family: 'Orbitron', monospace;
    font-size: 1.4rem;
    font-weight: 700;
    background: linear-gradient(135deg, #6366F1 0%, #A855F7 50%, #22D3EE 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.logo-sub {
    font-size: 0.7rem;
    color: #94a3b8;
    letter-spacing: 2px;
}

/* 데스크톱 네비게이션 */
.desktop-nav {
    display: flex;
    gap: 1.5rem;
    align-items: center;
}

.desktop-nav a {
    color: #94a3b8;
    text-decoration: none;
    font-size: 0.9rem;
    transition: all 0.3s;
}

.desktop-nav a:hover {
    color: #00f5ff;
}

/* 협회소개 드롭다운 */
.nav-dropdown {
    position: relative;
}

.nav-dropdown-trigger {
    cursor: pointer;
}

.dropdown-arrow {
    font-size: 0.7em;
    margin-left: 4px;
}

.nav-dropdown-menu {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    background: rgba(15, 5, 36, 0.98);
    border: 1px solid rgba(99, 102, 241, 0.3);
    border-radius: 8px;
    padding: 0.5rem 0;
    min-width: 140px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    z-index: 1001;
}

.nav-dropdown:hover .nav-dropdown-menu {
    display: block;
}

.nav-dropdown-menu a {
    display: block;
    padding: 0.6rem 1rem;
    color: #e2e8f0 !important;
    white-space: nowrap;
}

.nav-dropdown-menu a:hover {
    background: rgba(99, 102, 241, 0.2);
    color: #00f5ff !important;
}

/* 네비게이션 버튼 스타일 */
.desktop-nav a.nav-highlight {
    color: #f59e0b;
    border: 1px solid #f59e0b;
    padding: 0.3rem 0.75rem;
    border-radius: 4px;
}

.desktop-nav a.nav-highlight:hover {
    background: #f59e0b;
    color: #0a0a0f;
}

.desktop-nav a.nav-glossary {
    color: #00f5ff;
    border-color: #00f5ff;
}

.desktop-nav a.nav-glossary:hover {
    background: #00f5ff;
    color: #0a0a0f;
}

.desktop-nav a.nav-consulting {
    color: #10b981;
    border: 1px solid #10b981;
    padding: 0.3rem 0.75rem;
    border-radius: 4px;
}

.desktop-nav a.nav-consulting:hover {
    background: #10b981;
    color: #0a0a0f;
}

.desktop-nav a.nav-external {
    color: #a855f7;
}

.desktop-nav a.nav-external:hover {
    color: #c084fc;
}

/* WIA Standards 보라색 박스 */
.desktop-nav a.nav-wia-box {
    color: #a855f7;
    border: 1px solid #a855f7;
    padding: 0.3rem 0.75rem;
    border-radius: 4px;
}

.desktop-nav a.nav-wia-box:hover {
    background: #a855f7;
    color: #0a0a0f;
}

/* KAITRUST 드롭다운 로고 색상 */
.nav-brand-text {
    font-family: 'Orbitron', monospace !important;
    font-weight: 700 !important;
    background: linear-gradient(135deg, #6366F1 0%, #A855F7 50%, #22D3EE 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.nav-brand-text:hover {
    background: linear-gradient(135deg, #818CF8 0%, #C084FC 50%, #67E8F9 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.nav-brand-text .dropdown-arrow {
    -webkit-text-fill-color: #94a3b8;
}

/* 모바일 KAITRUST 타이틀 */
.nav-brand-text-mobile {
    font-family: 'Orbitron', monospace !important;
    background: linear-gradient(135deg, #6366F1 0%, #A855F7 50%, #22D3EE 100%) !important;
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    background-clip: text !important;
}

.desktop-nav a.nav-login {
    color: #6366F1;
    border: 1px solid #6366F1;
    padding: 0.3rem 0.75rem;
    border-radius: 4px;
}

.desktop-nav a.nav-login:hover {
    background: #6366F1;
    color: #0a0a0f;
}

.nav-lang {
    background: transparent;
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 6px;
    padding: 6px 12px;
    cursor: pointer;
    font-size: 0.95em;
    transition: all 0.3s;
    color: white;
    display: flex;
    align-items: center;
    gap: 5px;
}
.nav-lang .globe-icon {
    font-size: 1.1em;
}
.nav-lang .chevron {
    font-size: 0.7em;
    opacity: 0.7;
}

.nav-lang:hover {
    border-color: rgba(0, 245, 255, 0.5);
    background: rgba(0, 245, 255, 0.1);
}

/* 햄버거 메뉴 버튼 */
.mobile-menu-btn {
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 44px;
    height: 44px;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    cursor: pointer;
    padding: 8px;
    gap: 5px;
    transition: all 0.3s;
}

.mobile-menu-btn:hover {
    border-color: #00f5ff;
    background: rgba(0, 245, 255, 0.1);
}

.hamburger-line {
    width: 24px;
    height: 2px;
    background: #e2e8f0;
    border-radius: 2px;
    transition: all 0.3s;
}

.mobile-menu-btn.active .hamburger-line:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
}

.mobile-menu-btn.active .hamburger-line:nth-child(2) {
    opacity: 0;
}

.mobile-menu-btn.active .hamburger-line:nth-child(3) {
    transform: rotate(-45deg) translate(5px, -5px);
}

/* 모바일 메뉴 */
.mobile-nav {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(10, 5, 25, 0.98);
    border-bottom: 1px solid rgba(99, 102, 241, 0.3);
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
}

.mobile-nav.active {
    max-height: 80vh;
    overflow-y: auto;
}

.mobile-nav-content {
    padding: 1rem 2rem 2rem;
}

.mobile-nav-section {
    margin-bottom: 1.5rem;
}

.mobile-nav-title {
    color: #00f5ff;
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 0.75rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(99, 102, 241, 0.2);
}

.mobile-nav-section a {
    display: block;
    padding: 0.75rem 0;
    color: #e2e8f0;
    text-decoration: none;
    font-size: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    transition: all 0.3s;
}

.mobile-nav-section a:hover,
.mobile-nav-section a.active {
    color: #00f5ff;
    padding-left: 0.5rem;
}

.mobile-nav-section a.nav-highlight {
    color: #f59e0b;
}

.mobile-nav-section a.nav-glossary {
    color: #00f5ff;
}

.mobile-nav-section a.nav-consulting {
    color: #10b981;
}

.mobile-nav-section a.nav-external {
    color: #a855f7;
    border: 1px solid #a855f7;
    border-radius: 4px;
    padding: 0.75rem;
    text-align: center;
    margin-top: 0.5rem;
}

.mobile-nav-section a.nav-external:hover {
    background: rgba(168, 85, 247, 0.2);
}

.mobile-lang {
    width: 100%;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    justify-content: center;
}

/* ========== 푸터 CSS ========== */
footer {
    background: #1e293b !important;
    padding: 4rem 2rem 2rem;
}

.footer-content {
    max-width: 1400px;
    margin: 0 auto;
}

.footer-main {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 2rem;
    margin-bottom: 2rem;
}

@media (max-width: 1200px) {
    .footer-main {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 768px) {
    .footer-main {
        grid-template-columns: 1fr;
    }
}

.footer-brand h3 {
    font-family: 'Orbitron', monospace;
    font-size: 1.5rem;
    color: #00f5ff;
    margin-bottom: 1rem;
}

.footer-section h4 {
    color: #ffffff;
    font-size: 1rem;
    margin-bottom: 1rem;
    font-weight: 600;
}

.footer-section ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.footer-section ul li {
    margin-bottom: 0.5rem;
}

.footer-section ul li a {
    color: #94a3b8;
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.3s;
}

.footer-section ul li a:hover {
    color: #00f5ff;
}

.footer-info p {
    color: #cbd5e1;
    font-size: 0.85rem;
    margin-bottom: 0.4rem;
}

.footer-bottom {
    text-align: center;
    padding-top: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* ========== Family Site 버튼 & 모달 ========== */
.family-site-btn {
    background: linear-gradient(135deg, rgba(0, 245, 255, 0.1), rgba(168, 85, 247, 0.1));
    border: 1px solid rgba(0, 245, 255, 0.3);
    color: #00f5ff;
    padding: 0.75rem 1.25rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 500;
    transition: all 0.3s;
    width: 100%;
}

.family-site-btn:hover {
    background: linear-gradient(135deg, rgba(0, 245, 255, 0.2), rgba(168, 85, 247, 0.2));
    border-color: #00f5ff;
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(0, 245, 255, 0.3);
}

.family-site-modal {
    display: none;
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 1200px;
    z-index: 9999;
}

.family-site-modal.active {
    display: block;
    animation: slideUpFromBottom 0.3s ease;
}

@keyframes slideUpFromBottom {
    from { 
        opacity: 0;
        transform: translateX(-50%) translateY(30px);
    }
    to { 
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
}

.family-site-modal-content {
    background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
    border: 2px solid rgba(0, 245, 255, 0.3);
    border-radius: 20px;
    max-height: 60vh;
    overflow-y: auto;
    box-shadow: 0 -20px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0, 245, 255, 0.1);
}

.family-site-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 2rem;
    border-bottom: 1px solid rgba(0, 245, 255, 0.2);
    position: sticky;
    top: 0;
    background: rgba(15, 23, 42, 0.98);
    backdrop-filter: blur(10px);
    color: #00f5ff;
    font-size: 1.1rem;
    font-weight: 600;
}

.family-site-close {
    background: transparent;
    border: none;
    color: #94a3b8;
    font-size: 1.75rem;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    line-height: 1;
    transition: all 0.3s;
}

.family-site-close:hover {
    color: #f43f5e;
}

.family-site-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    padding: 1.5rem 2rem 2rem;
}

.family-site-item {
    background: rgba(15, 23, 42, 0.8);
    border: 1px solid rgba(0, 245, 255, 0.2);
    border-radius: 12px;
    padding: 1.25rem;
    text-decoration: none;
    transition: all 0.3s;
    display: block;
}

.family-site-item:hover {
    border-color: #00f5ff;
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(0, 245, 255, 0.2);
}

.family-site-name {
    color: #00f5ff;
    font-weight: 600;
    font-size: 1rem;
    margin-bottom: 0.4rem;
}

.family-site-url {
    color: #64748b;
    font-size: 0.8rem;
}

/* Family Site 모달 반응형 */
@media (max-width: 1024px) {
    .family-site-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 768px) {
    .family-site-grid {
        grid-template-columns: repeat(2, 1fr);
        padding: 1rem;
        gap: 0.75rem;
    }
    
    .family-site-item {
        padding: 1rem;
    }
    
    .family-site-modal-header {
        padding: 1rem 1.5rem;
        font-size: 1rem;
    }
}

@media (max-width: 480px) {
    .family-site-grid {
        grid-template-columns: 1fr;
    }
}

/* 모바일 헤더용 언어 버튼 (PC에서 숨김) */
.mobile-header-lang {
    display: none;
    align-items: center;
    gap: 4px;
    padding: 6px 10px;
    font-size: 13px;
    font-weight: 600;
}
.mobile-header-lang .globe-icon {
    font-size: 14px;
}
.mobile-header-lang #mobileLangCode {
    color: white;
}
.mobile-header-lang .chevron {
    font-size: 10px;
    opacity: 0.8;
}

/* ========== 반응형 ========== */
@media (max-width: 1024px) {
    .desktop-nav {
        display: none;
    }
    
    .mobile-header-lang {
        display: flex;
        margin-right: 0.1rem;
    }
    
    .mobile-menu-btn {
        display: flex;
    }
    
    .mobile-nav {
        display: block;
    }
}

@media (max-width: 768px) {
    header {
        padding: 0.75rem 1rem;
    }
    
    .logo-text {
        font-size: 1.2rem;
    }
    
    .logo-sub {
        font-size: 0.6rem;
        letter-spacing: 1px;
    }
    
    .logo-icon {
        width: 38px;
        height: 38px;
    }
    
    .mobile-nav-content {
        padding: 1rem;
    }
    
    .footer-main {
        text-align: center;
    }
    
    .footer-section ul {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.5rem 1rem;
    }
    
    .footer-section ul li {
        margin-bottom: 0;
    }
}
`;

    // ========== 초기화 ==========
    function init() {
        // CSS 삽입
        const style = document.createElement('style');
        style.id = 'kaitrust-site-kit-styles';
        style.textContent = siteKitCSS;
        document.head.appendChild(style);

        // DOM 로드 후 실행
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', onDOMReady);
        } else {
            onDOMReady();
        }
    }

    // ========== Family Site 모달 HTML 생성 ==========
    function generateFamilySiteModal() {
        const siteItems = FAMILY_SITES.map(site => {
            const domain = site.url.replace('https://', '');
            return `<a href="${site.url}" target="_blank" class="family-site-item">
                <div class="family-site-name">${site.name}</div>
                <div class="family-site-url">${domain}</div>
            </a>`;
        }).join('');

        return `
        <div class="family-site-modal" id="familySiteModal">
            <div class="family-site-modal-content">
                <div class="family-site-modal-header">
                    <span>🌐 SmileStory Group Family Sites</span>
                    <button class="family-site-close" id="familySiteClose">&times;</button>
                </div>
                <div class="family-site-grid">
                    ${siteItems}
                </div>
            </div>
        </div>`;
    }

    function onDOMReady() {
        // 현재 페이지 감지
        const currentPage = detectCurrentPage();
        
        // 헤더 삽입
        const headerContainer = document.getElementById('kaitrust-header');
        if (headerContainer) {
            headerContainer.outerHTML = generateHeader(currentPage);
        }

        // 푸터 삽입
        const footerContainer = document.getElementById('kaitrust-footer');
        if (footerContainer) {
            footerContainer.outerHTML = generateFooter();
        }

        // WIA Language Modal 211 로드
        loadLanguageModal();

        // Family Site 모달 삽입
        if (!document.getElementById('familySiteModal')) {
            document.body.insertAdjacentHTML('beforeend', generateFamilySiteModal());
        }

        // 이벤트 바인딩
        bindEvents();

        console.log('✅ KAITRUST Site Kit v4.6 로드 완료!');
    }

    function detectCurrentPage() {
        const host = window.location.hostname;
        if (host.includes('consulting')) return 'consulting';
        if (host.includes('expert')) return 'expert';
        if (host.includes('glossary')) return 'glossary';
        return null;
    }

    function loadLanguageModal() {
        // 이미 로드되었는지 확인
        if (window.wiaLangModal || document.getElementById('wia-language-modal-script')) {
            console.log('✅ WIA Language Modal 이미 로드됨');
            return;
        }

        // WIA Language Modal 211 스크립트 로드
        const script = document.createElement('script');
        script.id = 'wia-language-modal-script';
        script.src = 'https://kaitrust.ai/components/language-modal/wia-language-modal-211.js';
        script.onload = function() {
            // expert.kaitrust.ai와 동일한 방식으로 초기화
            if (typeof WIALanguageModal !== 'undefined') {
                window.wiaLangModal = new WIALanguageModal();
                window.wiaLangModal.init();
                console.log('✅ WIA Language Modal 211 초기화 완료!');
            }
        };
        document.body.appendChild(script);
    }

    function bindEvents() {
        // 모바일 메뉴 토글
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileNav = document.querySelector('.mobile-nav');
        
        if (mobileMenuBtn && mobileNav) {
            mobileMenuBtn.addEventListener('click', function() {
                this.classList.toggle('active');
                mobileNav.classList.toggle('active');
            });
        }

        // 언어 버튼 클릭 (데스크톱 + 모바일)
        document.querySelectorAll('.nav-lang').forEach(btn => {
            btn.addEventListener('click', function() {
                // WIA Language Modal 211 열기 (expert.kaitrust.ai와 동일한 방식)
                if (window.wiaLangModal && typeof window.wiaLangModal.open === 'function') {
                    window.wiaLangModal.open();
                } else {
                    console.warn('⚠️ 언어 모달을 불러오는 중입니다...');
                }
            });
        });

        // Family Site 버튼 클릭
        const familySiteBtn = document.getElementById('familySiteBtn');
        const familySiteModal = document.getElementById('familySiteModal');
        const familySiteClose = document.getElementById('familySiteClose');

        if (familySiteBtn && familySiteModal) {
            familySiteBtn.addEventListener('click', function() {
                familySiteModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }

        if (familySiteClose && familySiteModal) {
            familySiteClose.addEventListener('click', function() {
                familySiteModal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        // Family Site 모달 외부 클릭으로 닫기
        if (familySiteModal) {
            familySiteModal.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }

        // 저장된 언어로 언어 코드 표시 (PC + 모바일)
        const savedLang = localStorage.getItem('wiabooks_language') || localStorage.getItem('kt_language') || 'ko';
        const langCode = savedLang.toUpperCase().substring(0, 2);
        const desktopLangCode = document.getElementById('desktopLangCode');
        const mobileLangCode = document.getElementById('mobileLangCode');
        if (desktopLangCode) desktopLangCode.textContent = langCode;
        if (mobileLangCode) mobileLangCode.textContent = langCode;

        // 언어 변경 이벤트 리스너 (PC + 모바일)
        window.addEventListener('wia-language-changed', function(e) {
            const lang = e.detail?.language || 'ko';
            const langCode = lang.toUpperCase().substring(0, 2);
            const desktopEl = document.getElementById('desktopLangCode');
            const mobileEl = document.getElementById('mobileLangCode');
            if (desktopEl) desktopEl.textContent = langCode;
            if (mobileEl) mobileEl.textContent = langCode;
        });
    }

    // 전역 API 노출
    window.KAITRUSTSiteKit = {
        version: '4.6.2',
        loadLanguageModal: loadLanguageModal
    };

    // 시작
    init();
})();
