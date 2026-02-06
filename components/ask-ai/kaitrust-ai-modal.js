/**
 * KAITRUST AI 어시스턴트
 * WIA Books 스타일 완전 적용
 * @version 3.3.0
 * @updated 2026-01-24
 * 
 * 변경사항:
 * - AI 도구: 실제 AI 기능 (요약/번역/질문/키워드/설명/대화)
 * - 2.5초 후 섹션 자동 접힘
 * - WIA Books 스타일 완전 적용
 */

class KaiTrustAI {
    constructor() {
        this.currentAI = 'gemini';
        this.apiKeys = {
            gemini: localStorage.getItem('kaitrust_gemini_key') || '',
            claude: localStorage.getItem('kaitrust_claude_key') || '',
            chatgpt: localStorage.getItem('kaitrust_chatgpt_key') || ''
        };
        this.isFullscreen = false;
    }

    async init() {
        this.applyTheme();
        this.createThemeToggle();
        this.createFAB();
        this.createModal();
        this.bindEvents();
        console.log('✅ KAITRUST AI 어시스턴트 v3.3 초기화 완료');
    }

    applyTheme() {
        const isDark = localStorage.getItem('kaitrust_theme') !== 'light';
        if (!isDark) {
            document.body.classList.add('light-mode');
        }
    }

    createThemeToggle() {
        const toggle = document.createElement('button');
        toggle.className = 'kt-theme-toggle';
        toggle.id = 'ktThemeToggle';
        toggle.title = '다크모드 전환';
        toggle.innerHTML = `
            <span class="icon-moon">🌙</span>
            <span class="icon-sun">☀️</span>
        `;
        // document.body.appendChild(toggle); // 다크모드 버튼 설정 모달로 이동
    }

    toggleTheme() {
        const isLight = document.body.classList.contains('light-mode');
        
        if (isLight) {
            document.body.classList.remove('light-mode');
            localStorage.setItem('kaitrust_theme', 'dark');
        } else {
            document.body.classList.add('light-mode');
            localStorage.setItem('kaitrust_theme', 'light');
        }
    }

    createFAB() {
        const fab = document.createElement('button');
        fab.className = 'kt-ai-fab';
        fab.id = 'ktAiFab';
        fab.title = 'AI 어시스턴트';
        fab.innerHTML = '<span class="fab-icon spinning">✨</span>';
        document.body.appendChild(fab);
    }

