/**
 * FAB Toolkit - 우측 상단 플로팅 버튼 세트
 * 포함: 프로그레스 바, Trip Navigator, 다크모드 토글
 * 
 * @version 1.0.0
 * @author SmileStory Inc.
 * 
 * 사용법:
 * <script>
 *   window.FAB_TOOLKIT_CONFIG = {
 *     progress: true,           // 프로그레스 바 표시
 *     progressTotal: 1053,      // 총 아이템 수
 *     progressLabel: '용어',    // 라벨
 *     trip: true,               // Trip Navigator 표시
 *     darkMode: true,           // 다크모드 토글 표시
 *     positions: {              // 위치 커스터마이징 (선택)
 *       progress: { top: '100px', right: '20px' },
 *       trip: { top: '145px', right: '20px' },
 *       darkToggle: { top: '250px', right: '20px' }
 *     }
 *   };
 * </script>
 * <link rel="stylesheet" href="/components/fab-toolkit/fab-toolkit.css">
 * <script src="/components/fab-toolkit/fab-toolkit.js"></script>
 */

(function() {
    'use strict';
    
    // 기본 설정
    var config = window.FAB_TOOLKIT_CONFIG || {};
    var defaults = {
        progress: true,
        progressTotal: 100,
        progressLabel: '항목',
        trip: true,
        darkMode: true,
        positions: {}
    };
    
    // 설정 병합
    config = Object.assign({}, defaults, config);
    
    // DOM 준비 후 실행
    function init() {
        if (config.progress) createProgressBar();
        if (config.trip) createTripNav();
        if (config.darkMode) createDarkToggle();
    }
    
    // 프로그레스 바 생성
    function createProgressBar() {
        var html = '<div class="fab-progress-bar" id="fabProgressBar">' +
            '<span class="percent" id="fabPercent">0%</span> · ' +
            '<span class="count" id="fabCount">0/' + config.progressTotal.toLocaleString() + '</span> ' + 
            config.progressLabel +
            '</div>';
        
        document.body.insertAdjacentHTML('afterbegin', html);
        
        // 위치 커스터마이징
        if (config.positions.progress) {
            var el = document.getElementById('fabProgressBar');
            if (config.positions.progress.top) el.style.top = config.positions.progress.top;
            if (config.positions.progress.right) el.style.right = config.positions.progress.right;
        }
        
        // 스크롤 이벤트
        window.addEventListener('scroll', updateProgress);
        updateProgress();
    }
    
    function updateProgress() {
        var scrollTop = window.scrollY;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var percent = Math.round((scrollTop / docHeight) * 100) || 0;
        var count = Math.round((percent / 100) * config.progressTotal);
        
        var pctEl = document.getElementById('fabPercent');
        var cntEl = document.getElementById('fabCount');
        
        if (pctEl) pctEl.textContent = percent + '%';
        if (cntEl) cntEl.textContent = count.toLocaleString() + '/' + config.progressTotal.toLocaleString();
    }
    
    // Trip Navigator 생성
    function createTripNav() {
        var html = '<div class="fab-trip-nav" id="fabTripNav">' +
            '<button class="trip-up" title="맨 위로">⬆️</button>' +
            '<button class="trip-label" id="fabTripLabel">Trip</button>' +
            '<button class="trip-down" title="맨 아래로">⬇️</button>' +
            '</div>';
        
        document.body.insertAdjacentHTML('afterbegin', html);
        
        // 위치 커스터마이징
        if (config.positions.trip) {
            var el = document.getElementById('fabTripNav');
            if (config.positions.trip.top) el.style.top = config.positions.trip.top;
            if (config.positions.trip.right) el.style.right = config.positions.trip.right;
        }
        
        // 이벤트 연결
        var tripUp = document.querySelector('.fab-trip-nav .trip-up');
        var tripDown = document.querySelector('.fab-trip-nav .trip-down');
        var tripLabel = document.getElementById('fabTripLabel');
        var autoScroll = null;
        var scrollDir = 1;
        
        if (tripUp) {
            tripUp.addEventListener('click', function() {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
        
        if (tripDown) {
            tripDown.addEventListener('click', function() {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            });
        }
        
        if (tripLabel) {
            tripLabel.addEventListener('click', function() {
                if (autoScroll) {
                    clearInterval(autoScroll);
                    autoScroll = null;
                    tripLabel.textContent = 'Trip';
                    tripLabel.style.background = '';
                } else {
                    autoScroll = setInterval(function() {
                        window.scrollBy(0, scrollDir * 2);
                        if (window.scrollY <= 0) scrollDir = 1;
                        if (window.scrollY >= document.body.scrollHeight - window.innerHeight) scrollDir = -1;
                    }, 30);
                    tripLabel.textContent = 'Stop';
                    tripLabel.style.background = 'linear-gradient(135deg, #DC143C, #FF4500)';
                }
            });
        }
    }
    
    // 다크모드 토글 생성
    function createDarkToggle() {
        var isDark = localStorage.getItem('fab-dark-mode') === 'true';
        var icon = isDark ? '☀️' : '🌙';
        
        if (isDark) document.body.classList.add('light-mode');
        
        var html = '<button class="fab-dark-toggle" id="fabDarkToggle" title="다크/라이트 모드 전환">' + icon + '</button>';
        
        document.body.insertAdjacentHTML('afterbegin', html);
        
        // 위치 커스터마이징
        if (config.positions.darkToggle) {
            var el = document.getElementById('fabDarkToggle');
            if (config.positions.darkToggle.top) el.style.top = config.positions.darkToggle.top;
            if (config.positions.darkToggle.right) el.style.right = config.positions.darkToggle.right;
        }
        
        // 이벤트 연결
        var toggle = document.getElementById('fabDarkToggle');
        if (toggle) {
            toggle.addEventListener('click', function() {
                document.body.classList.toggle('light-mode');
                var isLight = document.body.classList.contains('light-mode');
                toggle.textContent = isLight ? '☀️' : '🌙';
                localStorage.setItem('fab-dark-mode', isLight);
            });
        }
    }
    
    // DOM 준비 확인
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // 전역 API 노출
    window.FABToolkit = {
        updateProgress: updateProgress,
        setTotal: function(total) {
            config.progressTotal = total;
            updateProgress();
        }
    };
})();
