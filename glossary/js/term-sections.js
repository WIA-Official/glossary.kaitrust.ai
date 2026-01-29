/**
 * KAITRUST AI 백과사전 - 용어 상세 섹션 인터랙션
 * @version 2.0.0
 * @description 코드 복사, 대화 탭 전환, 접근성 지원
 */

(function() {
    'use strict';

    // ===== 코드 복사 기능 =====
    window.copyCode = function(btn) {
        const codeBlock = btn.closest('.code-block');
        // code 태그가 없으면 pre 태그에서 텍스트 가져오기
        const codeElement = codeBlock.querySelector('code') || codeBlock.querySelector('pre');
        if (!codeElement) {
            console.error('복사할 코드 요소를 찾을 수 없습니다.');
            return;
        }
        const code = codeElement.textContent;

        navigator.clipboard.writeText(code).then(() => {
            // 성공 피드백
            const originalText = btn.textContent;
            const originalClass = btn.className;

            btn.textContent = '✓ 복사됨';
            btn.classList.add('copied');

            // 접근성: 스크린 리더 알림
            announceToScreenReader('코드가 클립보드에 복사되었습니다');

            setTimeout(() => {
                btn.textContent = originalText;
                btn.className = originalClass;
            }, 2000);
        }).catch(err => {
            console.error('복사 실패:', err);
            btn.textContent = '✗ 실패';
            setTimeout(() => {
                btn.textContent = '복사';
            }, 2000);
        });
    };

    // ===== 대화 탭 전환 =====
    window.showConv = function(btn, id) {
        const container = btn.closest('.term-section');

        // 모든 탭 비활성화
        container.querySelectorAll('.conv-tab').forEach(tab => {
            tab.classList.remove('active');
            tab.setAttribute('aria-selected', 'false');
        });

        // 모든 콘텐츠 숨김
        container.querySelectorAll('.conv-content').forEach(content => {
            content.classList.remove('active');
            content.setAttribute('aria-hidden', 'true');
        });

        // 선택된 탭 활성화
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        // 선택된 콘텐츠 표시
        const targetContent = document.getElementById(id);
        if (targetContent) {
            targetContent.classList.add('active');
            targetContent.setAttribute('aria-hidden', 'false');

            // 접근성: 포커스 이동
            targetContent.focus();
        }
    };

    // ===== 키보드 네비게이션 =====
    function initKeyboardNav() {
        document.querySelectorAll('.conv-tabs').forEach(tabContainer => {
            const tabs = tabContainer.querySelectorAll('.conv-tab');

            tabs.forEach((tab, index) => {
                tab.addEventListener('keydown', (e) => {
                    let targetIndex;

                    switch(e.key) {
                        case 'ArrowLeft':
                        case 'ArrowUp':
                            targetIndex = index > 0 ? index - 1 : tabs.length - 1;
                            break;
                        case 'ArrowRight':
                        case 'ArrowDown':
                            targetIndex = index < tabs.length - 1 ? index + 1 : 0;
                            break;
                        case 'Home':
                            targetIndex = 0;
                            break;
                        case 'End':
                            targetIndex = tabs.length - 1;
                            break;
                        default:
                            return;
                    }

                    e.preventDefault();
                    tabs[targetIndex].focus();
                    tabs[targetIndex].click();
                });
            });
        });
    }

    // ===== 스크린 리더 알림 =====
    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        announcement.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0;';

        document.body.appendChild(announcement);

        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    // ===== ARIA 속성 자동 설정 =====
    function initAccessibility() {
        // 탭 컨테이너에 role 설정
        document.querySelectorAll('.conv-tabs').forEach((tabList, groupIndex) => {
            tabList.setAttribute('role', 'tablist');

            const tabs = tabList.querySelectorAll('.conv-tab');
            const section = tabList.closest('.term-section');
            const contents = section.querySelectorAll('.conv-content');

            tabs.forEach((tab, index) => {
                const contentId = tab.getAttribute('onclick')?.match(/showConv\(this,\s*'([^']+)'\)/)?.[1];

                tab.setAttribute('role', 'tab');
                tab.setAttribute('tabindex', index === 0 ? '0' : '-1');
                tab.setAttribute('aria-selected', index === 0 ? 'true' : 'false');

                if (contentId) {
                    tab.setAttribute('aria-controls', contentId);
                }
            });

            contents.forEach((content, index) => {
                content.setAttribute('role', 'tabpanel');
                content.setAttribute('tabindex', '0');
                content.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
            });
        });

        // 코드 블록 접근성
        document.querySelectorAll('.code-block').forEach((block, index) => {
            const lang = block.getAttribute('data-lang') || 'code';
            block.setAttribute('aria-label', `${lang} 코드 예제`);
        });
    }

    // ===== 코드 하이라이팅 (선택적) =====
    function highlightSQL(code) {
        const keywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER',
                         'ON', 'AND', 'OR', 'NOT', 'IN', 'EXISTS', 'GROUP BY', 'ORDER BY',
                         'HAVING', 'LIMIT', 'OFFSET', 'INSERT', 'UPDATE', 'DELETE', 'CREATE',
                         'ALTER', 'DROP', 'INDEX', 'TABLE', 'VIEW', 'TRIGGER', 'PROCEDURE',
                         'FUNCTION', 'BEGIN', 'END', 'IF', 'THEN', 'ELSE', 'CASE', 'WHEN',
                         'AS', 'DISTINCT', 'COUNT', 'SUM', 'AVG', 'MAX', 'MIN', 'OVER',
                         'PARTITION BY', 'ROW_NUMBER', 'RANK', 'DENSE_RANK', 'LAG', 'LEAD',
                         'EXPLAIN', 'ANALYZE', 'WITH', 'RECURSIVE', 'UNION', 'INTERSECT', 'EXCEPT'];

        let highlighted = code;
        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            highlighted = highlighted.replace(regex, `<span class="sql-keyword">${keyword}</span>`);
        });

        return highlighted;
    }

    // ===== 퀴즈 채점 (Phase 1.5) =====
    window.checkQuiz = function() {
        const container = document.getElementById('term-quiz');
        if (!container) return;

        const items = container.querySelectorAll('.quiz-item');
        let score = 0;

        items.forEach((item, index) => {
            const correct = item.dataset.correct;
            const selected = item.querySelector(`input[name="q${index+1}"]:checked`);
            const feedback = item.querySelector('.quiz-feedback');

            if (selected && selected.value === correct) {
                score++;
                if (feedback) {
                    feedback.innerHTML = '<span class="correct">✅ 정답!</span>';
                }
            } else {
                if (feedback) {
                    feedback.innerHTML = `<span class="wrong">❌ 오답 (정답: ${correct.toUpperCase()})</span>`;
                }
            }
        });

        // 결과 표시
        const result = container.querySelector('.quiz-result');
        if (result) {
            const percentage = Math.round((score / items.length) * 100);
            let message = '';
            if (percentage === 100) {
                message = '🎉 완벽합니다!';
            } else if (percentage >= 70) {
                message = '👍 잘하셨습니다!';
            } else {
                message = '📚 다시 학습해보세요!';
            }
            result.innerHTML = `<strong>${score}/${items.length}</strong> (${percentage}%) ${message}`;
        }

        // localStorage에 결과 저장
        const termSlug = window.location.pathname.split('/').filter(Boolean).pop();
        const quizData = {
            score: score,
            total: items.length,
            percentage: Math.round((score / items.length) * 100),
            date: new Date().toISOString()
        };
        localStorage.setItem(`quiz_${termSlug}`, JSON.stringify(quizData));

        // 스크린 리더 알림
        announceToScreenReader(`퀴즈 결과: ${items.length}문제 중 ${score}문제 정답`);
    };

    // 이전 퀴즈 결과 불러오기
    function loadQuizResult() {
        const termSlug = window.location.pathname.split('/').filter(Boolean).pop();
        const saved = localStorage.getItem(`quiz_${termSlug}`);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                const result = document.querySelector('.quiz-result');
                if (result && data.date) {
                    const date = new Date(data.date).toLocaleDateString('ko-KR');
                    result.innerHTML = `<small>이전 기록 (${date}): ${data.score}/${data.total} (${data.percentage}%)</small>`;
                }
            } catch (e) {}
        }
    }

    // ===== 스크롤 애니메이션 =====
    function initScrollAnimation() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.term-section').forEach(section => {
            observer.observe(section);
        });
    }

    // ===== 초기화 =====
    function init() {
        initAccessibility();
        initKeyboardNav();
        initScrollAnimation();
        loadQuizResult();

        // CSS 애니메이션 클래스 추가
        const style = document.createElement('style');
        style.textContent = `
            .term-section {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.5s ease, transform 0.5s ease;
            }
            .term-section.visible {
                opacity: 1;
                transform: translateY(0);
            }
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                border: 0;
            }
        `;
        document.head.appendChild(style);
    }

    // DOM 로드 완료 시 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