    createModal() {
        const overlay = document.createElement('div');
        overlay.className = 'kt-ai-overlay';
        overlay.id = 'ktAiOverlay';
        overlay.onclick = (e) => { if (e.target === overlay) this.close(); };

        const modal = document.createElement('div');
        modal.className = 'kt-ai-modal';
        modal.id = 'ktAiModal';
        modal.innerHTML = `
            <div class="kt-resize-handle left"></div>
            <div class="kt-resize-handle right"></div>
            <div class="kt-ai-header">
                <div class="kt-modal-title">
                    <span class="kt-modal-logo">🤖</span>
                    <span>KAITRUST AI - Benefit All Humanity!</span>
                </div>
                <div class="kt-header-buttons">
                    <button class="kt-fullscreen-btn" id="ktFullscreenBtn" title="전체화면">⛶</button>
                    <button class="kt-ai-close" onclick="ktAI.close()" title="닫기">×</button>
                </div>
            </div>
            <div class="kt-ai-tabs">
                <button class="kt-ai-tab active" data-ai="gemini" onclick="ktAI.switchAI('gemini')">
                    💎 Gemini <span class="tab-badge">Free</span>
                </button>
                <button class="kt-ai-tab" data-ai="claude" onclick="ktAI.switchAI('claude')">
                    🧠 Claude
                </button>
                <button class="kt-ai-tab" data-ai="chatgpt" onclick="ktAI.switchAI('chatgpt')">
                    🤖 ChatGPT
                </button>
            </div>
            <div class="kt-api-section">
                <input type="password" id="ktApiKey" class="kt-api-input" placeholder="Gemini API 키 입력...">
                <button class="kt-api-save" onclick="ktAI.saveApiKey()">저장</button>
                <a href="https://aistudio.google.com/app/apikey" target="_blank" class="kt-api-link">🔑 무료 Gemini API 키 받기 →</a>
            </div>
            <div class="kt-collapsible" id="ktToolsSection">
                <div class="kt-section-title" onclick="ktAI.toggleSection('ktToolsSection')">
                    ✨ AI 도구 <span class="kt-toggle-icon">▼</span>
                </div>
                <div class="kt-section-content">
                    <div class="kt-tools-grid">
                        <button class="kt-tool-btn" onclick="ktAI.useTool('summarize')">
                            <span class="icon">📋</span><span class="label">요약</span>
                        </button>
                        <button class="kt-tool-btn" onclick="ktAI.useTool('translate')">
                            <span class="icon">🌐</span><span class="label">번역</span>
                        </button>
                        <button class="kt-tool-btn" onclick="ktAI.useTool('question')">
                            <span class="icon">❓</span><span class="label">질문</span>
                        </button>
                        <button class="kt-tool-btn" onclick="ktAI.useTool('keywords')">
                            <span class="icon">📰</span><span class="label">키워드</span>
                        </button>
                        <button class="kt-tool-btn" onclick="ktAI.useTool('explain')">
                            <span class="icon">📝</span><span class="label">설명</span>
                        </button>
                        <button class="kt-tool-btn" onclick="ktAI.useTool('chat')">
                            <span class="icon">💬</span><span class="label">대화</span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="kt-collapsible" id="ktServicesSection">
                <div class="kt-section-title kt-services" onclick="ktAI.toggleSection('ktServicesSection')">
                    🏛️ KAITRUST 서비스 <span class="kt-toggle-icon">▼</span>
                </div>
                <div class="kt-section-content">
                    <div class="kt-tools-grid">
                        <a href="https://law.kaitrust.ai" target="_blank" class="kt-service-btn">
                            <span class="icon">📜</span><span class="label">AI기본법 포털</span>
                        </a>
                        <a href="https://ethics.kaitrust.ai" target="_blank" class="kt-service-btn">
                            <span class="icon">📋</span><span class="label">윤리가이드</span>
                        </a>
                        <a href="https://check.kaitrust.ai" target="_blank" class="kt-service-btn">
                            <span class="icon">✅</span><span class="label">자가점검</span>
                        </a>
                        <a href="https://edu.kaitrust.ai" target="_blank" class="kt-service-btn">
                            <span class="icon">🎓</span><span class="label">교육센터</span>
                        </a>
                        <a href="https://cert.kaitrust.ai" target="_blank" class="kt-service-btn">
                            <span class="icon">🏆</span><span class="label">인증센터</span>
                        </a>
                        <a href="https://consult.kaitrust.ai" target="_blank" class="kt-service-btn">
                            <span class="icon">💼</span><span class="label">컨설팅</span>
                        </a>
                    </div>
                </div>
            </div>
            <div class="kt-chat-container">
                <div class="kt-chat-welcome">
                    <div class="kt-welcome-icon">🤖</div>
                    <h3>무엇이든 물어보세요!</h3>
                    <p>AI기본법, 윤리가이드, 교육/인증 등 다양한 도움을 드립니다.</p>
                </div>
                <div id="ktChatMessages" class="kt-chat-messages"></div>
            </div>
            <div class="kt-input-container">
                <input type="text" id="ktChatInput" placeholder="메시지를 입력하세요..." 
                       onkeypress="if(event.key==='Enter') ktAI.sendMessage()">
                <button class="kt-send-btn" onclick="ktAI.sendMessage()">➤</button>
            </div>
        `;
        
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

    bindEvents() {
        const fabBtn = document.getElementById('ktAiFab'); if(fabBtn) fabBtn.onclick = () => this.open();
        const themeBtn = document.getElementById('ktThemeToggle'); if(themeBtn) themeBtn.onclick = () => this.toggleTheme();
        const fullscreenBtn = document.getElementById('ktFullscreenBtn'); if(fullscreenBtn) fullscreenBtn.onclick = () => this.toggleFullscreen();
        
        this.initDrag();
        this.initResize();
    }

    // 섹션 토글
    toggleSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.toggle('collapsed');
            const icon = section.querySelector('.kt-toggle-icon');
            if (icon) {
                icon.textContent = section.classList.contains('collapsed') ? '▶' : '▼';
            }
        }
    }

    // 모든 섹션 접기
    collapseAllSections() {
        document.querySelectorAll('.kt-collapsible').forEach(section => {
            section.classList.add('collapsed');
            const icon = section.querySelector('.kt-toggle-icon');
            if (icon) icon.textContent = '▶';
        });
    }

    // 모든 섹션 펼치기
    expandAllSections() {
        document.querySelectorAll('.kt-collapsible').forEach(section => {
            section.classList.remove('collapsed');
            const icon = section.querySelector('.kt-toggle-icon');
            if (icon) icon.textContent = '▼';
        });
    }

    toggleFullscreen() {
        const modal = document.getElementById('ktAiModal');
        const btn = document.getElementById('ktFullscreenBtn');
        
        this.isFullscreen = !this.isFullscreen;
        
        if (this.isFullscreen) {
            modal.classList.add('fullscreen');
            btn.innerHTML = '⛶';
            btn.title = '창 모드';
        } else {
            modal.classList.remove('fullscreen');
            modal.style.position = '';
            modal.style.left = '';
            modal.style.top = '';
            modal.style.width = '';
            modal.style.transform = '';
            btn.innerHTML = '⛶';
            btn.title = '전체화면';
        }
    }

    initDrag() {
        const modal = document.getElementById('ktAiModal');
        const header = modal.querySelector('.kt-ai-header');
        
        let isDragging = false;
        let startX, startY, initialX, initialY;
        
        const isMobile = () => window.innerWidth <= 768;
        
        header.addEventListener('mousedown', (e) => {
            if (isMobile() || this.isFullscreen) return;
            if (e.target.closest('.kt-fullscreen-btn') || e.target.closest('.kt-ai-close')) return;
            
            isDragging = true;
            modal.classList.add('dragging');
            header.style.cursor = 'grabbing';
            
            const rect = modal.getBoundingClientRect();
            startX = e.clientX;
            startY = e.clientY;
            initialX = rect.left + rect.width / 2;
            initialY = rect.top + rect.height / 2;
            
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            
            let newCenterX = initialX + dx;
            let newCenterY = initialY + dy;
            
            const halfWidth = modal.offsetWidth / 2;
            const halfHeight = modal.offsetHeight / 2;
            
            newCenterX = Math.max(halfWidth, Math.min(newCenterX, window.innerWidth - halfWidth));
            newCenterY = Math.max(halfHeight, Math.min(newCenterY, window.innerHeight - halfHeight));
            
            modal.style.position = 'fixed';
            modal.style.left = '50%';
            modal.style.top = '50%';
            modal.style.transform = `translate(calc(-50% + ${newCenterX - window.innerWidth/2}px), calc(-50% + ${newCenterY - window.innerHeight/2}px))`;
        });
        
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                modal.classList.remove('dragging');
                header.style.cursor = 'grab';
            }
        });
    }

    initResize() {
        const modal = document.getElementById('ktAiModal');
        const leftHandle = modal.querySelector('.kt-resize-handle.left');
        const rightHandle = modal.querySelector('.kt-resize-handle.right');
        
        let isResizing = false;
        let startX, startWidth;
        let resizeDir = null;
        
        const isMobile = () => window.innerWidth <= 768;
        
        const startResize = (e, dir) => {
            if (isMobile() || this.isFullscreen) return;
            
            isResizing = true;
            resizeDir = dir;
            startX = e.clientX;
            startWidth = modal.offsetWidth;
            
            modal.classList.add('dragging');
            document.body.style.cursor = 'ew-resize';
            e.preventDefault();
        };
        
        leftHandle.addEventListener('mousedown', (e) => startResize(e, 'left'));
        rightHandle.addEventListener('mousedown', (e) => startResize(e, 'right'));
        
        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            
            const dx = e.clientX - startX;
            let newWidth;
            
            if (resizeDir === 'right') {
                newWidth = startWidth + dx * 2;
            } else {
                newWidth = startWidth - dx * 2;
            }
            
            newWidth = Math.max(400, Math.min(newWidth, window.innerWidth * 0.95));
            modal.style.width = newWidth + 'px';
        });
        
        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                resizeDir = null;
                modal.classList.remove('dragging');
                document.body.style.cursor = '';
            }
        });
    }

    open() {
        document.getElementById('ktAiOverlay').classList.add('show');
        // 열릴 때 섹션 펼치기
        this.expandAllSections();
        // 2.5초 후 자동 접기
        setTimeout(() => {
            this.collapseAllSections();
        }, 2500);
    }

    close() {
        document.getElementById('ktAiOverlay').classList.remove('show');
        if (this.isFullscreen) this.toggleFullscreen();
    }

    toggleModal() {
        const overlay = document.getElementById('ktAiOverlay');
        if (overlay.classList.contains('show')) {
            this.close();
        } else {
            this.open();
        }
    }

    switchAI(ai) {
        this.currentAI = ai;
        document.querySelectorAll('.kt-ai-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.ai === ai);
        });
        
        const input = document.getElementById('ktApiKey');
        const links = {
            gemini: 'https://aistudio.google.com/app/apikey',
            claude: 'https://console.anthropic.com/',
            chatgpt: 'https://platform.openai.com/api-keys'
        };
        
        input.placeholder = `${ai.charAt(0).toUpperCase() + ai.slice(1)} API 키 입력...`;
        input.value = this.apiKeys[ai] || '';
        
        const link = document.querySelector('.kt-api-link');
        link.href = links[ai];
        link.textContent = `🔑 무료 ${ai.charAt(0).toUpperCase() + ai.slice(1)} API 키 받기 →`;
    }

    saveApiKey() {
        const key = document.getElementById('ktApiKey').value.trim();
        if (key) {
            this.apiKeys[this.currentAI] = key;
            localStorage.setItem(`kaitrust_${this.currentAI}_key`, key);
            alert(`${this.currentAI.toUpperCase()} API 키가 저장되었습니다! 🎉`);
        }
    }

    // 페이지 텍스트 가져오기
    getPageText() {
        const clone = document.body.cloneNode(true);
        ['#ktAiOverlay', '.kt-ai-fab', '.kt-theme-toggle', 'script', 'style', 'nav', 'header', 'footer'].forEach(sel => {
            clone.querySelectorAll(sel).forEach(el => el.remove());
        });
        return clone.innerText.substring(0, 3000);
    }

    // AI 도구 사용 (실제 AI 기능)
    useTool(tool) {
        const pageText = this.getPageText();
        const prompts = {
            summarize: `다음 웹페이지 내용을 한국어로 3-5문장으로 요약해주세요:\n\n${pageText}`,
            translate: `다음 내용을 영어로 번역해주세요:\n\n${pageText.substring(0, 1500)}`,
            question: '이 페이지에 대해 무엇이든 물어보세요!',
            keywords: `다음 내용에서 핵심 키워드 10개를 추출하고 각각 간단히 설명해주세요:\n\n${pageText}`,
            explain: 'AI기본법, 윤리가이드, 인증제도 등에 대해 설명해드릴게요. 궁금한 것을 물어보세요!',
            chat: '자유롭게 대화해요! 무엇이든 물어보세요.'
        };
        
        const input = document.getElementById('ktChatInput');
        
        if (tool === 'question' || tool === 'explain' || tool === 'chat') {
            // 안내 메시지만 표시
            input.placeholder = prompts[tool];
            input.focus();
        } else {
            // 자동 실행
            input.value = prompts[tool];
            this.sendMessage();
        }
    }

    async sendMessage() {
        const input = document.getElementById('ktChatInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        this.addMessage(message.length > 100 ? message.substring(0, 100) + '...' : message, 'user');
        input.value = '';
        input.placeholder = '메시지를 입력하세요...';
        
        const welcome = document.querySelector('.kt-chat-welcome');
        if (welcome) welcome.style.display = 'none';
        
        const apiKey = this.apiKeys[this.currentAI];
        if (!apiKey) {
            this.addMessage(`${this.currentAI.toUpperCase()} API 키를 먼저 입력해주세요. 🔑`, 'ai');
            return;
        }
        
        this.addMessage('생각하는 중...', 'ai', true);
        
        try {
            const response = await this.callAI(message, apiKey);
            const loadingMsg = document.querySelector('.kt-message.loading');
            if (loadingMsg) loadingMsg.remove();
            this.addMessage(response, 'ai');
        } catch (error) {
            const loadingMsg = document.querySelector('.kt-message.loading');
            if (loadingMsg) loadingMsg.remove();
            this.addMessage(`오류가 발생했습니다: ${error.message}`, 'ai');
        }
    }

    addMessage(text, type, isLoading = false) {
        const container = document.getElementById('ktChatMessages');
        const msg = document.createElement('div');
        msg.className = `kt-message ${type}${isLoading ? ' loading' : ''}`;
        msg.textContent = text;
        container.appendChild(msg);
        container.scrollTop = container.scrollHeight;
    }

    async callAI(message, apiKey) {
        if (this.currentAI === 'gemini') {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `당신은 한국인공지능진흥협회(KAITRUST)의 AI 어시스턴트입니다. AI기본법, 윤리가이드, 교육/인증에 대해 전문적으로 안내합니다. 친절하고 정확하게 답변해주세요.\n\n${message}` }] }]
                })
            });
            const data = await response.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text || '응답을 받지 못했습니다.';
        }
        return '해당 AI 서비스는 아직 준비 중입니다.';
    }
}

// 전역 인스턴스
window.ktAI = new KaiTrustAI();
document.addEventListener("DOMContentLoaded", function() { ktAI.init(); });
