/**
 * WIA Language Modal 211 Component - V2 (더 큰 버전)
 * @version 2.1.0
 * @author PM Claude
 * @description 5열 그리드, 큰 폰트 버전
 */

class WIALanguageModal {
    constructor() {
        this.languages = {};
        this.currentFilter = 'all';
        this.currentLang = localStorage.getItem('kaitrust_language') || document.documentElement.lang || 'en';
        this.modalId = 'wiaLanguageModal211';
        this.initialized = false;
        // All 212 fully translated languages
        this.translatedLangs = [
            'af','ak','am','an','ar','arn','as','ast','aue','ay','az',
            'be','bg','bi','bm','bn','bo','br','bs',
            'ca','cdo','chk','chr','ckb','co','cs','cy',
            'da','de','djk','dz',
            'ee','el','eml','en','en-AU','en-CA','en-GB','en-NZ','en-US','eo','es','es-AR','es-CL','es-CO','es-MX','es-PE','et','eu','ext',
            'fa','ff','fi','fil','fj','fo','fr','fr-CA','fur',
            'ga','gan','gd','gil','gl','gn','gsw','gu','gv',
            'ha','hak','haw','he','hi','hr','hsn','ht','hu','hy',
            'ia','id','ig','is','it','iu','izh',
            'ja','jbo',
            'ka','kg','kk','km','kn','ko','kos','krl','ks','ku','kw','ky',
            'la','lad','lb','lg','lij','liv','lmo','ln','lo','lt','lv',
            'me','mg','mh','mi','mk','ml','mn','mr','ms','mt','mwl','my',
            'nah','nan','nap','nau','ne','niu','nl','no','nr','nso','ny',
            'oc','om','or',
            'pa','pap','pau','pgl','pl','pms','pon','ps','pt','pt-BR',
            'qu',
            'rar','rgn','rm','rn','ro','ru','rw',
            'sa','sa-Deva','sc','scn','sd','sg','si','sk','sl','sm','sn','so','sq','sr','srd','srn','ss','st','sv','sw',
            'ta','te','tg','th','ti','tk','tkl','tl','tn','to','tok','tpi','tr','ts','tvl','tw','ty',
            'ug','uk','ur','uz',
            've','vec','vi','vo','vot','vro',
            'wa','wo','wuu',
            'xh',
            'yap','yo','yue',
            'zh-CN','zh-HK','zh-TW','zu'
        ];
        this.translatedLangsSet = new Set([...this.translatedLangs, 'zh']); // zh alias
    }

    async init() {
        if (this.initialized) {
            console.log('⚠️ WIA Language Modal already initialized');
            return;
        }

        console.log('🚀 Initializing WIA Language Modal 211 V2...');
        
        this.injectStyles();
        this.injectHTML();
        await this.loadLanguages();
        this.bindEvents();
        this.registerGlobalFunctions();
        
        this.initialized = true;
        console.log('✅ WIA Language Modal 211 V2 Ready!');
        
        // 저장된 언어로 번역 적용
        if (this.currentLang && this.currentLang !== 'en') {
            console.log('🌍 Applying saved language:', this.currentLang);
            window.dispatchEvent(new CustomEvent('wia-language-changed', {
                detail: { language: this.currentLang }
            }));
        }
    }

