/**
 * KAITRUST 인증 시스템
 * - 쿠키 기반 로그인 상태 관리
 * - 헤더 UI 동적 업데이트
 */

(function() {
    'use strict';

    // 쿠키 읽기
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            try {
                return JSON.parse(decodeURIComponent(parts.pop().split(';').shift()));
            } catch (e) {
                return null;
            }
        }
        return null;
    }

    // 쿠키 삭제 (.kaitrust.ai 도메인)
    function deleteCookie(name) {
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.kaitrust.ai';
    }

    // 로그아웃
    function logout() {
        deleteCookie('kaitrust_user');
        window.location.href = 'https://kaitrust.ai/';
    }

    // 헤더 UI 업데이트
    function updateHeaderUI() {
        const user = getCookie('kaitrust_user');
        const loginBtn = document.querySelector('.nav-login');
        
        if (!loginBtn) return;
        
        if (user && user.nickname) {
            // 로그인 상태 - 사용자 메뉴로 변경
            const userMenuHTML = `
                <div class="user-menu">
                    <button class="user-menu-trigger">
                        <img src="${user.profile_image || 'https://via.placeholder.com/32?text=' + user.nickname.charAt(0)}" 
                             alt="프로필" class="user-avatar">
                        <span class="user-name">${user.nickname}</span>
                        <span class="dropdown-arrow">▼</span>
                    </button>
                    <div class="user-dropdown">
                        <a href="/dashboard/"><i class="fas fa-tachometer-alt"></i> 마이페이지</a>
                        <a href="#" onclick="window.katrustAuth.logout(); return false;"><i class="fas fa-sign-out-alt"></i> 로그아웃</a>
                    </div>
                </div>
            `;
            
            // 기존 로그인 버튼을 사용자 메뉴로 교체
            const wrapper = document.createElement('div');
            wrapper.innerHTML = userMenuHTML;
            loginBtn.parentNode.replaceChild(wrapper.firstElementChild, loginBtn);
            
            // 드롭다운 토글
            const trigger = document.querySelector('.user-menu-trigger');
            const dropdown = document.querySelector('.user-dropdown');
            
            if (trigger && dropdown) {
                trigger.addEventListener('click', function(e) {
                    e.stopPropagation();
                    dropdown.classList.toggle('show');
                });
                
                document.addEventListener('click', function() {
                    dropdown.classList.remove('show');
                });
            }
        }
    }

    // CSS 스타일 추가
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .user-menu {
                position: relative;
                display: inline-flex;
                align-items: center;
            }
            .user-menu-trigger {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.4rem 0.8rem;
                background: linear-gradient(135deg, #22c55e, #16a34a);
                border: none;
                border-radius: 20px;
                color: white;
                cursor: pointer;
                font-size: 0.85rem;
                font-weight: 500;
                transition: all 0.2s;
            }
            .user-menu-trigger:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
            }
            .user-avatar {
                width: 28px;
                height: 28px;
                border-radius: 50%;
                border: 2px solid rgba(255,255,255,0.3);
            }
            .user-name {
                max-width: 80px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .user-menu .dropdown-arrow {
                font-size: 0.7rem;
                transition: transform 0.2s;
            }
            .user-dropdown {
                position: absolute;
                top: 100%;
                right: 0;
                margin-top: 0.5rem;
                background: #1a2f4e;
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 8px;
                min-width: 160px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.2s;
                z-index: 1000;
            }
            .user-dropdown.show {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            .user-dropdown a {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem 1rem;
                color: #e2e8f0;
                text-decoration: none;
                font-size: 0.9rem;
                transition: background 0.2s;
            }
            .user-dropdown a:first-child {
                border-radius: 8px 8px 0 0;
            }
            .user-dropdown a:last-child {
                border-radius: 0 0 8px 8px;
            }
            .user-dropdown a:hover {
                background: rgba(255,255,255,0.1);
            }
            .user-dropdown a i {
                width: 16px;
                text-align: center;
                color: #94a3b8;
            }
            
            /* 모바일 */
            @media (max-width: 768px) {
                .user-name {
                    display: none;
                }
                .user-menu-trigger {
                    padding: 0.3rem;
                }
                .user-avatar {
                    width: 32px;
                    height: 32px;
                }
                .user-menu .dropdown-arrow {
                    display: none;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // 초기화
    function init() {
        addStyles();
        
        // DOM 로드 후 실행
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', updateHeaderUI);
        } else {
            updateHeaderUI();
        }
    }

    // 전역 객체로 노출 (로그아웃 함수 접근용)
    window.katrustAuth = {
        logout: logout,
        getUser: function() { return getCookie('kaitrust_user'); }
    };

    init();
})();
