/**
 * WIA Reading Settings Toolkit v2.0.0
 * 弘益人間 - 널리 인간을 이롭게
 * 
 * 리브랜딩: ♿ → ⚙️ (읽기 설정)
 * 테마: BTS Purple 💜
 * 
 * @version 2.0.0
 * @updated 2026-01-15
 */

(function() {
    'use strict';

    if (window.WIA_A11Y_TOOLKIT_LOADED) return;
    window.WIA_A11Y_TOOLKIT_LOADED = true;

    // 설정 옵션
    const userConfig = window.WIA_A11Y_CONFIG || {};
    const fabBottom = userConfig.fabBottom || '20px';
    const fabRight = userConfig.fabRight || '20px';
    const showFab = userConfig.showFab !== false;
    const apiOnly = userConfig.apiOnly === true;

    // WIA Braille 正音 변환 엔진
    const WIA_BRAILLE = (function() {
        const CHOSEONG = {'ㄱ':'⠅','ㄲ':'⠅⠅','ㄴ':'⠝','ㄷ':'⠙','ㄸ':'⠙⠙','ㄹ':'⠇','ㅁ':'⠍','ㅂ':'⠃','ㅃ':'⠃⠃','ㅅ':'⠎','ㅆ':'⠎⠎','ㅇ':'','ㅈ':'⠚','ㅉ':'⠚⠚','ㅊ':'⠡','ㅋ':'⠅⠓','ㅌ':'⠙⠓','ㅍ':'⠃⠓','ㅎ':'⠓'};
        const JUNGSEONG = {'ㅏ':'⠁','ㅐ':'⠌','ㅑ':'⠣','ㅒ':'⠣⠌','ㅓ':'⠎','ㅔ':'⠑','ㅕ':'⠣⠎','ㅖ':'⠣⠑','ㅗ':'⠕','ㅘ':'⠕⠁','ㅙ':'⠕⠌','ㅚ':'⠪','ㅛ':'⠣⠕','ㅜ':'⠥','ㅝ':'⠥⠎','ㅞ':'⠥⠑','ㅟ':'⠬','ㅠ':'⠣⠥','ㅡ':'⠳','ㅢ':'⠳⠊','ㅣ':'⠊'};
        const JONGSEONG = {'':'','ㄱ':'⠁','ㄲ':'⠁⠁','ㄳ':'⠁⠄','ㄴ':'⠒','ㄵ':'⠒⠚','ㄶ':'⠒⠓','ㄷ':'⠔','ㄹ':'⠂','ㄺ':'⠂⠁','ㄻ':'⠂⠍','ㄼ':'⠂⠃','ㄽ':'⠂⠄','ㄾ':'⠂⠙','ㄿ':'⠂⠃','ㅀ':'⠂⠓','ㅁ':'⠢','ㅂ':'⠃','ㅄ':'⠃⠄','ㅅ':'⠄','ㅆ':'⠄⠄','ㅇ':'⠶','ㅈ':'⠅','ㅊ':'⠆','ㅋ':'⠖','ㅌ':'⠦','ㅍ':'⠲','ㅎ':'⠴'};
        const ENGLISH = {'a':'⠁','b':'⠃','c':'⠉','d':'⠙','e':'⠑','f':'⠋','g':'⠛','h':'⠓','i':'⠊','j':'⠚','k':'⠅','l':'⠇','m':'⠍','n':'⠝','o':'⠕','p':'⠏','q':'⠟','r':'⠗','s':'⠎','t':'⠞','u':'⠥','v':'⠧','w':'⠺','x':'⠭','y':'⠽','z':'⠵'};
        const NUMBERS = {'0':'⠚','1':'⠁','2':'⠃','3':'⠉','4':'⠙','5':'⠑','6':'⠋','7':'⠛','8':'⠓','9':'⠊'};
        const SPECIAL = {' ':' ','.':'⠲',',':'⠂','?':'⠦','!':'⠖','-':'⠤','\n':'\n'};
        const CHO=['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
        const JUNG=['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
        const JONG=['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
        
        function convert(text) {
            if (!text) return '';
            let result = '', isNum = false;
            for (const c of text) {
                const code = c.charCodeAt(0);
                if (code >= 44032 && code <= 55203) {
                    isNum = false;
                    const base = code - 44032;
                    result += (CHOSEONG[CHO[Math.floor(base/588)]]||'') + (JUNGSEONG[JUNG[Math.floor((base%588)/28)]]||'') + (JONGSEONG[JONG[base%28]]||'');
                } else if (ENGLISH[c]) { isNum = false; result += ENGLISH[c]; }
                else if (ENGLISH[c.toLowerCase()]) { isNum = false; result += '⠠' + ENGLISH[c.toLowerCase()]; }
                else if (NUMBERS[c]) { if (!isNum) { result += '⠼'; isNum = true; } result += NUMBERS[c]; }
                else if (SPECIAL[c] !== undefined) { isNum = false; result += SPECIAL[c]; }
                else { isNum = false; result += c; }
            }
            return result;
        }
        return { convert };
    })();
    window.WIA_BRAILLE = WIA_BRAILLE;

    if (apiOnly) {
        console.log('%c⚙️ WIA Reading Settings v2.0.0 (API Only)', 'color: #A855F7; font-size: 14px; font-weight: bold;');
        return;
    }

    // 다국어
    const TRANSLATIONS = {
        ko: { title:'읽기 설정', highContrast:'고대비 모드', normalMode:'일반 모드', fontSize:'글꼴 크기', current:'현재', tts:'음성 읽기 (TTS)', ttsBtn:'음성으로 듣기', ttsStop:'중지', ttsReading:'읽는 중...', signLang:'수어 (WIA TALK 正音)', wiaTalkDesc:'93개 제스처 · 211개 언어', braille:'점자 (WIA BRAILLE 正音)', brailleBtn:'점자로 보기', brailleBtnOff:'일반 텍스트로 보기', brailleLabel:'WIA Braille 正音 (IPA 기반)', brailleInfo:'루이 브라유 정신 계승', learnMore:'더 알아보기', footer:'널리 인간을 이롭게', wiaBrailleDesc:'IPA 기반 · 211개 언어' },
        en: { title:'Reading Settings', highContrast:'High Contrast', normalMode:'Normal Mode', fontSize:'Font Size', current:'Current', tts:'Text-to-Speech', ttsBtn:'Listen', ttsStop:'Stop', ttsReading:'Reading...', signLang:'Sign Language', wiaTalkDesc:'93 Gestures · 211 Languages', braille:'Braille', brailleBtn:'View in Braille', brailleBtnOff:'View Normal Text', brailleLabel:'WIA Braille (IPA-based)', brailleInfo:'Louis Braille Legacy', learnMore:'Learn More', footer:'Benefit All Humanity', wiaBrailleDesc:'IPA-based · 211 Languages' }
    };
    const getLang = () => (localStorage.getItem('wiaLang')||navigator.language).startsWith('ko') ? 'ko' : 'en';
    const t = (key) => TRANSLATIONS[getLang()][key] || TRANSLATIONS.en[key] || key;

    const CONFIG = { zIndex: 99999, urls: { wiaTalk: 'https://wia.live/wia-talk/', wiaBraille: 'https://wia.live/wia-braille/' } };

    function injectStyles() {
        if (document.getElementById('wia-a11y-styles')) return;
        const s = document.createElement('style');
        s.id = 'wia-a11y-styles';
        s.textContent = `
            body.wia-high-contrast { filter: contrast(1.4) !important; }
            
            /* 💜 FAB 버튼 - BTS Purple */
            #wia-a11y-fab { 
                position:fixed; bottom:${fabBottom}; right:${fabRight}; 
                width:56px; height:56px; border-radius:50%; 
                background: linear-gradient(135deg, #A855F7, #7C3AED);
                border:none; cursor:pointer; 
                box-shadow: 0 4px 20px rgba(168, 85, 247, 0.5), 0 0 0 3px rgba(255,255,255,0.2);
                z-index:${CONFIG.zIndex}; 
                display:${showFab ? 'flex' : 'none'}; 
                align-items:center; justify-content:center; 
                font-size:26px; transition:all 0.3s; 
                animation:wia-glow 2s infinite; 
            }
            #wia-a11y-fab:hover { transform:scale(1.1); box-shadow: 0 6px 30px rgba(168, 85, 247, 0.7); }
            #wia-a11y-fab:focus { outline:4px solid #C084FC; outline-offset:2px; }
            @keyframes wia-glow { 0%,100%{ box-shadow: 0 4px 20px rgba(168, 85, 247, 0.5); } 50%{ box-shadow: 0 4px 30px rgba(124, 58, 237, 0.7); } }
            
            #wia-a11y-overlay { position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.6); backdrop-filter:blur(4px); z-index:${CONFIG.zIndex+1}; display:none; opacity:0; transition:opacity 0.3s; }
            #wia-a11y-overlay.show { display:block; opacity:1; }
            
            #wia-a11y-modal { position:fixed; bottom:calc(${fabBottom} + 70px); right:${fabRight}; width:340px; max-height:80vh; background:#ffffff; border-radius:16px; box-shadow:0 25px 50px -12px rgba(0,0,0,0.25); z-index:${CONFIG.zIndex+2}; display:none; opacity:0; transform:translateY(20px); transition:all 0.3s ease; overflow:hidden; color:#1f2937; }
            #wia-a11y-modal.show { display:block; opacity:1; transform:translateY(0); }
            #wia-a11y-modal.wide { width:calc(100vw - 40px); max-width:600px; }
            
            /* 💜 헤더 - BTS Purple */
            .wia-header { background: linear-gradient(135deg, #A855F7, #7C3AED); color:white; padding:14px 18px; display:flex; justify-content:space-between; align-items:center; }
            .wia-header h2 { margin:0; font-size:17px; font-weight:600; }
            .wia-close { background:rgba(255,255,255,0.2); border:none; color:white; width:30px; height:30px; border-radius:50%; cursor:pointer; font-size:18px; display:flex; align-items:center; justify-content:center; transition:background 0.2s; }
            .wia-close:hover { background:rgba(255,255,255,0.3); }
            
            .wia-content { padding:14px; max-height:calc(80vh - 100px); overflow-y:auto; }
            .wia-section { margin-bottom:16px; }
            .wia-label { font-size:10px; font-weight:600; color:#6b7280; margin-bottom:8px; text-transform:uppercase; letter-spacing:0.5px; }
            
            .wia-btn { padding:10px 16px; border-radius:10px; border:none; cursor:pointer; font-size:13px; font-weight:500; display:inline-flex; align-items:center; gap:8px; transition:all 0.2s; }
            .wia-btn:focus { outline:3px solid #A855F7; outline-offset:2px; }
            .wia-btn-dark { background:#374151; color:white; } .wia-btn-dark:hover { background:#4b5563; }
            .wia-btn-green { background:#10b981; color:white; } .wia-btn-green:hover { background:#059669; }
            .wia-btn-purple { background:#A855F7; color:white; } .wia-btn-purple:hover { background:#9333EA; }
            .wia-btn-gray { background:#9ca3af; color:white; } .wia-btn-gray:hover { background:#6b7280; }
            .wia-btn-group { display:flex; gap:8px; flex-wrap:wrap; }
            
            .wia-font-btns { display:flex; gap:6px; }
            .wia-font-btn { width:40px; height:40px; border-radius:8px; border:2px solid #e5e7eb; background:white; color:#374151; cursor:pointer; font-weight:bold; font-size:14px; transition:all 0.2s; }
            .wia-font-btn:hover { border-color:#A855F7; background:#FAF5FF; color:#A855F7; }
            .wia-font-current { margin-left:auto; font-size:12px; color:#6b7280; display:flex; align-items:center; }
            
            .wia-card { display:flex; align-items:center; padding:12px 14px; background:#f9fafb; border-radius:10px; text-decoration:none; color:#1f2937; transition:all 0.2s; border:2px solid transparent; margin-bottom:6px; }
            .wia-card:hover { background:#FAF5FF; border-color:#A855F7; }
            .wia-card-icon { font-size:24px; margin-right:10px; }
            .wia-card-content { flex:1; }
            .wia-card-title { font-weight:600; font-size:13px; margin-bottom:1px; }
            .wia-card-desc { font-size:10px; color:#6b7280; }
            .wia-card-arrow { font-size:14px; color:#9ca3af; }
            
            .wia-footer { padding:10px 14px; background:#FAF5FF; border-top:1px solid #E9D5FF; text-align:center; }
            .wia-footer p { margin:0; font-size:10px; color:#6b7280; line-height:1.4; }
            .wia-footer a { color:#A855F7; text-decoration:none; }
            .wia-footer strong { color:#7C3AED; }
            
            .wia-tts-status { display:flex; align-items:center; gap:8px; padding:8px 12px; background:#F3E8FF; border-radius:8px; margin-top:8px; font-size:12px; color:#6D28D9; }
            .wia-tts-status.hidden { display:none; }
            .wia-tts-dot { width:8px; height:8px; background:#A855F7; border-radius:50%; animation:wia-blink 1s infinite; }
            @keyframes wia-blink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
            
            .wia-braille-box { margin-top:10px; padding:16px; background:linear-gradient(135deg,#1e1b4b,#312e81); border:2px solid #A855F7; border-radius:10px; max-height:180px; overflow-y:auto; }
            .wia-braille-box.hidden { display:none; }
            .wia-braille-label { font-size:9px; color:#C4B5FD; margin-bottom:10px; font-weight:600; }
            .wia-braille-text { font-family: "Noto Sans Symbols 2", "Segoe UI Symbol", monospace; font-size:22px; line-height:1.6; color:#E9D5FF; word-break:break-all; }
            .wia-braille-info { margin-top:10px; padding-top:8px; border-top:1px dashed #A855F7; font-size:9px; color:#C4B5FD; }
            .wia-braille-info a { color:#C4B5FD; text-decoration:underline; }
            
            @media (max-width:400px) { #wia-a11y-modal, #wia-a11y-modal.wide { width:calc(100vw - 40px); right:20px; } }
        `;
        document.head.appendChild(s);
    }

    function injectHTML() {
        if (document.getElementById('wia-a11y-fab')) return;
        
        const fab = document.createElement('div');
        fab.id = 'wia-a11y-fab';
        fab.setAttribute('role', 'button');
        fab.setAttribute('tabindex', '0');
        fab.setAttribute('aria-label', t('title'));
        fab.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>';
        document.body.appendChild(fab);

        const overlay = document.createElement('div');
        overlay.id = 'wia-a11y-overlay';
        document.body.appendChild(overlay);

        const modal = document.createElement('div');
        modal.id = 'wia-a11y-modal';
        modal.setAttribute('role', 'dialog');
        modal.innerHTML = `
            <div class="wia-header">
                <h2>⚙️ <span id="wia-title">${t('title')}</span></h2>
                <button class="wia-close">&times;</button>
            </div>
            <div class="wia-content">
                <div class="wia-section">
                    <div class="wia-label" id="wia-l-contrast">${t('highContrast')}</div>
                    <button class="wia-btn wia-btn-dark" id="wia-contrast-btn"><span>🌗</span><span id="wia-contrast-text">${t('highContrast')}</span></button>
                </div>
                <div class="wia-section">
                    <div class="wia-label" id="wia-l-font">${t('fontSize')}</div>
                    <div class="wia-btn-group">
                        <div class="wia-font-btns">
                            <button class="wia-font-btn" id="wia-font-dec">A-</button>
                            <button class="wia-font-btn" id="wia-font-reset">A</button>
                            <button class="wia-font-btn" id="wia-font-inc">A+</button>
                        </div>
                        <span class="wia-font-current"><span id="wia-l-current">${t('current')}</span>: <span id="wia-font-size">16px</span></span>
                    </div>
                </div>
                <div class="wia-section">
                    <div class="wia-label" id="wia-l-tts">${t('tts')}</div>
                    <div class="wia-btn-group">
                        <button class="wia-btn wia-btn-green" id="wia-tts-btn"><span>🔊</span><span id="wia-tts-text">${t('ttsBtn')}</span></button>
                        <button class="wia-btn wia-btn-gray" id="wia-tts-stop" style="display:none;"><span>⏹️</span><span>${t('ttsStop')}</span></button>
                    </div>
                    <div class="wia-tts-status hidden" id="wia-tts-status"><div class="wia-tts-dot"></div><span id="wia-tts-reading">${t('ttsReading')}</span></div>
                </div>
                <div class="wia-section">
                    <div class="wia-label" id="wia-l-sign">${t('signLang')}</div>
                    <a href="${CONFIG.urls.wiaTalk}" target="_blank" class="wia-card">
                        <span class="wia-card-icon">🤟</span>
                        <div class="wia-card-content"><div class="wia-card-title">WIA Talk 正音</div><div class="wia-card-desc" id="wia-talk-desc">${t('wiaTalkDesc')}</div></div>
                        <span class="wia-card-arrow">→</span>
                    </a>
                </div>
                <div class="wia-section">
                    <div class="wia-label" id="wia-l-braille">${t('braille')}</div>
                    <button class="wia-btn wia-btn-purple" id="wia-braille-btn" style="width:100%; justify-content:center;"><span>⠃</span><span id="wia-braille-btn-text">${t('brailleBtn')}</span></button>
                    <div class="wia-braille-box hidden" id="wia-braille-box">
                        <div class="wia-braille-label" id="wia-braille-label">⠃ ${t('brailleLabel')}</div>
                        <div class="wia-braille-text" id="wia-braille-text"></div>
                        <div class="wia-braille-info"><span id="wia-braille-info">${t('brailleInfo')}</span><br><a href="${CONFIG.urls.wiaBraille}" target="_blank" id="wia-learn-more">${t('learnMore')} →</a></div>
                    </div>
                    <a href="${CONFIG.urls.wiaBraille}" target="_blank" class="wia-card" style="margin-top:8px;">
                        <span class="wia-card-icon">📖</span>
                        <div class="wia-card-content"><div class="wia-card-title">WIA Braille 正音</div><div class="wia-card-desc" id="wia-braille-desc">${t('wiaBrailleDesc')}</div></div>
                        <span class="wia-card-arrow">→</span>
                    </a>
                </div>
            </div>
            <div class="wia-footer"><p><strong>홍익인간(弘益人間)</strong> · <span id="wia-footer-text">${t('footer')}</span><br><a href="https://wia.live" target="_blank">WIA Standards</a></p></div>
        `;
        document.body.appendChild(modal);
    }

    function updateLanguage() {
        const els = {'wia-title':t('title'),'wia-l-contrast':t('highContrast'),'wia-l-font':t('fontSize'),'wia-l-current':t('current'),'wia-l-tts':t('tts'),'wia-tts-text':t('ttsBtn'),'wia-tts-reading':t('ttsReading'),'wia-l-sign':t('signLang'),'wia-talk-desc':t('wiaTalkDesc'),'wia-l-braille':t('braille'),'wia-braille-label':'⠃ '+t('brailleLabel'),'wia-braille-info':t('brailleInfo'),'wia-learn-more':t('learnMore')+' →','wia-braille-desc':t('wiaBrailleDesc'),'wia-footer-text':t('footer')};
        for (const [id, text] of Object.entries(els)) { const el = document.getElementById(id); if (el) el.textContent = text; }
        const btnText = document.getElementById('wia-braille-btn-text');
        if (btnText) btnText.textContent = document.getElementById('wia-braille-box').classList.contains('hidden') ? t('brailleBtn') : t('brailleBtnOff');
        const contrastText = document.getElementById('wia-contrast-text');
        if (contrastText) contrastText.textContent = document.body.classList.contains('wia-high-contrast') ? t('normalMode') : t('highContrast');
    }

    function initContrast() {
        const btn = document.getElementById('wia-contrast-btn');
        const text = document.getElementById('wia-contrast-text');
        if (localStorage.getItem('wia-high-contrast') === 'true') { document.body.classList.add('wia-high-contrast'); text.textContent = t('normalMode'); }
        btn.onclick = () => { document.body.classList.toggle('wia-high-contrast'); const isHC = document.body.classList.contains('wia-high-contrast'); text.textContent = isHC ? t('normalMode') : t('highContrast'); localStorage.setItem('wia-high-contrast', isHC); };
    }

    function initFontSize() {
        const sizes = [12,14,16,18,20,24];
        let idx = sizes.indexOf(parseInt(localStorage.getItem('wia-font-size'))) || 2;
        if (idx < 0) idx = 2;
        const apply = () => { document.documentElement.style.fontSize = sizes[idx]+'px'; document.getElementById('wia-font-size').textContent = sizes[idx]+'px'; localStorage.setItem('wia-font-size', sizes[idx]); };
        apply();
        document.getElementById('wia-font-dec').onclick = () => { if (idx > 0) { idx--; apply(); } };
        document.getElementById('wia-font-reset').onclick = () => { idx = 2; apply(); };
        document.getElementById('wia-font-inc').onclick = () => { if (idx < sizes.length - 1) { idx++; apply(); } };
    }

    function initTTS() {
        const ttsBtn = document.getElementById('wia-tts-btn');
        const stopBtn = document.getElementById('wia-tts-stop');
        const status = document.getElementById('wia-tts-status');
        if (!('speechSynthesis' in window)) { ttsBtn.disabled = true; ttsBtn.innerHTML = '<span>❌</span><span>TTS 미지원</span>'; return; }
        const getPageText = () => { const clone = document.body.cloneNode(true); ['#wia-a11y-modal','#wia-a11y-fab','script','style'].forEach(sel => clone.querySelectorAll(sel).forEach(el => el.remove())); return clone.innerText.substring(0, 5000); };
        const speak = () => {
            const text = getPageText();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = /[가-힣]/.test(text) ? 'ko-KR' : 'en-US';
            utterance.onstart = () => { ttsBtn.style.display = 'none'; stopBtn.style.display = 'flex'; status.classList.remove('hidden'); };
            utterance.onend = utterance.onerror = () => { ttsBtn.style.display = 'flex'; stopBtn.style.display = 'none'; status.classList.add('hidden'); speechSynthesis.cancel(); };
            speechSynthesis.speak(utterance);
        };
        ttsBtn.onclick = speak;
        stopBtn.onclick = () => { speechSynthesis.cancel(); ttsBtn.style.display = 'flex'; stopBtn.style.display = 'none'; status.classList.add('hidden'); };
    }

    function initBraille() {
        const modal = document.getElementById('wia-a11y-modal');
        const btn = document.getElementById('wia-braille-btn');
        const btnText = document.getElementById('wia-braille-btn-text');
        const box = document.getElementById('wia-braille-box');
        const textEl = document.getElementById('wia-braille-text');
        let isActive = false;
        const getPageText = () => { const clone = document.body.cloneNode(true); ['#wia-a11y-modal','#wia-a11y-fab','script','style'].forEach(sel => clone.querySelectorAll(sel).forEach(el => el.remove())); return clone.innerText.substring(0, 500); };
        btn.onclick = () => {
            isActive = !isActive;
            if (isActive) {
                textEl.textContent = WIA_BRAILLE.convert(getPageText());
                box.classList.remove('hidden');
                btnText.textContent = t('brailleBtnOff');
                btn.classList.remove('wia-btn-purple');
                btn.classList.add('wia-btn-gray');
                modal.classList.add('wide');
            } else {
                box.classList.add('hidden');
                btnText.textContent = t('brailleBtn');
                btn.classList.remove('wia-btn-gray');
                btn.classList.add('wia-btn-purple');
                modal.classList.remove('wide');
            }
        };
    }

    function initModal() {
        const fab = document.getElementById('wia-a11y-fab');
        const modal = document.getElementById('wia-a11y-modal');
        const overlay = document.getElementById('wia-a11y-overlay');
        const closeBtn = modal.querySelector('.wia-close');
        const open = () => { overlay.classList.add('show'); modal.classList.add('show'); closeBtn.focus(); };
        const close = () => { overlay.classList.remove('show'); modal.classList.remove('show'); modal.classList.remove('wide'); fab.focus(); };
        fab.onclick = () => modal.classList.contains('show') ? close() : open();
        fab.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fab.click(); } };
        closeBtn.onclick = close;
        overlay.onclick = close;
        document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('show')) close(); });
    }

    function watchLanguageChange() {
        let currentLang = getLang();
        setInterval(() => { const newLang = getLang(); if (newLang !== currentLang) { currentLang = newLang; updateLanguage(); } }, 500);
    }

    function init() {
        if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); return; }
        console.log('%c⚙️ WIA Reading Settings v2.0.0 💜', 'color: #A855F7; font-size: 16px; font-weight: bold;');
        console.log('%c📖 弘益人間 - 널리 인간을 이롭게', 'color: #7C3AED; font-weight: bold;');
        injectStyles();
        injectHTML();
        initModal();
        initContrast();
        initFontSize();
        initTTS();
        initBraille();
        watchLanguageChange();
    }

    init();
})();
