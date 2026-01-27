/**
 * KAITRUST Mobile Navigation - Site Kit Component
 * Version: 1.0.0
 *
 * Automatically adds hamburger menu to all KAITRUST sites
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        breakpoint: 768,
        animationDuration: 300
    };

    // Menu structure - matches main site navigation
    const MENU_ITEMS = [
        {
            type: 'accordion',
            label: '협회소개',
            children: [
                { label: '인사말', url: '/about/greeting' },
                { label: '연혁', url: '/about/history' },
                { label: '조직도', url: '/about/organization' },
                { label: '정관', url: '/about/articles' },
                { label: '오시는 길', url: '/about/location' },
                { label: 'CI/BI', url: '/about/ci' }
            ]
        },
        { type: 'link', label: '서비스', url: '/#services' },
        { type: 'link', label: '전문위원 모집', url: '/expert', highlight: true },
        { type: 'link', label: 'AI 백과사전', url: '/glossary', highlight: true },
        { type: 'external', label: 'WIA Standards', url: 'https://wiastandards.com' }
    ];

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        // Only initialize if on mobile viewport or if hamburger needed
        injectStyles();
        createMobileNav();
        bindEvents();
    }

    function injectStyles() {
        // Check if styles already injected
        if (document.getElementById('kaitrust-mobile-nav-styles')) return;

        const link = document.createElement('link');
        link.id = 'kaitrust-mobile-nav-styles';
        link.rel = 'stylesheet';
        link.href = '/components/mobile-nav/kaitrust-mobile-nav.css';
        document.head.appendChild(link);
    }

    function createMobileNav() {
        // Find header element
        const header = document.querySelector('header');
        if (!header) return;

        // Check if hamburger already exists
        if (document.querySelector('.kaitrust-mobile-menu-btn')) return;

        // Create hamburger button
        const hamburgerBtn = document.createElement('button');
        hamburgerBtn.className = 'kaitrust-mobile-menu-btn';
        hamburgerBtn.setAttribute('aria-label', '메뉴 열기');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        hamburgerBtn.innerHTML = `
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
        `;

        // Insert hamburger button into header
        const headerNav = header.querySelector('nav');
        if (headerNav) {
            headerNav.parentNode.insertBefore(hamburgerBtn, headerNav.nextSibling);
        } else {
            header.appendChild(hamburgerBtn);
        }

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'kaitrust-mobile-overlay';
        document.body.appendChild(overlay);

        // Create mobile nav panel
        const mobileNav = document.createElement('div');
        mobileNav.className = 'kaitrust-mobile-nav';
        mobileNav.setAttribute('role', 'navigation');
        mobileNav.setAttribute('aria-label', '모바일 메뉴');
        mobileNav.innerHTML = createMobileNavContent();
        document.body.appendChild(mobileNav);
    }

    function createMobileNavContent() {
        let menuHTML = '';

        MENU_ITEMS.forEach(item => {
            if (item.type === 'accordion') {
                menuHTML += createAccordion(item);
            } else if (item.type === 'external') {
                menuHTML += `
                    <a href="${item.url}" target="_blank" rel="noopener"
                       class="kaitrust-mobile-nav-item">
                        ${item.label} <span style="font-size:0.8em;">↗</span>
                    </a>
                `;
            } else {
                const highlightClass = item.highlight ? ' highlight' : '';
                menuHTML += `
                    <a href="${item.url}" class="kaitrust-mobile-nav-item${highlightClass}">
                        ${item.label}
                    </a>
                `;
            }
        });

        return `
            <div class="kaitrust-mobile-nav-header">
                <span class="kaitrust-mobile-nav-logo">KAITRUST</span>
                <button class="kaitrust-mobile-nav-close" aria-label="메뉴 닫기">✕</button>
            </div>
            <div class="kaitrust-mobile-nav-menu">
                ${menuHTML}
            </div>
            <div class="kaitrust-mobile-nav-footer">
                <a href="/login" class="kaitrust-mobile-nav-login">로그인</a>
                <a href="https://wiastandards.com" target="_blank" rel="noopener"
                   class="kaitrust-mobile-nav-external">
                    WIA Standards 바로가기 ↗
                </a>
            </div>
        `;
    }

    function createAccordion(item) {
        let childrenHTML = item.children.map(child =>
            `<a href="${child.url}">${child.label}</a>`
        ).join('');

        return `
            <div class="kaitrust-mobile-accordion">
                <button class="kaitrust-mobile-accordion-trigger"
                        aria-expanded="false"
                        aria-controls="accordion-${item.label}">
                    ${item.label}
                    <span class="kaitrust-mobile-accordion-arrow">▼</span>
                </button>
                <div class="kaitrust-mobile-accordion-content"
                     id="accordion-${item.label}">
                    ${childrenHTML}
                </div>
            </div>
        `;
    }

    function bindEvents() {
        // Hamburger button click
        document.addEventListener('click', function(e) {
            const hamburgerBtn = e.target.closest('.kaitrust-mobile-menu-btn');
            if (hamburgerBtn) {
                toggleMobileMenu();
                return;
            }

            // Close button click
            const closeBtn = e.target.closest('.kaitrust-mobile-nav-close');
            if (closeBtn) {
                closeMobileMenu();
                return;
            }

            // Overlay click
            if (e.target.classList.contains('kaitrust-mobile-overlay')) {
                closeMobileMenu();
                return;
            }

            // Accordion trigger click
            const accordionTrigger = e.target.closest('.kaitrust-mobile-accordion-trigger');
            if (accordionTrigger) {
                toggleAccordion(accordionTrigger);
                return;
            }

            // Navigation link click (close menu)
            const navLink = e.target.closest('.kaitrust-mobile-nav-item, .kaitrust-mobile-accordion-content a');
            if (navLink) {
                closeMobileMenu();
            }
        });

        // Keyboard events
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeMobileMenu();
            }
        });

        // Handle resize
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if (window.innerWidth > CONFIG.breakpoint) {
                    closeMobileMenu();
                }
            }, 100);
        });
    }

    function toggleMobileMenu() {
        const hamburgerBtn = document.querySelector('.kaitrust-mobile-menu-btn');
        const overlay = document.querySelector('.kaitrust-mobile-overlay');
        const mobileNav = document.querySelector('.kaitrust-mobile-nav');

        if (!hamburgerBtn || !overlay || !mobileNav) return;

        const isOpen = hamburgerBtn.classList.contains('active');

        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    function openMobileMenu() {
        const hamburgerBtn = document.querySelector('.kaitrust-mobile-menu-btn');
        const overlay = document.querySelector('.kaitrust-mobile-overlay');
        const mobileNav = document.querySelector('.kaitrust-mobile-nav');

        hamburgerBtn.classList.add('active');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
        hamburgerBtn.setAttribute('aria-label', '메뉴 닫기');
        overlay.classList.add('active');
        mobileNav.classList.add('active');
        document.body.classList.add('kaitrust-mobile-menu-open');

        // Focus first menu item
        const firstItem = mobileNav.querySelector('.kaitrust-mobile-nav-close');
        if (firstItem) firstItem.focus();
    }

    function closeMobileMenu() {
        const hamburgerBtn = document.querySelector('.kaitrust-mobile-menu-btn');
        const overlay = document.querySelector('.kaitrust-mobile-overlay');
        const mobileNav = document.querySelector('.kaitrust-mobile-nav');

        if (!hamburgerBtn) return;

        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        hamburgerBtn.setAttribute('aria-label', '메뉴 열기');

        if (overlay) overlay.classList.remove('active');
        if (mobileNav) mobileNav.classList.remove('active');

        document.body.classList.remove('kaitrust-mobile-menu-open');
    }

    function toggleAccordion(trigger) {
        const accordion = trigger.closest('.kaitrust-mobile-accordion');
        const isOpen = accordion.classList.contains('active');

        // Close all other accordions
        document.querySelectorAll('.kaitrust-mobile-accordion').forEach(acc => {
            acc.classList.remove('active');
            acc.querySelector('.kaitrust-mobile-accordion-trigger')
               .setAttribute('aria-expanded', 'false');
        });

        // Toggle current accordion
        if (!isOpen) {
            accordion.classList.add('active');
            trigger.setAttribute('aria-expanded', 'true');
        }
    }

    // Expose API for external use
    window.KaitrustMobileNav = {
        open: openMobileMenu,
        close: closeMobileMenu,
        toggle: toggleMobileMenu
    };

})();
