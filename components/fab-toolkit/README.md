# 🎛️ FAB Toolkit - 우측 플로팅 버튼 세트

## 구성 요소

```
우측 상단 배치:
┌──────────────────┐
│  [🌐 언어모달]   │  ← 별도 컴포넌트
│                  │
│ 0% · 0/1,053 용어│  ← 프로그레스 바
│                  │
│      ⬆️         │
│     Trip        │  ← Trip Navigator
│      ⬇️         │
│                  │
│      🌙         │  ← 다크모드 토글
└──────────────────┘
```

---

## 📦 파일

| 파일 | 설명 |
|------|------|
| `fab-toolkit.css` | 스타일시트 |
| `fab-toolkit.js` | JavaScript (HTML 자동 생성) |

---

## 🚀 사용법

### 기본 사용 (전체 기능)

```html
<!-- CSS -->
<link rel="stylesheet" href="/components/fab-toolkit/fab-toolkit.css">

<!-- 설정 (선택) -->
<script>
window.FAB_TOOLKIT_CONFIG = {
    progress: true,
    progressTotal: 1053,
    progressLabel: '용어',
    trip: true,
    darkMode: true
};
</script>

<!-- JS -->
<script src="/components/fab-toolkit/fab-toolkit.js"></script>
```

### 프로그레스 바만 사용

```html
<script>
window.FAB_TOOLKIT_CONFIG = {
    progress: true,
    progressTotal: 500,
    progressLabel: '기사',
    trip: false,
    darkMode: false
};
</script>
```

### Trip Navigator만 사용

```html
<script>
window.FAB_TOOLKIT_CONFIG = {
    progress: false,
    trip: true,
    darkMode: false
};
</script>
```

### 위치 커스터마이징

```html
<script>
window.FAB_TOOLKIT_CONFIG = {
    progress: true,
    progressTotal: 100,
    trip: true,
    darkMode: true,
    positions: {
        progress: { top: '80px', right: '15px' },
        trip: { top: '130px', right: '15px' },
        darkToggle: { top: '240px', right: '15px' }
    }
};
</script>
```

---

## ⚙️ 설정 옵션

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `progress` | boolean | `true` | 프로그레스 바 표시 |
| `progressTotal` | number | `100` | 총 아이템 수 |
| `progressLabel` | string | `'항목'` | 라벨 텍스트 |
| `trip` | boolean | `true` | Trip Navigator 표시 |
| `darkMode` | boolean | `true` | 다크모드 토글 표시 |
| `positions` | object | `{}` | 위치 커스터마이징 |

---

## 🎯 기능 설명

### 1️⃣ 프로그레스 바
- 스크롤 위치에 따라 % 업데이트
- 현재 아이템 수 / 전체 아이템 수 표시
- 라이트/다크 모드 자동 대응

### 2️⃣ Trip Navigator
| 버튼 | 기능 |
|------|------|
| ⬆️ | 맨 위로 스크롤 |
| Trip | 자동 스크롤 시작/정지 |
| ⬇️ | 맨 아래로 스크롤 |

- `Trip` 클릭 → 천천히 자동 스크롤
- 끝에 도달하면 방향 자동 전환
- `Stop` 클릭 → 정지

### 3️⃣ 다크모드 토글
- 🌙 클릭 → 라이트 모드
- ☀️ 클릭 → 다크 모드
- localStorage에 상태 저장

---

## 🎨 커스터마이징

### CSS 오버라이드

```css
/* 프로그레스 바 색상 변경 */
.fab-progress-bar {
    background: #your-color !important;
}

/* Trip 버튼 색상 변경 */
.fab-trip-nav button {
    background: linear-gradient(135deg, #your-color1, #your-color2) !important;
}
```

### JavaScript API

```javascript
// 프로그레스 바 업데이트
FABToolkit.updateProgress();

// 총 아이템 수 변경
FABToolkit.setTotal(2000);
```

---

## 📱 반응형

- **768px 이하**: 모바일 최적화 크기/위치
- 자동으로 크기 축소 및 위치 조정

---

## 🔗 CDN 경로

```
https://glossary.kaitrust.ai/components/fab-toolkit/fab-toolkit.css
https://glossary.kaitrust.ai/components/fab-toolkit/fab-toolkit.js
```

---

## 📜 라이선스

© 2026 SmileStory Inc. All rights reserved.
