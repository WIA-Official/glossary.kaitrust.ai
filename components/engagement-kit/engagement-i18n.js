/**
 * KAITRUST Engagement Kit - Internationalization (i18n)
 * Version: 2.1.0
 *
 * 211개 언어 지원 - Site Kit 언어 설정과 연동
 * 외부 JSON 파일에서 번역 데이터 동적 로드
 */

(function() {
    'use strict';

    // ========== 설정 ==========
    const CONFIG = {
        version: '2.1.0',
        translationsPath: [
            '/components/engagement-kit/engagement-translations.json',
            'https://kaitrust.ai/components/engagement-kit/engagement-translations.json'
        ],
        storageKeys: ['kaitrust-lang', 'kaitrust_language', 'wiabooks_language', 'kt_language'],
        defaultLang: 'ko',
        fallbackLang: 'en'
    };

    // ========== 내장 폴백 번역 (JSON 로드 실패 시) ==========
    const FALLBACK_TRANSLATIONS = {
        en: {
            // Buttons
            cite: "Cite",
            btn_cite: "Cite",
            useful: "Helpful",
            btn_useful: "Useful",
            comments: "Comments",
            btn_comments: "Comments",
            donate: "Support",
            btn_donate: "Donate",

            // Citation Modal
            citation: "Citation",
            cite_modal_title: "Cite this article",
            copy: "Copy",
            cite_copy: "Copy",
            copied: "Copied!",
            cite_copied: "Copied",
            cite_export_label: "Export formats",

            // Useful
            useful_thanks: "Thank you!",
            useful_already: "Already submitted",

            // Comments
            comments_modal_title: "Comments",
            login_required: "Please log in to leave a comment.",
            comments_login_required: "Please log in to write a comment.",
            comments_login_link: "Log in",
            comments_placeholder: "Write a comment...",
            comments_submit: "Submit",
            no_comments: "Be the first to comment!",
            comments_empty: "No comments yet. Be the first to comment!",
            comments_loading: "Loading comments...",
            comments_error: "Failed to load comments.",
            comments_submit_success: "Comment submitted successfully.",
            comments_submit_error: "Failed to submit comment.",

            // Donate
            donate_modal_title: "Support Us",
            donate_title: "Support KAITRUST",
            donate_message: "If this content helped you, support the AI Encyclopedia with a cup of coffee.",
            donate_description: "Your donation helps us create better AI educational content. A cup of coffee can help keep KAITRUST's free AI encyclopedia running.",
            donate_btn: "Go to Donation Page",

            // Toast
            toast_copy_success: "Copied to clipboard",
            toast_copy_error: "Failed to copy",
            toast_download_success: "Download started",

            // Accessibility
            a11y_close: "Close",
            a11y_citation_modal: "Citation information modal",
            a11y_comments_modal: "Comments modal",
            a11y_donate_modal: "Donation information modal"
        },
        ko: {
            // Buttons
            cite: "인용하기",
            btn_cite: "인용하기",
            useful: "유용해요",
            btn_useful: "유용해요",
            comments: "댓글",
            btn_comments: "댓글",
            donate: "후원하기",
            btn_donate: "후원하기",

            // Citation Modal
            citation: "인용",
            cite_modal_title: "인용",
            copy: "복사",
            cite_copy: "복사",
            copied: "복사됨!",
            cite_copied: "복사됨",
            cite_export_label: "다운로드 형식",

            // Useful
            useful_thanks: "감사합니다!",
            useful_already: "이미 참여하셨습니다",

            // Comments
            comments_modal_title: "댓글",
            login_required: "로그인 후 댓글을 작성할 수 있습니다.",
            comments_login_required: "로그인 후 댓글을 작성할 수 있습니다.",
            comments_login_link: "로그인하기",
            comments_placeholder: "댓글을 입력하세요...",
            comments_submit: "작성",
            no_comments: "첫 번째 댓글을 남겨주세요!",
            comments_empty: "아직 댓글이 없습니다. 첫 댓글을 남겨보세요!",
            comments_loading: "댓글을 불러오는 중...",
            comments_error: "댓글을 불러오지 못했습니다.",
            comments_submit_success: "댓글이 등록되었습니다.",
            comments_submit_error: "댓글 등록에 실패했습니다.",

            // Donate
            donate_modal_title: "후원하기",
            donate_title: "KAITRUST를 후원해주세요",
            donate_message: "이 콘텐츠가 도움이 되셨다면, 커피 한 잔 값으로 AI 백과사전을 응원해주세요.",
            donate_description: "여러분의 후원은 더 나은 AI 교육 콘텐츠를 만드는 데 큰 힘이 됩니다. 커피 한 잔의 후원으로 KAITRUST의 무료 AI 백과사전 서비스를 지속할 수 있습니다.",
            donate_btn: "후원 페이지로 이동",

            // Toast
            toast_copy_success: "클립보드에 복사되었습니다",
            toast_copy_error: "복사에 실패했습니다",
            toast_download_success: "다운로드가 시작됩니다",

            // Accessibility
            a11y_close: "닫기",
            a11y_citation_modal: "인용 정보 모달",
            a11y_comments_modal: "댓글 모달",
            a11y_donate_modal: "후원 안내 모달"
        },
        ja: {
            // Buttons
            cite: "引用",
            btn_cite: "引用",
            useful: "役に立った",
            btn_useful: "役に立った",
            comments: "コメント",
            btn_comments: "コメント",
            donate: "寄付する",
            btn_donate: "寄付する",

            // Citation Modal
            citation: "引用",
            cite_modal_title: "この記事を引用",
            copy: "コピー",
            cite_copy: "コピー",
            copied: "コピーしました!",
            cite_copied: "コピーしました",
            cite_export_label: "エクスポート形式",

            // Useful
            useful_thanks: "ありがとうございます！",
            useful_already: "既に送信済みです",

            // Comments
            comments_modal_title: "コメント",
            login_required: "コメントを書くにはログインしてください。",
            comments_login_required: "コメントを書くにはログインしてください。",
            comments_login_link: "ログイン",
            comments_placeholder: "コメントを入力...",
            comments_submit: "送信",
            no_comments: "最初のコメントを残しましょう！",
            comments_empty: "まだコメントがありません。最初のコメントを残しましょう！",
            comments_loading: "コメントを読み込み中...",
            comments_error: "コメントの読み込みに失敗しました。",
            comments_submit_success: "コメントが投稿されました。",
            comments_submit_error: "コメントの投稿に失敗しました。",

            // Donate
            donate_modal_title: "サポート",
            donate_title: "KAITRUSTをサポート",
            donate_message: "このコンテンツが役に立ったら、コーヒー1杯でAI百科事典を応援してください。",
            donate_description: "ご寄付は、より良いAI教育コンテンツの作成に役立ちます。コーヒー1杯分の寄付で、KAITRUSTの無料AI百科事典サービスを継続できます。",
            donate_btn: "寄付ページへ",

            // Toast
            toast_copy_success: "クリップボードにコピーしました",
            toast_copy_error: "コピーに失敗しました",
            toast_download_success: "ダウンロードを開始します",

            // Accessibility
            a11y_close: "閉じる",
            a11y_citation_modal: "引用情報モーダル",
            a11y_comments_modal: "コメントモーダル",
            a11y_donate_modal: "寄付案内モーダル"
        },
        'zh-CN': {
            // Buttons
            cite: "引用",
            btn_cite: "引用",
            useful: "有用",
            btn_useful: "有用",
            comments: "评论",
            btn_comments: "评论",
            donate: "赞助",
            btn_donate: "赞助",

            // Citation Modal
            citation: "引用",
            cite_modal_title: "引用此文章",
            copy: "复制",
            cite_copy: "复制",
            copied: "已复制!",
            cite_copied: "已复制",
            cite_export_label: "导出格式",

            // Useful
            useful_thanks: "谢谢！",
            useful_already: "已提交",

            // Comments
            comments_modal_title: "评论",
            login_required: "请登录后发表评论。",
            comments_login_required: "请登录后发表评论。",
            comments_login_link: "登录",
            comments_placeholder: "写评论...",
            comments_submit: "提交",
            no_comments: "成为第一个评论的人吧！",
            comments_empty: "还没有评论。成为第一个评论的人吧！",
            comments_loading: "加载评论中...",
            comments_error: "加载评论失败。",
            comments_submit_success: "评论已提交。",
            comments_submit_error: "提交评论失败。",

            // Donate
            donate_modal_title: "支持我们",
            donate_title: "支持KAITRUST",
            donate_message: "如果这些内容对您有帮助，请用一杯咖啡支持AI百科全书。",
            donate_description: "您的捐赠将帮助我们创建更好的AI教育内容。一杯咖啡的捐赠可以帮助维持KAITRUST的免费AI百科全书服务。",
            donate_btn: "前往捐赠页面",

            // Toast
            toast_copy_success: "已复制到剪贴板",
            toast_copy_error: "复制失败",
            toast_download_success: "开始下载",

            // Accessibility
            a11y_close: "关闭",
            a11y_citation_modal: "引用信息模态框",
            a11y_comments_modal: "评论模态框",
            a11y_donate_modal: "捐赠信息模态框"
        }
    };

    // ========== 상태 ==========
    let translations = { ...FALLBACK_TRANSLATIONS };
    let isLoaded = false;
    let eventsBound = false;

    // ========== UI 선택자 매핑 ==========
    const UI_SELECTORS = {
        cite: '.cite-btn, [data-engagement="cite"]',
        useful: '.useful-btn, [data-engagement="useful"]',
        comments: '.comments-btn, [data-engagement="comments"]',
        donate: '.donate-btn, [data-engagement="donate"]',
        citation: '.citation-title, [data-engagement="citation-title"]',
        copy: '.copy-btn, [data-engagement="copy"]',
        login_required: '.login-required, [data-engagement="login-required"]',
        no_comments: '.no-comments, [data-engagement="no-comments"]',
        donate_message: '.donate-message, [data-engagement="donate-message"]'
    };

    // ========== 유틸리티 함수 ==========
    /**
     * localStorage 안전 접근 (Safari 프라이빗 모드 대응)
     */
    function safeGetItem(key) {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            return null;
        }
    }

    /**
     * 언어 코드 정규화
     * - ko-KR → ko
     * - zh-Hans → zh-CN (매핑)
     */
    function normalizeLangCode(code) {
        if (!code) return null;

        // 전체 코드로 먼저 확인 (zh-CN, zh-TW, pt-BR 등)
        if (translations[code]) return code;

        // 기본 언어 코드로 확인
        const base = code.split('-')[0].toLowerCase();
        if (translations[base]) return base;

        return null;
    }

    // ========== 언어 감지 함수 ==========
    /**
     * 현재 언어 설정을 감지합니다.
     * 우선순위: URL 경로 > localStorage > 기본값
     */
    function getCurrentLang() {
        // 1. URL 경로 확인 (/ko/, /en/, /ja/ 등)
        const path = window.location.pathname;
        const pathMatch = path.match(/^\/([a-z]{2}(?:-[A-Z]{2})?)\//);
        if (pathMatch) {
            const normalized = normalizeLangCode(pathMatch[1]);
            if (normalized) return normalized;
        }

        // 2. URL 파라미터 확인 (?lang=ko)
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang) {
            const normalized = normalizeLangCode(urlLang);
            if (normalized) return normalized;
        }

        // 3. localStorage 확인 (여러 키 순차 확인)
        for (const key of CONFIG.storageKeys) {
            const saved = safeGetItem(key);
            const normalized = normalizeLangCode(saved);
            if (normalized) return normalized;
        }

        // 4. 기본값
        return CONFIG.defaultLang;
    }

    /**
     * 번역 문자열을 가져옵니다.
     */
    function t(key, lang) {
        const currentLang = lang || getCurrentLang();
        const langTranslations = translations[currentLang] || translations[CONFIG.fallbackLang] || FALLBACK_TRANSLATIONS.en;
        return langTranslations[key] || FALLBACK_TRANSLATIONS.en[key] || key;
    }

    /**
     * 현재 언어의 모든 번역을 가져옵니다.
     */
    function getTranslations(lang) {
        const currentLang = lang || getCurrentLang();
        return translations[currentLang] || translations[CONFIG.fallbackLang] || FALLBACK_TRANSLATIONS.en;
    }

    // ========== 번역 로드 ==========
    /**
     * 외부 JSON 파일에서 번역 데이터를 로드합니다.
     */
    async function loadTranslations() {
        if (isLoaded) return translations;

        for (const path of CONFIG.translationsPath) {
            try {
                const response = await fetch(path);
                if (response.ok) {
                    const data = await response.json();
                    // _meta 필드 제외하고 병합
                    Object.keys(data).forEach(function(key) {
                        if (key !== '_meta') {
                            translations[key] = data[key];
                        }
                    });
                    isLoaded = true;
                    console.log('✅ Engagement i18n: ' + Object.keys(translations).length + '개 언어 로드됨');
                    return translations;
                }
            } catch (e) {
                continue;
            }
        }

        console.warn('⚠️ Engagement i18n: 폴백 번역 사용 중');
        return translations;
    }

    // ========== UI 업데이트 ==========
    /**
     * Engagement Kit UI의 텍스트를 현재 언어로 업데이트합니다.
     */
    function updateEngagementKitUI() {
        const currentTranslations = getTranslations();

        // 매핑 기반 업데이트
        Object.entries(UI_SELECTORS).forEach(function([key, selector]) {
            var elements = document.querySelectorAll(selector);
            elements.forEach(function(el) {
                if (currentTranslations[key]) {
                    el.textContent = currentTranslations[key];
                }
            });
        });

        // data-i18n 속성 지원 (기존 시스템 호환)
        document.querySelectorAll('[data-i18n^="engagement."]').forEach(function(el) {
            var key = el.getAttribute('data-i18n').replace('engagement.', '');
            if (currentTranslations[key]) {
                el.textContent = currentTranslations[key];
            }
        });
    }

    // ========== 이벤트 리스너 ==========
    function handleLanguageChange() {
        updateEngagementKitUI();
    }

    function bindLanguageChangeEvents() {
        if (eventsBound) return;
        eventsBound = true;

        // Site Kit 언어 변경 이벤트
        window.addEventListener('kaitrust-lang-change', handleLanguageChange);
        window.addEventListener('wia-language-changed', handleLanguageChange);
    }

    // ========== 초기화 ==========
    async function init() {
        // 번역 로드
        await loadTranslations();

        // DOM 로드 후 UI 업데이트
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                updateEngagementKitUI();
                bindLanguageChangeEvents();
            });
        } else {
            updateEngagementKitUI();
            bindLanguageChangeEvents();
        }
    }

    // ========== 전역 API 노출 ==========
    window.EngagementI18n = {
        version: CONFIG.version,
        getCurrentLang: getCurrentLang,
        t: t,
        getTranslations: getTranslations,
        updateUI: updateEngagementKitUI,
        loadTranslations: loadTranslations,
        isLoaded: function() { return isLoaded; },
        getSupportedLanguages: function() { return Object.keys(translations).filter(function(k) { return k !== '_meta'; }); },
        SELECTORS: UI_SELECTORS
    };

    // 시작
    init();

})();
