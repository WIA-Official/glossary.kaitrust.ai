/**
 * KAITRUST Accessibility (A11y) - Site Kit Component
 * Version: 1.0.0
 *
 * Automatically adds accessibility features to all KAITRUST sites:
 * - Skip to main content link
 * - ARIA labels and roles
 * - Keyboard navigation
 * - Focus management
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        skipLinkText: '본문 바로가기',
        mainContentId: 'main-content'
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        injectStyles();
        addSkipLink();
        addAriaRoles();
        enhanceKeyboardNav();
        enhanceForms();
        enhanceDropdowns();
    }

    function injectStyles() {
        // Check if styles already injected
        if (document.getElementById('kaitrust-a11y-styles')) return;

        const style = document.createElement('style');
        style.id = 'kaitrust-a11y-styles';
        style.textContent = `
            /* Skip Link */
            .kaitrust-skip-link {
                position: fixed;
                top: -100px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(90deg, #3b82f6, #8b5cf6);
                color: white;
                padding: 12px 24px;
                border-radius: 0 0 8px 8px;
                text-decoration: none;
                font-weight: 600;
                font-size: 14px;
                z-index: 100000;
                transition: top 0.3s ease;
                box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);
            }

            .kaitrust-skip-link:focus {
                top: 0;
                outline: none;
            }

            /* Focus Visible Styles */
            :focus-visible {
                outline: 3px solid #3b82f6 !important;
                outline-offset: 2px !important;
            }

            /* Remove default focus for mouse users */
            :focus:not(:focus-visible) {
                outline: none;
            }

            /* Enhanced focus for interactive elements */
            button:focus-visible,
            a:focus-visible,
            input:focus-visible,
            select:focus-visible,
            textarea:focus-visible,
            [tabindex]:focus-visible {
                outline: 3px solid #3b82f6 !important;
                outline-offset: 2px !important;
                box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.2) !important;
            }

            /* Card focus */
            .card:focus-visible,
            [class*="card"]:focus-visible {
                outline: 3px solid #3b82f6 !important;
                outline-offset: 4px !important;
            }

            /* Dropdown menu focus */
            .nav-dropdown-menu a:focus-visible {
                background: rgba(59, 130, 246, 0.2);
                outline: 2px solid #3b82f6;
                outline-offset: -2px;
            }

            /* High contrast mode support */
            @media (prefers-contrast: high) {
                :focus-visible {
                    outline: 3px solid currentColor !important;
                }
            }

            /* Reduced motion support */
            @media (prefers-reduced-motion: reduce) {
                .kaitrust-skip-link {
                    transition: none;
                }
            }

            /* Screen reader only content */
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            }

            /* Focus trap indicator */
            [data-focus-trap="true"] {
                position: relative;
            }

            [data-focus-trap="true"]::after {
                content: '';
                position: absolute;
                inset: -4px;
                border: 2px dashed rgba(59, 130, 246, 0.3);
                border-radius: 8px;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.2s;
            }

            [data-focus-trap="true"]:focus-within::after {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }

    function addSkipLink() {
        // Check if skip link already exists
        if (document.querySelector('.kaitrust-skip-link')) return;

        // Find or create main content
        let mainContent = document.querySelector('main') ||
                          document.querySelector('#main-content') ||
                          document.querySelector('.main-content');

        if (mainContent) {
            if (!mainContent.id) {
                mainContent.id = CONFIG.mainContentId;
            }
        } else {
            // Find first major content section
            const firstSection = document.querySelector('section') ||
                                document.querySelector('.hero') ||
                                document.querySelector('[class*="hero"]');
            if (firstSection) {
                firstSection.id = CONFIG.mainContentId;
                mainContent = firstSection;
            }
        }

        // Create skip link
        const skipLink = document.createElement('a');
        skipLink.href = '#' + (mainContent ? mainContent.id : CONFIG.mainContentId);
        skipLink.className = 'kaitrust-skip-link';
        skipLink.textContent = CONFIG.skipLinkText;

        // Insert at very beginning of body
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    function addAriaRoles() {
        // Header
        const header = document.querySelector('header');
        if (header && !header.getAttribute('role')) {
            header.setAttribute('role', 'banner');
        }

        // Main navigation
        const mainNav = document.querySelector('header nav');
        if (mainNav && !mainNav.getAttribute('role')) {
            mainNav.setAttribute('role', 'navigation');
            mainNav.setAttribute('aria-label', '메인 메뉴');
        }

        // Main content
        const main = document.querySelector('main') ||
                     document.querySelector('#main-content');
        if (main && !main.getAttribute('role')) {
            main.setAttribute('role', 'main');
        }

        // Footer
        const footer = document.querySelector('footer');
        if (footer && !footer.getAttribute('role')) {
            footer.setAttribute('role', 'contentinfo');
        }

        // Sections with headings
        document.querySelectorAll('section').forEach((section, index) => {
            if (!section.getAttribute('role')) {
                section.setAttribute('role', 'region');
            }

            // Find heading in section
            const heading = section.querySelector('h1, h2, h3');
            if (heading) {
                // Create ID for heading if needed
                if (!heading.id) {
                    heading.id = `section-heading-${index}`;
                }
                section.setAttribute('aria-labelledby', heading.id);
            }
        });

        // Search inputs
        document.querySelectorAll('input[type="search"], input[placeholder*="검색"], input[placeholder*="Search"]').forEach(input => {
            if (!input.getAttribute('role')) {
                input.setAttribute('role', 'searchbox');
            }
            if (!input.getAttribute('aria-label')) {
                input.setAttribute('aria-label', '검색');
            }
        });

        // Buttons without text
        document.querySelectorAll('button').forEach(btn => {
            if (!btn.textContent.trim() && !btn.getAttribute('aria-label')) {
                // Try to infer from icon or class
                const icon = btn.querySelector('i, svg, span');
                if (icon) {
                    const iconClass = icon.className || '';
                    if (iconClass.includes('search')) btn.setAttribute('aria-label', '검색');
                    else if (iconClass.includes('close')) btn.setAttribute('aria-label', '닫기');
                    else if (iconClass.includes('menu')) btn.setAttribute('aria-label', '메뉴');
                    else if (iconClass.includes('lang')) btn.setAttribute('aria-label', '언어 선택');
                }
            }
        });

        // Links that open in new tab
        document.querySelectorAll('a[target="_blank"]').forEach(link => {
            if (!link.getAttribute('aria-label')) {
                const text = link.textContent.trim();
                if (text) {
                    link.setAttribute('aria-label', `${text} (새 탭에서 열림)`);
                }
            }
            // Add rel for security
            if (!link.getAttribute('rel')) {
                link.setAttribute('rel', 'noopener noreferrer');
            }
        });

        // Images without alt
        document.querySelectorAll('img:not([alt])').forEach(img => {
            // Decorative images
            if (img.closest('.hero') || img.closest('.background')) {
                img.setAttribute('alt', '');
                img.setAttribute('role', 'presentation');
            } else {
                img.setAttribute('alt', '이미지');
            }
        });

        // Logo
        const logo = document.querySelector('.logo, [class*="logo"]');
        if (logo) {
            const logoLink = logo.closest('a') || logo.querySelector('a');
            if (logoLink && !logoLink.getAttribute('aria-label')) {
                logoLink.setAttribute('aria-label', 'KAITRUST 홈으로 이동');
            }
        }
    }

    function enhanceKeyboardNav() {
        // Make cards focusable if they have click handlers
        document.querySelectorAll('.card, [class*="card"]').forEach(card => {
            const link = card.querySelector('a');
            if (!link && card.onclick) {
                card.setAttribute('tabindex', '0');
                card.setAttribute('role', 'button');

                card.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        card.click();
                    }
                });
            }
        });

        // Escape key handler for modals and dropdowns
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                // Close any open dropdowns
                document.querySelectorAll('.nav-dropdown.active, .dropdown.open').forEach(dropdown => {
                    dropdown.classList.remove('active', 'open');
                    const trigger = dropdown.querySelector('[aria-expanded]');
                    if (trigger) trigger.setAttribute('aria-expanded', 'false');
                });

                // Close any open modals
                document.querySelectorAll('.modal.active, [class*="modal"].active').forEach(modal => {
                    modal.classList.remove('active');
                });
            }
        });

        // Arrow key navigation for dropdowns
        document.querySelectorAll('.nav-dropdown, .dropdown').forEach(dropdown => {
            dropdown.addEventListener('keydown', function(e) {
                const items = dropdown.querySelectorAll('a, button');
                const currentIndex = Array.from(items).indexOf(document.activeElement);

                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextIndex = (currentIndex + 1) % items.length;
                    items[nextIndex].focus();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
                    items[prevIndex].focus();
                }
            });
        });
    }

    function enhanceForms() {
        // Add labels to inputs without them
        document.querySelectorAll('input, textarea, select').forEach(input => {
            const id = input.id;
            const hasLabel = id && document.querySelector(`label[for="${id}"]`);

            if (!hasLabel && !input.getAttribute('aria-label')) {
                const placeholder = input.placeholder;
                if (placeholder) {
                    input.setAttribute('aria-label', placeholder);
                }
            }

            // Required fields
            if (input.required && !input.getAttribute('aria-required')) {
                input.setAttribute('aria-required', 'true');
            }

            // Invalid state
            input.addEventListener('invalid', function() {
                input.setAttribute('aria-invalid', 'true');
            });

            input.addEventListener('input', function() {
                if (input.validity.valid) {
                    input.removeAttribute('aria-invalid');
                }
            });
        });

        // Form submission announcements
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', function() {
                announceToScreenReader('양식을 제출하는 중입니다...');
            });
        });
    }

    function enhanceDropdowns() {
        // Find all dropdowns and add ARIA
        document.querySelectorAll('.nav-dropdown, .dropdown').forEach(dropdown => {
            const trigger = dropdown.querySelector('.nav-dropdown-trigger, .dropdown-trigger, button');
            const menu = dropdown.querySelector('.nav-dropdown-menu, .dropdown-menu');

            if (trigger && menu) {
                // Generate unique ID for menu
                const menuId = 'dropdown-menu-' + Math.random().toString(36).substr(2, 9);
                menu.id = menuId;

                // Set ARIA attributes on trigger
                trigger.setAttribute('aria-haspopup', 'true');
                trigger.setAttribute('aria-expanded', 'false');
                trigger.setAttribute('aria-controls', menuId);

                // Set role on menu
                menu.setAttribute('role', 'menu');

                // Set role on menu items
                menu.querySelectorAll('a, button').forEach(item => {
                    item.setAttribute('role', 'menuitem');
                });

                // Toggle aria-expanded on hover/focus
                dropdown.addEventListener('mouseenter', function() {
                    trigger.setAttribute('aria-expanded', 'true');
                });

                dropdown.addEventListener('mouseleave', function() {
                    trigger.setAttribute('aria-expanded', 'false');
                });

                // Keyboard toggle
                trigger.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                        e.preventDefault();
                        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
                        trigger.setAttribute('aria-expanded', !isExpanded);

                        if (!isExpanded) {
                            const firstItem = menu.querySelector('a, button');
                            if (firstItem) firstItem.focus();
                        }
                    }
                });
            }
        });
    }

    // Screen reader announcement utility
    function announceToScreenReader(message, priority = 'polite') {
        let announcer = document.getElementById('kaitrust-sr-announcer');

        if (!announcer) {
            announcer = document.createElement('div');
            announcer.id = 'kaitrust-sr-announcer';
            announcer.setAttribute('aria-live', priority);
            announcer.setAttribute('aria-atomic', 'true');
            announcer.className = 'sr-only';
            document.body.appendChild(announcer);
        }

        announcer.textContent = '';
        setTimeout(() => {
            announcer.textContent = message;
        }, 100);
    }

    // Expose API for external use
    window.KaitrustA11y = {
        announce: announceToScreenReader,
        refresh: init
    };

})();