    injectStyles() {
        if (document.getElementById('wia-language-modal-styles')) {
            document.getElementById('wia-language-modal-styles').remove();
        }
        
        const styles = `
        <style id="wia-language-modal-styles">
            #${this.modalId} {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.95);
                z-index: 99999;
                align-items: flex-start;
                padding-top: 3vh;
                justify-content: center;
                animation: fadeIn 0.3s;
            }
            
            #${this.modalId}.show {
                display: flex;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            .wia-modal-content {
                background: white;
                border-radius: 24px;
                max-width: 1600px;  /* 더 크게! */
                width: 95%;
                max-height: 95vh;  /* 높이도 더 크게! */
                overflow: visible;
                box-shadow: 0 30px 60px rgba(0,0,0,0.5);
                animation: slideUp 0.3s;
            }
            
            @keyframes slideUp {
                from { transform: translateY(30px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            .wia-modal-header {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                padding: 20px 35px !important;
                text-align: center;
                position: relative;
                border-radius: 24px 24px 0 0;
            }
            
            .wia-modal-header h2 {
                margin: 0;
                font-size: 2.5rem;  /* 더 큰 제목 */
                font-weight: 700;
                color: white !important;
            }
            
            .wia-modal-header p {
                margin: 10px 0 0 0;
                font-size: 1.2rem;
                opacity: 0.95;
            }
            
            .wia-modal-subtitle {
                margin: 5px 0 0 0 !important;
                font-size: 1rem !important;
                opacity: 0.85;
                font-style: italic;
                color: white !important;
            }

            .wia-modal-close {
                position: absolute;
                top: 20px;
                right: 20px;
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                font-size: 2.5rem;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.3s;
            }
            
            .wia-modal-close:hover {
                background: rgba(255,255,255,0.3);
                transform: rotate(90deg);
            }
            
            .wia-modal-tabs {
                display: grid !important;
                grid-template-columns: repeat(7, 1fr) !important;
                /* display: flex; */
                gap: 8px !important;
                padding: 20px 44px !important;
                background: #f8f9fa;
                border-bottom: 2px solid #e5e7eb;
                /* flex-wrap: wrap; */
            }
            
            .wia-modal-tab {
                padding: 10px 8px !important;
                box-sizing: border-box !important;
                background: white !important;
                border: 2px solid #e5e7eb !important;
                border-radius: 12px !important;
                cursor: pointer !important;
                font-weight: 600 !important;
                font-size: 0.9rem !important;  /* 텍스트 크기 보장 */
                transition: all 0.3s !important;
                text-align: center !important;
                color: #333 !important;
                text-indent: 0 !important;
                overflow: visible !important;
                white-space: nowrap !important;
            }
            
            .wia-modal-tab:hover {
                background: #f3f4f6 !important;
                transform: translateY(-2px) !important;
            }
            
            .wia-modal-tab.active {
                background: linear-gradient(135deg, #667eea, #764ba2) !important;
                color: white !important;
                border-color: #667eea !important;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3) !important;
            }
            
            .wia-modal-body {
                padding: 35px 35px !important;
                overflow-y: auto;
                max-height: 440px;  /* 4행만 표시, 나머지 스크롤 */
            }
            
            .wia-lang-grid {
                display: grid;
                grid-template-columns: repeat(5, 1fr);  /* 5열 고정! */
                gap: 15px;  /* 간격 넓게 */
            }
            
            /* 작은 화면에서는 3열로 */
            @media (max-width: 768px) {
                .wia-modal-tabs {
                    grid-template-columns: repeat(4, 1fr) !important;
                    gap: 8px !important;
                    padding: 15px 20px !important;
                }
                .wia-modal-tab {
                    padding: 8px 4px !important;
                    font-size: 0.75rem !important;
                }
                .wia-lang-grid {
                    grid-template-columns: repeat(3, 1fr);
                }
            }
            
            /* 아주 작은 화면에서는 2열로 */
            @media (max-width: 480px) {
                .wia-modal-tabs {
                    grid-template-columns: repeat(3, 1fr) !important;
                    gap: 8px !important;
                }
                .wia-modal-tab {
                    padding: 6px 2px !important;
                    font-size: 0.65rem !important;
                }
                .wia-lang-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
                .wia-modal-body {
                    max-height: 280px !important;  /* 3행만 표시 */
                    padding: 20px !important;
                }
                /* 헤더 컴팩트 */
                .wia-modal-header {
                    padding: 12px 15px !important;
                    border-radius: 16px 16px 0 0 !important;
                }
                .wia-modal-header h2 {
                    font-size: 1.4rem !important;
                }
                .wia-modal-header p {
                    font-size: 0.75rem !important;
                    margin: 3px 0 0 0 !important;
                }
                .wia-modal-subtitle {
                    font-size: 0.65rem !important;
                }
                /* Showing 211 languages 숨김 */
                .wia-lang-count {
                    display: none !important;
                }
                /* 검색창 컴팩트 */
                .wia-lang-search {
                    padding: 12px !important;
                    margin-bottom: 12px !important;
                    font-size: 0.9rem !important;
                }
            }
            
            .wia-lang-item {
                color: #1f2937 !important;  /* 텍스트 색상 명시 */
                padding: 12px !important;  /* 더 큰 패딩 */
                background: white !important;
                border: 2px solid #d1d5db;  /* 테두리 추가 */
                border-radius: 12px;
                text-align: center;
                cursor: pointer;
                transition: all 0.2s;
                font-size: 1.1rem;  /* 더 큰 폰트! */
                font-weight: 500;
                min-height: 45px;  /* 최소 높이 */
                display: flex;
                align-items: center !important;
                /* padding-top: 3vh; */ /* 제거 - 중앙 정렬 */
                justify-content: center;
            }
            
            .wia-lang-item:hover {
                color: #1f2937 !important;  /* hover 텍스트 색상 */
                background: linear-gradient(135deg, rgba(102,126,234,0.25), rgba(118,75,162,0.25)) !important;
                border-color: #667eea;
                transform: translateY(-3px);
                box-shadow: 0 5px 15px rgba(102, 126, 234, 0.2);
            }
            
            .wia-lang-item.selected {
                background: linear-gradient(135deg, rgba(102,126,234,0.2), rgba(118,75,162,0.2)) !important;
                color: #1f2937 !important;
                border-color: #667eea;
                font-weight: 600;
                box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
            }
            
            .wia-lang-search {
                width: 100% !important;
                box-sizing: border-box !important;
                padding: 18px !important;
                border: 2px solid #e5e7eb !important;
                border-radius: 14px !important;
                font-size: 1.1rem !important;
                margin-bottom: 25px !important;
            }
            
            .wia-lang-search:focus {
                outline: none;
                border-color: #667eea;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }
            
            .wia-lang-count {
                text-align: center;
                padding: 15px;
                background: linear-gradient(135deg, rgba(102,126,234,0.15), rgba(118,75,162,0.15)) !important;
                border-radius: 12px;
                margin-bottom: 25px;
                font-weight: 600;
                font-size: 1.1rem;
                color: #667eea;
                transition: all 0.3s ease !important;
            }

            .wia-lang-count:hover {

            .wia-lang-contact {
                
                margin-top: 20px;
                text-align: center;
                padding: 20px;
                background: linear-gradient(135deg, rgba(102,126,234,0.08), rgba(118,75,162,0.08));
                border-radius: 12px;
                color: #666;
                font-size: 0.95rem;
            }

            .wia-lang-contact p {
                margin: 5px 0;
            }

            .wia-lang-contact a {
                color: #667eea;
                text-decoration: none;
                font-weight: 600;
            }

            .wia-lang-contact a:hover {
                text-decoration: underline;
            }

            .wia-modal-footer {
                text-align: center;
                padding: 20px 35px;
                background: #f8f9fa;
                border-top: 1px solid #e5e7eb;
                font-size: 0.85rem;
                color: #666;
                border-radius: 0 0 24px 24px;
            }

            .wia-modal-footer a {
                color: #667eea;
                text-decoration: none;
                font-weight: 600;
            }

            .wia-modal-footer a:hover {

            .wia-footer-contact {
                margin-bottom: 8px;
                font-size: 0.85rem;
                color: #888;
            }

            .wia-footer-contact a {
                color: #667eea;
            }
                text-decoration: underline;

            .wia-footer-contact {
                margin-bottom: 8px;
                font-size: 0.85rem;
                color: #888;
            }

            .wia-footer-contact a {
                color: #667eea;
            }
            }

            .wia-footer-contact {
                margin-bottom: 8px;
                font-size: 0.85rem;
                color: #888;
            }

            .wia-footer-contact a {
                color: #667eea;
            }
                background: white !important;

            .wia-lang-contact {
                
                margin-top: 20px;
                text-align: center;
                padding: 20px;
                background: linear-gradient(135deg, rgba(102,126,234,0.08), rgba(118,75,162,0.08));
                border-radius: 12px;
                color: #666;
                font-size: 0.95rem;
            }

            .wia-lang-contact p {
                margin: 5px 0;
            }

            .wia-lang-contact a {
                color: #667eea;
                text-decoration: none;
                font-weight: 600;
            }

            .wia-lang-contact a:hover {
                text-decoration: underline;
            }

            .wia-modal-footer {
                text-align: center;
                padding: 20px 35px;
                background: #f8f9fa;
                border-top: 1px solid #e5e7eb;
                font-size: 0.85rem;
                color: #666;
                border-radius: 0 0 24px 24px;
            }

            .wia-modal-footer a {
                color: #667eea;
                text-decoration: none;
                font-weight: 600;
            }

            .wia-modal-footer a:hover {

            .wia-footer-contact {
                margin-bottom: 8px;
                font-size: 0.85rem;
                color: #888;
            }

            .wia-footer-contact a {
                color: #667eea;
            }
                text-decoration: underline;

            .wia-footer-contact {
                margin-bottom: 8px;
                font-size: 0.85rem;
                color: #888;
            }

            .wia-footer-contact a {
                color: #667eea;
            }
            }

            .wia-footer-contact {
                margin-bottom: 8px;
                font-size: 0.85rem;
                color: #888;
            }

            .wia-footer-contact a {
                color: #667eea;
            }
                box-shadow: 0 2px 10px rgba(102, 126, 234, 0.2);

            .wia-lang-contact {
                
                margin-top: 20px;
                text-align: center;
                padding: 20px;
                background: linear-gradient(135deg, rgba(102,126,234,0.08), rgba(118,75,162,0.08));
                border-radius: 12px;
                color: #666;
                font-size: 0.95rem;
            }

            .wia-lang-contact p {
                margin: 5px 0;
            }

            .wia-lang-contact a {
                color: #667eea;
                text-decoration: none;
                font-weight: 600;
            }

            .wia-lang-contact a:hover {
                text-decoration: underline;
            }

            .wia-modal-footer {
                text-align: center;
                padding: 20px 35px;
                background: #f8f9fa;
                border-top: 1px solid #e5e7eb;
                font-size: 0.85rem;
                color: #666;
                border-radius: 0 0 24px 24px;
            }

            .wia-modal-footer a {
                color: #667eea;
                text-decoration: none;
                font-weight: 600;
            }

            .wia-modal-footer a:hover {

            .wia-footer-contact {
                margin-bottom: 8px;
                font-size: 0.85rem;
                color: #888;
            }

            .wia-footer-contact a {
                color: #667eea;
            }
                text-decoration: underline;

            .wia-footer-contact {
                margin-bottom: 8px;
                font-size: 0.85rem;
                color: #888;
            }

            .wia-footer-contact a {
                color: #667eea;
            }
            }

            .wia-footer-contact {
                margin-bottom: 8px;
                font-size: 0.85rem;
                color: #888;
            }

            .wia-footer-contact a {
                color: #667eea;
            }
                transition: all 0.3s ease;

            .wia-lang-contact {
                
                margin-top: 20px;
                text-align: center;
                padding: 20px;
                background: linear-gradient(135deg, rgba(102,126,234,0.08), rgba(118,75,162,0.08));
                border-radius: 12px;
                color: #666;
                font-size: 0.95rem;
            }

            .wia-lang-contact p {
                margin: 5px 0;
            }

            .wia-lang-contact a {
                color: #667eea;
                text-decoration: none;
                font-weight: 600;
            }

            .wia-lang-contact a:hover {
                text-decoration: underline;
            }

            .wia-modal-footer {
                text-align: center;
                padding: 20px 35px;
                background: #f8f9fa;
                border-top: 1px solid #e5e7eb;
                font-size: 0.85rem;
                color: #666;
                border-radius: 0 0 24px 24px;
            }

            .wia-modal-footer a {
                color: #667eea;
                text-decoration: none;
                font-weight: 600;
            }

            .wia-modal-footer a:hover {

            .wia-footer-contact {
                margin-bottom: 8px;
                font-size: 0.85rem;
                color: #888;
            }

            .wia-footer-contact a {
                color: #667eea;
            }
                text-decoration: underline;

            .wia-footer-contact {
                margin-bottom: 8px;
                font-size: 0.85rem;
                color: #888;
            }

            .wia-footer-contact a {
                color: #667eea;
            }
            }

            .wia-footer-contact {
                margin-bottom: 8px;
                font-size: 0.85rem;
                color: #888;
            }

            .wia-footer-contact a {
                color: #667eea;
            }
            }

            .wia-lang-contact {
                
                margin-top: 20px;
                text-align: center;
                padding: 20px;
                background: linear-gradient(135deg, rgba(102,126,234,0.08), rgba(118,75,162,0.08));
                border-radius: 12px;
                color: #666;
                font-size: 0.95rem;
            }

            .wia-lang-contact p {
                margin: 5px 0;
            }

            .wia-lang-contact a {
                color: #667eea;
                text-decoration: none;
                font-weight: 600;
            }

            .wia-lang-contact a:hover {
                text-decoration: underline;
            }

            .wia-modal-footer {
                text-align: center;
                padding: 20px 35px;
                background: #f8f9fa;
                border-top: 1px solid #e5e7eb;
                font-size: 0.85rem;
                color: #666;
                border-radius: 0 0 24px 24px;
            }

            .wia-modal-footer a {
                color: #667eea;
                text-decoration: none;
                font-weight: 600;
            }

            .wia-modal-footer a:hover {

            .wia-footer-contact {
                margin-bottom: 8px;
                font-size: 0.85rem;
                color: #888;
            }

            .wia-footer-contact a {
                color: #667eea;
            }
                text-decoration: underline;

            .wia-footer-contact {
                margin-bottom: 8px;
                font-size: 0.85rem;
                color: #888;
            }

            .wia-footer-contact a {
                color: #667eea;
            }
            }

            .wia-footer-contact {
                margin-bottom: 8px;
                font-size: 0.85rem;
                color: #888;
            }

            .wia-footer-contact a {
                color: #667eea;
            }
        </style>`;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    injectHTML() {
        if (document.getElementById(this.modalId)) {
            document.getElementById(this.modalId).remove();
        }
        
        const html = `
        <div id="${this.modalId}">
            <div class="wia-modal-content">
                <div class="wia-modal-header">
                    <h2>🌍 Choose Your Language</h2>
                    <p>홍익인간 - 널리 인간세상을 이롭게 하라!</p>
                    <p class="wia-modal-subtitle">Benefit All Humanity</p>
                    <button class="wia-modal-close" id="wiaModalClose">×</button>
                </div>
                
                <div class="wia-modal-tabs">
                    <button class="wia-modal-tab active" data-filter="all">All (211)</button>
                    <button class="wia-modal-tab" data-filter="popular">⭐ Popular</button>
                    <button class="wia-modal-tab" data-filter="asian">🌏 Asian</button>
                    <button class="wia-modal-tab" data-filter="european">🌍 European</button>
                    <button class="wia-modal-tab" data-filter="african">🌍 African</button>
                    <button class="wia-modal-tab" data-filter="americas">🌎 Americas</button>
                    <button class="wia-modal-tab" data-filter="oceanic">🏝️ Oceanic</button>
                </div>
                
                <div class="wia-modal-body">
                    <input type="text" class="wia-lang-search" id="wiaLangSearch" placeholder="🔍 Search 211 languages...">
                    <div class="wia-lang-count" id="wiaLangCount">Loading languages...</div>
                    <div class="wia-lang-grid" id="wiaLangGrid">
                        <!-- Languages will be loaded here -->
                    </div>
                </div>
                <div class="wia-modal-footer">
                    <div class="wia-footer-contact">We apologize if your language is not listed yet. Please contact us: <a href="mailto:global@thekoreantoday.com">📧 global@thekoreantoday.com</a></div>
                    © <span id="wiaFooterYear">2026</span> <a href="https://smilestory.ai/" target="_blank">SmileStory</a> Group. All rights reserved. Made with ❤️ for Humanity
                </div>
            </div>
        </div>`;
        
        document.body.insertAdjacentHTML('beforeend', html);
    }

    async loadLanguages() {
        try {
            const paths = [
                '/wialanguages/data/languages-211-complete.json',
                '/assets/data/languages-211.json',
                'https://wiabooks.store/wialanguages/data/languages-211-complete.json'
            ];
            
            let loaded = false;
            for (const path of paths) {
                try {
                    const response = await fetch(path);
                    if (response.ok) {
                        this.languages = await response.json();
                        console.log(`✅ Loaded ${Object.keys(this.languages).length} languages from ${path}`);
                        loaded = true;
                        break;
                    }
                } catch (e) {
                    continue;
                }
            }
            
            if (!loaded) {
                throw new Error('Failed to load from all paths');
            }
            
        } catch (error) {
            console.warn('⚠️ Using fallback languages:', error);
            this.languages = this.getFallbackLanguages();
        }
        
        this.renderLanguages('all');
    }

    getFallbackLanguages() {
        const langs = {
            'en': { native: 'English' },
            'ko': { native: '한국어' },
            'zh-CN': { native: '中文(简体)' },
            'ja': { native: '日本語' },
            'es': { native: 'Español' },
            'fr': { native: 'Français' },
            'de': { native: 'Deutsch' },
            'ru': { native: 'Русский' },
            'ar': { native: 'العربية' },
            'pt': { native: 'Português' },
            'it': { native: 'Italiano' },
            'nl': { native: 'Nederlands' },
            'pl': { native: 'Polski' },
            'tr': { native: 'Türkçe' },
            'hi': { native: 'हिन्दी' },
            'th': { native: 'ไทย' },
            'vi': { native: 'Tiếng Việt' },
            'id': { native: 'Bahasa Indonesia' },
            'he': { native: 'עברית' },
            'sv': { native: 'Svenska' }
        };

        let counter = 1;
        while (Object.keys(langs).length < 211) {
            langs[`lang${counter}`] = { native: `Language ${counter}` };
            counter++;
        }
        
        return langs;
    }

    getContinentMap() {
        return {
            popular: ['en', 'zh-CN', 'es', 'hi', 'ar', 'bn', 'pt', 'ru', 'ja', 'pa', 'de', 'ko', 'fr', 'tr', 'vi', 'ur', 'it', 'th', 'gu', 'fa'],
            asian: ['ko', 'ja', 'zh-CN', 'zh-TW', 'zh-HK', 'th', 'vi', 'id', 'ms', 'tl', 'my', 'km', 'lo', 'hi', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'si', 'ne', 'ur', 'pa', 'ps', 'fa', 'ku'],
            european: ['en', 'en-GB', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'pl', 'uk', 'nl', 'el', 'sv', 'no', 'da', 'fi', 'is', 'et', 'lv', 'lt', 'cs', 'sk', 'hu', 'ro', 'bg', 'hr', 'sr', 'sl', 'mk', 'sq', 'mt', 'ga', 'cy', 'gd', 'eu', 'ca', 'gl', 'tr'],
            african: ['ar', 'am', 'ha', 'yo', 'ig', 'sw', 'zu', 'xh', 'af', 'so', 'rw', 'sn', 'ny', 'mg', 'tn', 'st', 'ss', 'ti', 'wo', 'ff', 'lg', 'om', 'ak', 'tw'],
            americas: ['en-US', 'en-CA', 'es-MX', 'es-AR', 'es-CO', 'es-CL', 'es-PE', 'pt-BR', 'fr-CA', 'qu', 'gn', 'ay', 'nah', 'chr', 'iu', 'haw'],
            oceanic: ['en-AU', 'en-NZ', 'mi', 'fj', 'sm', 'to', 'ty', 'tvl', 'nau', 'mh', 'bi', 'tpi']
        };
    }

    filterLanguages(filter) {
        this.currentFilter = filter;
        
        document.querySelectorAll('.wia-modal-tab').forEach(tab => {
            if (tab.dataset.filter === filter) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        this.renderLanguages(filter);
    }

    searchLanguages(query) {
        const searchTerm = query.toLowerCase();
        const filtered = {};
        
        Object.entries(this.languages).forEach(([code, lang]) => {
            const name = (lang.native || lang.name || code).toLowerCase();
            if (name.includes(searchTerm) || code.toLowerCase().includes(searchTerm)) {
                filtered[code] = lang;
            }
        });
        
        this.renderGrid(filtered);
    }

    renderLanguages(filter) {
        let filtered = {};
        
        if (filter === 'all') {
            filtered = this.languages;
        } else {
            const continentMap = this.getContinentMap();
            if (continentMap[filter]) {
                Object.entries(this.languages).forEach(([code, lang]) => {
                    if (continentMap[filter].includes(code) || 
                        continentMap[filter].some(c => code.startsWith(c + '-'))) {
                        filtered[code] = lang;
                    }
                });
            }
        }
        
        this.renderGrid(filtered);
    }

    renderGrid(languages) {
        const grid = document.getElementById('wiaLangGrid');
        const count = document.getElementById('wiaLangCount');

        if (!grid) return;

        const langArray = Object.entries(languages);
        count.textContent = `Showing ${langArray.length} languages`;

        // Reorder: translated languages first, then the rest
        const sorted = [];
        const usedCodes = new Set();

        // Add translated languages first (in defined order)
        for (const code of this.translatedLangs) {
            const entry = langArray.find(([c]) => c === code);
            if (entry) {
                sorted.push(entry);
                usedCodes.add(code);
            }
        }

        // Add remaining languages in original order
        for (const entry of langArray) {
            if (!usedCodes.has(entry[0])) {
                sorted.push(entry);
            }
        }

        grid.innerHTML = sorted.map(([code, lang]) => {
            const name = lang.native || lang.name || code;
            const isSelected = code === this.currentLang;
            return `
                <div class="wia-lang-item ${isSelected ? 'selected' : ''}"
                     data-code="${code}">
                    ${name}
                </div>
            `;
        }).join('');

        grid.querySelectorAll('.wia-lang-item').forEach(item => {
            item.addEventListener('click', () => {
                this.selectLanguage(item.dataset.code);
            });
        });
    }

    selectLanguage(code) {
        // HTML lang 속성 업데이트
        document.documentElement.lang = code;
        console.log('🌐 HTML lang updated to:', code);
        this.currentLang = code;
        localStorage.setItem('kaitrust_language', code);
        
        // URL 파라미터 업데이트 (SEO & 공유 링크)
        const url = new URL(window.location);
        url.searchParams.set('lang', code);
        window.history.pushState({}, '', url);
        console.log('🔗 URL updated to:', url.href);
        
        const display = document.getElementById('currentLangDisplay');
        if (display) {
            display.textContent = code.split('-')[0].toUpperCase().substring(0, 2);
        }
        
        document.querySelectorAll('.wia-lang-item').forEach(item => {
            if (item.dataset.code === code) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
        
        setTimeout(() => this.close(), 300);
        
        // 이벤트 발생
        window.dispatchEvent(new CustomEvent('wia-language-changed', {
            detail: { language: code }
        }));
        
        if (this.onLanguageChange) {
            this.onLanguageChange(code);
        }
    }

    open() {
        const modal = document.getElementById(this.modalId);
        if (modal) {
            modal.classList.add('show');
            this.renderLanguages(this.currentFilter);
        }
    }

    close() {
        const modal = document.getElementById(this.modalId);
        if (modal) {
            modal.classList.remove('show');
        }
    }

    bindEvents() {
        // 동적 연도 설정
        const footerYear = document.getElementById("wiaFooterYear");
        if (footerYear) footerYear.textContent = new Date().getFullYear();

        const closeBtn = document.getElementById('wiaModalClose');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }
        
        document.querySelectorAll('.wia-modal-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.filterLanguages(tab.dataset.filter);
            });
        });
        
        const searchInput = document.getElementById('wiaLangSearch');
        if (searchInput) {
            searchInput.addEventListener('keyup', (e) => {
                this.searchLanguages(e.target.value);
            });
        }
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.close();
            }
        });
    }

    registerGlobalFunctions() {
        window.openLanguageModal = () => this.open();
        window.closeLanguageModal = () => this.close();
        window.changeLanguage = (code) => this.selectLanguage(code);
        
        console.log('✅ Global functions registered: openLanguageModal(), closeLanguageModal(), changeLanguage()');
    }

    attachToButtons(selector = '.language-btn, .language-toggle-btn') {
        document.querySelectorAll(selector).forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.open();
            });
        });
        
        console.log(`✅ Attached to ${document.querySelectorAll(selector).length} language buttons`);
    }
}

// 전역 인스턴스 생성
window.WIALanguageModal = new WIALanguageModal();

// 자동 초기화 (window.load에서 실행)
window.addEventListener('load', () => {
    window.WIALanguageModal.init();
    window.WIALanguageModal.attachToButtons();
});

console.log('📦 WIA Language Modal 211 V2 Component Loaded (5 columns, bigger font)');
