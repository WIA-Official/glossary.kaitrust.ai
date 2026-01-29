/**
 * KAITRUST Engagement Kit
 * A comprehensive engagement component with citation, useful, comments, and donate features
 *
 * @version 1.0.0
 * @author KAITRUST Team
 */

(function() {
    'use strict';

    // Prevent double loading
    if (window.KAI_ENGAGEMENT_KIT_LOADED) return;
    window.KAI_ENGAGEMENT_KIT_LOADED = true;

    // ========================================
    // CONFIGURATION
    // ========================================
    const CONFIG = {
        API_BASE: '/api/engagement',
        DONATE_URL: 'https://wiastandards.com/donate/',
        LOGIN_URL: '/dashboard/login.html',
        STORAGE_PREFIX: 'kaitrust_engagement_',
        CSS_PATH: '/components/engagement-kit/engagement-kit.css'
    };

    // ========================================
    // I18N TRANSLATIONS
    // ========================================
    const TRANSLATIONS = {
        ko: {
            btn_cite: '인용하기',
            btn_useful: '유용해요',
            btn_comments: '댓글',
            btn_donate: '후원하기',
            cite_modal_title: '인용',
            cite_copy: '복사',
            cite_copied: '복사됨',
            cite_export_label: '다운로드 형식',
            useful_thanks: '감사합니다!',
            useful_already: '이미 참여하셨습니다',
            comments_modal_title: '댓글',
            comments_login_required: '로그인 후 댓글을 작성할 수 있습니다.',
            comments_login_link: '로그인하기',
            comments_placeholder: '댓글을 입력하세요...',
            comments_submit: '작성',
            comments_empty: '아직 댓글이 없습니다. 첫 댓글을 남겨보세요!',
            comments_loading: '댓글을 불러오는 중...',
            donate_modal_title: '후원하기',
            donate_title: 'KAITRUST를 후원해주세요',
            donate_description: '여러분의 후원은 더 나은 AI 교육 콘텐츠를 만드는 데 큰 힘이 됩니다. 커피 한 잔의 후원으로 KAITRUST의 무료 AI 백과사전 서비스를 지속할 수 있습니다.',
            donate_btn: '후원 페이지로 이동',
            toast_copy_success: '클립보드에 복사되었습니다',
            toast_copy_error: '복사에 실패했습니다',
            a11y_close: '닫기'
        },
        en: {
            btn_cite: 'Cite',
            btn_useful: 'Useful',
            btn_comments: 'Comments',
            btn_donate: 'Donate',
            cite_modal_title: 'Cite this article',
            cite_copy: 'Copy',
            cite_copied: 'Copied',
            cite_export_label: 'Export formats',
            useful_thanks: 'Thank you!',
            useful_already: 'Already submitted',
            comments_modal_title: 'Comments',
            comments_login_required: 'Please log in to write a comment.',
            comments_login_link: 'Log in',
            comments_placeholder: 'Write a comment...',
            comments_submit: 'Submit',
            comments_empty: 'No comments yet. Be the first to comment!',
            comments_loading: 'Loading comments...',
            donate_modal_title: 'Support Us',
            donate_title: 'Support KAITRUST',
            donate_description: 'Your donation helps us create better AI educational content. A cup of coffee can help keep KAITRUST\'s free AI encyclopedia running.',
            donate_btn: 'Go to Donation Page',
            toast_copy_success: 'Copied to clipboard',
            toast_copy_error: 'Failed to copy',
            a11y_close: 'Close'
        }
    };

    // ========================================
    // STATE
    // ========================================
    let state = {
        pageData: null,
        usefulCount: 0,
        commentCount: 0,
        hasVotedUseful: false,
        isLoggedIn: false,
        currentModal: null
    };

    // ========================================
    // HELPER FUNCTIONS
    // ========================================
    function getLang() {
        const stored = localStorage.getItem('kaitrust_language');
        if (stored) return stored.startsWith('ko') ? 'ko' : 'en';
        return navigator.language.startsWith('ko') ? 'ko' : 'en';
    }

    function t(key) {
        const lang = getLang();
        return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key] || key;
    }

    function getPageData() {
        const h1 = document.querySelector('h1');
        const breadcrumb = document.querySelector('.breadcrumb');
        const metaDate = document.querySelector('meta[name="date"]');

        return {
            name: h1?.textContent?.trim() || document.title,
            url: window.location.href,
            date: metaDate?.content || new Date().toISOString().split('T')[0],
            year: new Date().getFullYear(),
            category: breadcrumb?.textContent?.trim() || 'AI 백과사전',
            accessDate: new Date().toISOString().split('T')[0]
        };
    }

    function getPageId() {
        // Unicode-safe base64 encoding
        try {
            return btoa(encodeURIComponent(window.location.pathname)).replace(/[^a-zA-Z0-9]/g, '');
        } catch (e) {
            // Fallback: use simple hash
            let hash = 0;
            const str = window.location.pathname;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            return 'page_' + Math.abs(hash).toString(36);
        }
    }

    function checkLoginStatus() {
        // Check for auth token or session
        return !!(localStorage.getItem('kaitrust_auth_token') ||
                  sessionStorage.getItem('kaitrust_session') ||
                  document.cookie.includes('kaitrust_session'));
    }

    // ========================================
    // CITATION GENERATORS
    // ========================================
    function generateMLA(data) {
        return `KAITRUST. "${data.name}." AI 백과사전, ${data.year}, ${data.url}.`;
    }

    function generateAPA(data) {
        return `KAITRUST. (${data.year}). ${data.name}. AI 백과사전. ${data.url}`;
    }

    function generateISO690(data) {
        return `KAITRUST. ${data.name}. AI 백과사전 [online]. ${data.year} [cit. ${data.accessDate}]. Available from: ${data.url}`;
    }

    function generateBibTeX(data) {
        const key = data.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        return `@misc{kaitrust_${key},
    author = {KAITRUST},
    title = {${data.name}},
    year = {${data.year}},
    howpublished = {AI 백과사전},
    url = {${data.url}},
    note = {Accessed: ${data.accessDate}}
}`;
    }

    function generateEndNote(data) {
        return `%0 Web Page
%A KAITRUST
%T ${data.name}
%D ${data.year}
%U ${data.url}
%I AI 백과사전`;
    }

    function generateRefMan(data) {
        return `TY  - ELEC
AU  - KAITRUST
TI  - ${data.name}
PY  - ${data.year}
UR  - ${data.url}
PB  - AI 백과사전
Y2  - ${data.accessDate}
ER  -`;
    }

    function generateRefWorks(data) {
        return `RT Web Page
A1 KAITRUST
T1 ${data.name}
YR ${data.year}
UL ${data.url}
PB AI 백과사전`;
    }

    // ========================================
    // UI COMPONENTS
    // ========================================
    function createEngagementBar() {
        const container = document.createElement('div');
        container.className = 'engagement-kit';
        container.id = 'kaitrust-engagement-kit';

        container.innerHTML = `
            <div class="engagement-kit-bar">
                <button class="engagement-btn" id="eng-cite-btn" aria-label="${t('btn_cite')}">
                    <span class="icon">📎</span>
                    <span class="label">${t('btn_cite')}</span>
                </button>
                <div class="engagement-divider"></div>
                <button class="engagement-btn" id="eng-useful-btn" aria-label="${t('btn_useful')}">
                    <span class="icon">⭐</span>
                    <span class="label">${t('btn_useful')}</span>
                    <span class="count" id="eng-useful-count">0</span>
                </button>
                <div class="engagement-divider"></div>
                <button class="engagement-btn" id="eng-comments-btn" aria-label="${t('btn_comments')}">
                    <span class="icon">💬</span>
                    <span class="label">${t('btn_comments')}</span>
                    <span class="count" id="eng-comments-count">0</span>
                </button>
                <div class="engagement-divider"></div>
                <button class="engagement-btn" id="eng-donate-btn" aria-label="${t('btn_donate')}">
                    <span class="icon">☕</span>
                    <span class="label">${t('btn_donate')}</span>
                </button>
            </div>
        `;

        return container;
    }

    function createCitationModal() {
        const data = state.pageData;

        const overlay = document.createElement('div');
        overlay.className = 'engagement-modal-overlay';
        overlay.id = 'eng-citation-overlay';

        const modal = document.createElement('div');
        modal.className = 'engagement-modal';
        modal.id = 'eng-citation-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-label', t('cite_modal_title'));

        modal.innerHTML = `
            <div class="engagement-modal-header">
                <h3>${t('cite_modal_title')}</h3>
                <button class="engagement-modal-close" aria-label="${t('a11y_close')}">&times;</button>
            </div>
            <div class="engagement-modal-content">
                <div class="citation-format" data-format="mla">
                    <div class="citation-format-header">
                        <span class="citation-format-label">MLA</span>
                        <button class="citation-copy-btn" data-citation="mla">
                            <span>📋</span> <span class="copy-text">${t('cite_copy')}</span>
                        </button>
                    </div>
                    <div class="citation-text">${generateMLA(data)}</div>
                </div>

                <div class="citation-format" data-format="apa">
                    <div class="citation-format-header">
                        <span class="citation-format-label">APA</span>
                        <button class="citation-copy-btn" data-citation="apa">
                            <span>📋</span> <span class="copy-text">${t('cite_copy')}</span>
                        </button>
                    </div>
                    <div class="citation-text">${generateAPA(data)}</div>
                </div>

                <div class="citation-format" data-format="iso690">
                    <div class="citation-format-header">
                        <span class="citation-format-label">ISO 690</span>
                        <button class="citation-copy-btn" data-citation="iso690">
                            <span>📋</span> <span class="copy-text">${t('cite_copy')}</span>
                        </button>
                    </div>
                    <div class="citation-text">${generateISO690(data)}</div>
                </div>

                <div class="citation-export-section">
                    <div class="citation-export-label">${t('cite_export_label')}</div>
                    <div class="citation-export-buttons">
                        <button class="citation-export-btn" data-export="bibtex">BibTeX</button>
                        <button class="citation-export-btn" data-export="endnote">EndNote</button>
                        <button class="citation-export-btn" data-export="refman">RefMan</button>
                        <button class="citation-export-btn" data-export="refworks">RefWorks</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(modal);

        // Event listeners
        overlay.addEventListener('click', () => closeCitationModal());
        modal.querySelector('.engagement-modal-close').addEventListener('click', () => closeCitationModal());

        // Copy buttons
        modal.querySelectorAll('.citation-copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const format = btn.dataset.citation;
                const textEl = btn.closest('.citation-format').querySelector('.citation-text');
                copyToClipboard(textEl.textContent, btn);
            });
        });

        // Export buttons
        modal.querySelectorAll('.citation-export-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const format = btn.dataset.export;
                downloadCitation(format);
            });
        });

    }

    function createCommentsModal() {
        const overlay = document.createElement('div');
        overlay.className = 'engagement-modal-overlay';
        overlay.id = 'eng-comments-overlay';

        const modal = document.createElement('div');
        modal.className = 'engagement-modal';
        modal.id = 'eng-comments-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-label', t('comments_modal_title'));

        const loginContent = `
            <div class="comment-login-prompt">
                <p>${t('comments_login_required')}</p>
                <a href="${CONFIG.LOGIN_URL}">${t('comments_login_link')}</a>
            </div>
        `;

        const formContent = `
            <div class="comment-form">
                <textarea class="comment-textarea" placeholder="${t('comments_placeholder')}" id="eng-comment-input"></textarea>
                <button class="comment-submit-btn" id="eng-comment-submit">${t('comments_submit')}</button>
            </div>
        `;

        modal.innerHTML = `
            <div class="engagement-modal-header">
                <h3>${t('comments_modal_title')}</h3>
                <button class="engagement-modal-close" aria-label="${t('a11y_close')}">&times;</button>
            </div>
            <div class="engagement-modal-content">
                <div class="engagement-comment-section">
                    ${state.isLoggedIn ? formContent : loginContent}
                    <div class="comment-list" id="eng-comment-list">
                        <p style="text-align: center; color: #94a3b8;">${t('comments_loading')}</p>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(modal);

        // Event listeners
        overlay.addEventListener('click', () => closeCommentsModal());
        modal.querySelector('.engagement-modal-close').addEventListener('click', () => closeCommentsModal());

        if (state.isLoggedIn) {
            const submitBtn = modal.querySelector('#eng-comment-submit');
            const input = modal.querySelector('#eng-comment-input');

            submitBtn.addEventListener('click', () => submitComment());
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                    submitComment();
                }
            });
        }
    }

    function createDonateModal() {
        const overlay = document.createElement('div');
        overlay.className = 'engagement-modal-overlay';
        overlay.id = 'eng-donate-overlay';

        const modal = document.createElement('div');
        modal.className = 'engagement-modal';
        modal.id = 'eng-donate-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-label', t('donate_modal_title'));

        modal.innerHTML = `
            <div class="engagement-modal-header">
                <h3>${t('donate_modal_title')}</h3>
                <button class="engagement-modal-close" aria-label="${t('a11y_close')}">&times;</button>
            </div>
            <div class="engagement-modal-content">
                <div class="donate-modal-content">
                    <div class="donate-icon">☕</div>
                    <div class="donate-title">${t('donate_title')}</div>
                    <div class="donate-description">${t('donate_description')}</div>
                    <a href="${CONFIG.DONATE_URL}" target="_blank" rel="noopener noreferrer" class="donate-btn">
                        <span>☕</span> ${t('donate_btn')}
                    </a>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(modal);

        // Event listeners
        overlay.addEventListener('click', () => closeDonateModal());
        modal.querySelector('.engagement-modal-close').addEventListener('click', () => closeDonateModal());
    }

    function createToast() {
        const toast = document.createElement('div');
        toast.className = 'engagement-toast';
        toast.id = 'eng-toast';
        document.body.appendChild(toast);
    }

    // ========================================
    // MODAL CONTROLS
    // ========================================
    function handleGlobalKeydown(e) {
        if (e.key === 'Escape' && state.currentModal) {
            switch (state.currentModal) {
                case 'citation':
                    closeCitationModal();
                    break;
                case 'comments':
                    closeCommentsModal();
                    break;
                case 'donate':
                    closeDonateModal();
                    break;
            }
        }
    }

    function openCitationModal() {
        const overlay = document.getElementById('eng-citation-overlay');
        const modal = document.getElementById('eng-citation-modal');
        overlay.classList.add('show');
        modal.classList.add('show');
        state.currentModal = 'citation';
        document.body.style.overflow = 'hidden';
    }

    function closeCitationModal() {
        const overlay = document.getElementById('eng-citation-overlay');
        const modal = document.getElementById('eng-citation-modal');
        overlay.classList.remove('show');
        modal.classList.remove('show');
        state.currentModal = null;
        document.body.style.overflow = '';
    }

    function openCommentsModal() {
        const overlay = document.getElementById('eng-comments-overlay');
        const modal = document.getElementById('eng-comments-modal');
        overlay.classList.add('show');
        modal.classList.add('show');
        state.currentModal = 'comments';
        document.body.style.overflow = 'hidden';
        loadComments();
    }

    function closeCommentsModal() {
        const overlay = document.getElementById('eng-comments-overlay');
        const modal = document.getElementById('eng-comments-modal');
        overlay.classList.remove('show');
        modal.classList.remove('show');
        state.currentModal = null;
        document.body.style.overflow = '';
    }

    function openDonateModal() {
        const overlay = document.getElementById('eng-donate-overlay');
        const modal = document.getElementById('eng-donate-modal');
        overlay.classList.add('show');
        modal.classList.add('show');
        state.currentModal = 'donate';
        document.body.style.overflow = 'hidden';
    }

    function closeDonateModal() {
        const overlay = document.getElementById('eng-donate-overlay');
        const modal = document.getElementById('eng-donate-modal');
        overlay.classList.remove('show');
        modal.classList.remove('show');
        state.currentModal = null;
        document.body.style.overflow = '';
    }

    // ========================================
    // UTILITY FUNCTIONS
    // ========================================
    function showToast(message, type = 'success') {
        const toast = document.getElementById('eng-toast');
        toast.textContent = message;
        toast.className = `engagement-toast show ${type}`;

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    async function copyToClipboard(text, buttonEl) {
        try {
            await navigator.clipboard.writeText(text);
            const copyText = buttonEl.querySelector('.copy-text');
            const originalText = copyText.textContent;
            copyText.textContent = t('cite_copied');
            buttonEl.classList.add('copied');
            showToast(t('toast_copy_success'));

            setTimeout(() => {
                copyText.textContent = originalText;
                buttonEl.classList.remove('copied');
            }, 2000);
        } catch (err) {
            showToast(t('toast_copy_error'), 'error');
        }
    }

    function downloadCitation(format) {
        const data = state.pageData;
        let content, filename, mimeType;

        switch (format) {
            case 'bibtex':
                content = generateBibTeX(data);
                filename = `kaitrust_${getPageId()}.bib`;
                mimeType = 'application/x-bibtex';
                break;
            case 'endnote':
                content = generateEndNote(data);
                filename = `kaitrust_${getPageId()}.enw`;
                mimeType = 'application/x-endnote-refer';
                break;
            case 'refman':
                content = generateRefMan(data);
                filename = `kaitrust_${getPageId()}.ris`;
                mimeType = 'application/x-research-info-systems';
                break;
            case 'refworks':
                content = generateRefWorks(data);
                filename = `kaitrust_${getPageId()}.txt`;
                mimeType = 'text/plain';
                break;
            default:
                return;
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast(t('toast_download_success') || 'Download started');
    }

    // ========================================
    // API FUNCTIONS
    // ========================================
    async function loadUsefulCount() {
        const pageId = getPageId();
        const storageKey = `${CONFIG.STORAGE_PREFIX}useful_${pageId}`;

        // Check local state first
        state.hasVotedUseful = localStorage.getItem(storageKey) === 'true';

        if (state.hasVotedUseful) {
            const btn = document.getElementById('eng-useful-btn');
            btn?.classList.add('active');
        }

        try {
            const response = await fetch(`${CONFIG.API_BASE}/useful.php?action=get&page_id=${pageId}`);
            if (response.ok) {
                const data = await response.json();
                state.usefulCount = data.count || 0;
                updateUsefulCount();
            }
        } catch (err) {
            // Use mock data if API fails
            state.usefulCount = parseInt(localStorage.getItem(`${storageKey}_count`) || '0');
            updateUsefulCount();
        }
    }

    async function toggleUseful() {
        const pageId = getPageId();
        const storageKey = `${CONFIG.STORAGE_PREFIX}useful_${pageId}`;
        const btn = document.getElementById('eng-useful-btn');

        if (state.hasVotedUseful) {
            showToast(t('useful_already'));
            return;
        }

        // Optimistic update
        state.hasVotedUseful = true;
        state.usefulCount++;
        btn.classList.add('active', 'pulse');
        updateUsefulCount();
        localStorage.setItem(storageKey, 'true');
        localStorage.setItem(`${storageKey}_count`, state.usefulCount.toString());

        setTimeout(() => btn.classList.remove('pulse'), 300);

        try {
            const response = await fetch(`${CONFIG.API_BASE}/useful.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ page_id: pageId, action: 'add' })
            });

            if (response.ok) {
                const data = await response.json();
                state.usefulCount = data.count || state.usefulCount;
                updateUsefulCount();
            }
        } catch (err) {
            // Keep local state even if API fails
        }

        showToast(t('useful_thanks'));
    }

    function updateUsefulCount() {
        const countEl = document.getElementById('eng-useful-count');
        if (countEl) {
            countEl.textContent = state.usefulCount;
        }
    }

    async function loadComments() {
        const pageId = getPageId();
        const listEl = document.getElementById('eng-comment-list');

        try {
            const response = await fetch(`${CONFIG.API_BASE}/comments.php?action=get&page_id=${pageId}`);
            if (response.ok) {
                const data = await response.json();
                renderComments(data.comments || []);
                state.commentCount = data.total || 0;
                updateCommentCount();
            } else {
                listEl.innerHTML = `<p style="text-align: center; color: #ef4444;">${t('comments_error') || 'Failed to load'}</p>`;
            }
        } catch (err) {
            // Show empty state
            listEl.innerHTML = `<p style="text-align: center; color: #94a3b8;">${t('comments_empty')}</p>`;
        }
    }

    function renderComments(comments) {
        const listEl = document.getElementById('eng-comment-list');

        if (!comments || comments.length === 0) {
            listEl.innerHTML = `<p style="text-align: center; color: #94a3b8;">${t('comments_empty')}</p>`;
            return;
        }

        listEl.innerHTML = comments.map(comment => `
            <div class="comment-item">
                <div class="comment-header">
                    <span class="comment-author">${escapeHtml(comment.author)}</span>
                    <span class="comment-date">${formatDate(comment.created_at)}</span>
                </div>
                <div class="comment-content">${escapeHtml(comment.content)}</div>
            </div>
        `).join('');
    }

    async function submitComment() {
        const input = document.getElementById('eng-comment-input');
        const submitBtn = document.getElementById('eng-comment-submit');
        const content = input.value.trim();

        if (!content) return;

        submitBtn.disabled = true;
        submitBtn.textContent = '...';

        try {
            const response = await fetch(`${CONFIG.API_BASE}/comments.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    page_id: getPageId(),
                    content: content
                })
            });

            if (response.ok) {
                input.value = '';
                showToast(t('comments_submit_success') || 'Comment submitted');
                loadComments();
                state.commentCount++;
                updateCommentCount();
            } else {
                showToast(t('comments_submit_error') || 'Failed to submit', 'error');
            }
        } catch (err) {
            showToast(t('comments_submit_error') || 'Failed to submit', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = t('comments_submit');
        }
    }

    async function loadCommentCount() {
        const pageId = getPageId();

        try {
            const response = await fetch(`${CONFIG.API_BASE}/comments.php?action=count&page_id=${pageId}`);
            if (response.ok) {
                const data = await response.json();
                state.commentCount = data.count || 0;
                updateCommentCount();
            }
        } catch (err) {
            // Keep at 0
        }
    }

    function updateCommentCount() {
        const countEl = document.getElementById('eng-comments-count');
        if (countEl) {
            countEl.textContent = state.commentCount;
        }
    }

    // ========================================
    // HELPER UTILITIES
    // ========================================
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function formatDate(dateStr) {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString(getLang() === 'ko' ? 'ko-KR' : 'en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return dateStr;
        }
    }

    // ========================================
    // STYLE INJECTION
    // ========================================
    function injectStyles() {
        if (document.getElementById('engagement-kit-styles')) return;

        const link = document.createElement('link');
        link.id = 'engagement-kit-styles';
        link.rel = 'stylesheet';
        link.href = CONFIG.CSS_PATH;
        document.head.appendChild(link);
    }

    // ========================================
    // INITIALIZATION
    // ========================================
    function init() {
        // Inject styles
        injectStyles();

        // Get page data
        state.pageData = getPageData();
        state.isLoggedIn = checkLoginStatus();

        // Find insertion point
        const mainEl = document.querySelector('main');
        const footerEl = document.getElementById('kaitrust-footer');

        // Create and insert engagement bar
        const engagementBar = createEngagementBar();

        if (mainEl && mainEl.nextSibling) {
            mainEl.parentNode.insertBefore(engagementBar, mainEl.nextSibling);
        } else if (footerEl) {
            footerEl.parentNode.insertBefore(engagementBar, footerEl);
        } else {
            document.body.appendChild(engagementBar);
        }

        // Create modals
        createCitationModal();
        createCommentsModal();
        createDonateModal();
        createToast();

        // Bind events
        document.getElementById('eng-cite-btn').addEventListener('click', openCitationModal);
        document.getElementById('eng-useful-btn').addEventListener('click', toggleUseful);
        document.getElementById('eng-comments-btn').addEventListener('click', openCommentsModal);
        document.getElementById('eng-donate-btn').addEventListener('click', openDonateModal);

        // Load initial data
        loadUsefulCount();
        loadCommentCount();

        // Global escape key handler (single registration)
        document.addEventListener('keydown', handleGlobalKeydown);

        // Listen for language change
        window.addEventListener('wia-language-changed', () => {
            // Refresh UI with new language
            location.reload();
        });
    }

    // ========================================
    // GLOBAL API
    // ========================================
    window.KAIEngagementKit = {
        openCitation: openCitationModal,
        closeCitation: closeCitationModal,
        openComments: openCommentsModal,
        closeComments: closeCommentsModal,
        openDonate: openDonateModal,
        closeDonate: closeDonateModal,
        refresh: () => {
            loadUsefulCount();
            loadCommentCount();
        }
    };

    // ========================================
    // AUTO-INITIALIZE
    // ========================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
