# KAITRUST Auth Kit - 구현 가이드

> **"Yandex급 이상의 인증 시스템을 당신의 프로젝트에"**
>
> 초딩도 이해할 수 있게, 그러나 깊이있게 설명합니다.

---

## 📦 목차

1. [빠른 시작](#-빠른-시작)
2. [Google OAuth](#1-google-oauth-20)
3. [Apple Sign In](#2-apple-sign-in)
4. [Microsoft Azure AD](#3-microsoft-azure-ad)
5. [Kakao 로그인](#4-kakao-로그인-한국)
6. [Naver 로그인](#5-naver-로그인-한국)
7. [LINE 로그인](#6-line-로그인-일본아시아)
8. [Passkey/FIDO2](#7-passkeyfido2-webauthn)
9. [OTP 2단계 인증](#8-otp-2단계-인증)
10. [Enterprise SSO](#9-enterprise-sso-samloidc)
11. [QR 코드 로그인](#10-qr-코드-로그인)
12. [보안 베스트 프랙티스](#-보안-베스트-프랙티스)

---

## 🚀 빠른 시작

### 1. 파일 복사

```bash
# 프로젝트에 복사
cp kaitrust-auth-kit.css /your-project/css/
cp kaitrust-auth-kit.js /your-project/js/
```

### 2. HTML에 추가

```html
<!-- CSS -->
<link rel="stylesheet" href="/css/kaitrust-auth-kit.css">
<!-- Font Awesome (아이콘용) -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<!-- 컨테이너 -->
<div id="auth-container"></div>

<!-- JS -->
<script src="/js/kaitrust-auth-kit.js"></script>
<script>
const auth = new KaiAuthKit({
    container: '#auth-container',
    socialProviders: ['google', 'apple', 'microsoft'], // 원하는 것만
    onLogin: (data) => {
        console.log('로그인:', data);
        // 서버로 전송
    },
    onSocialLogin: (provider) => {
        // OAuth 시작
        window.location.href = `/auth/${provider}`;
    }
});
</script>
```

### 3. 설정 옵션

```javascript
new KaiAuthKit({
    container: '#auth-container',     // 필수: 컨테이너
    theme: 'dark',                    // 'dark' | 'light'
    showQRTab: true,                  // QR 탭 표시
    showAdvanced: true,               // 고급 인증(Passkey, OTP, SSO)

    // 소셜 로그인 (순서대로 표시)
    socialProviders: [
        'google',     // 글로벌
        'apple',      // 글로벌
        'microsoft',  // 글로벌
        'kakao',      // 한국
        'naver',      // 한국
        'line',       // 일본/아시아
        'github',     // 개발자용
    ],

    // 텍스트 커스터마이징 (i18n)
    texts: {
        title: '보안 로그인',
        subtitle: '계정에 로그인하세요',
        loginButton: '로그인',
        // ... 기타
    }
});
```

---

## 1. Google OAuth 2.0

### 🎯 한 줄 요약
> 사용자가 "Google로 로그인" 버튼을 누르면 → Google에서 인증 → 우리 서버로 코드 전달 → 코드로 사용자 정보 획득

### 📝 작동 원리 (쉬운 설명)

```
[사용자] → "Google로 로그인" 클릭
    ↓
[Google] → "누구세요?" (로그인 화면)
    ↓
[사용자] → Google 계정으로 로그인
    ↓
[Google] → "이 앱에 정보 줘도 될까요?" (동의 화면)
    ↓
[사용자] → "OK"
    ↓
[Google] → 우리 서버로 "코드" 전달 (redirect)
    ↓
[우리 서버] → 코드로 Google에게 "토큰" 요청
    ↓
[Google] → 토큰 + 사용자 정보 제공
    ↓
[우리 서버] → 로그인 완료!
```

### 🔧 구현 방법

#### Step 1: Google Cloud Console 설정

1. https://console.cloud.google.com 접속
2. 프로젝트 생성 (또는 선택)
3. **API 및 서비스** → **사용자 인증 정보**
4. **+ 사용자 인증 정보 만들기** → **OAuth 클라이언트 ID**
5. 애플리케이션 유형: **웹 애플리케이션**
6. 승인된 리디렉션 URI 추가:
   - 개발: `http://localhost:3000/auth/google/callback`
   - 프로덕션: `https://yoursite.com/auth/google/callback`

**결과물:**
- Client ID: `123456789.apps.googleusercontent.com`
- Client Secret: `GOCSPX-xxxxxxxxxxxxx`

#### Step 2: 프론트엔드

```javascript
// Auth Kit 설정
new KaiAuthKit({
    onSocialLogin: (provider) => {
        if (provider === 'google') {
            // Google OAuth URL로 리다이렉트
            const params = new URLSearchParams({
                client_id: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
                redirect_uri: 'https://yoursite.com/auth/google/callback',
                response_type: 'code',
                scope: 'openid email profile',
                access_type: 'offline',  // refresh token 필요시
                prompt: 'consent'
            });
            window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
        }
    }
});
```

#### Step 3: 백엔드 (Node.js/Express 예시)

```javascript
const express = require('express');
const axios = require('axios');

const app = express();

// Google OAuth 콜백
app.get('/auth/google/callback', async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).send('Code missing');
    }

    try {
        // 1. 코드로 토큰 교환
        const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: 'https://yoursite.com/auth/google/callback',
            grant_type: 'authorization_code'
        });

        const { access_token, id_token, refresh_token } = tokenRes.data;

        // 2. 사용자 정보 가져오기
        const userRes = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        const { id, email, name, picture } = userRes.data;

        // 3. 우리 DB에서 사용자 찾기/생성
        let user = await User.findOne({ googleId: id });
        if (!user) {
            user = await User.create({
                googleId: id,
                email,
                name,
                avatar: picture
            });
        }

        // 4. 세션/JWT 생성
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

        // 5. 리다이렉트
        res.redirect(`/dashboard?token=${token}`);

    } catch (error) {
        console.error('Google OAuth error:', error);
        res.redirect('/login?error=google_auth_failed');
    }
});
```

### ⚠️ 주의사항

| 체크 | 항목 |
|------|------|
| ✅ | Client Secret은 **절대** 프론트엔드에 노출하지 마세요 |
| ✅ | Redirect URI는 정확히 일치해야 합니다 (슬래시 하나도!) |
| ✅ | HTTPS 필수 (localhost 제외) |
| ✅ | `state` 파라미터로 CSRF 방지 (권장) |

---

## 2. Apple Sign In

### 🎯 한 줄 요약
> Google과 비슷하지만, Apple은 더 까다롭고 **이메일 숨기기** 기능이 있음

### 📝 Apple만의 특징

1. **이메일 숨기기**: 사용자가 실제 이메일 대신 `xxxxx@privaterelay.appleid.com` 사용 가능
2. **첫 로그인에만 이름 제공**: 두 번째부터는 이름 안 줌 → DB에 저장 필수!
3. **JWT 검증 필수**: ID Token을 Apple 공개키로 검증해야 함

### 🔧 구현 방법

#### Step 1: Apple Developer 설정

1. https://developer.apple.com 접속 (유료 계정 필요 - $99/년)
2. **Certificates, Identifiers & Profiles**
3. **Identifiers** → **App IDs** 생성
4. **Services** → **Sign In with Apple** 활성화
5. **Keys** → 새 키 생성 → **Sign In with Apple** 체크
6. **Service ID** 생성 (웹용)

**결과물:**
- Service ID: `com.yourcompany.web`
- Key ID: `XXXXXXXXXX`
- Team ID: `YYYYYYYYYY`
- Private Key: `.p8` 파일

#### Step 2: 프론트엔드

```javascript
new KaiAuthKit({
    onSocialLogin: (provider) => {
        if (provider === 'apple') {
            const params = new URLSearchParams({
                client_id: 'com.yourcompany.web', // Service ID
                redirect_uri: 'https://yoursite.com/auth/apple/callback',
                response_type: 'code id_token',
                response_mode: 'form_post', // Apple은 POST로 보냄!
                scope: 'name email',
                state: generateCSRFToken()
            });
            window.location.href = `https://appleid.apple.com/auth/authorize?${params}`;
        }
    }
});
```

#### Step 3: 백엔드 (Node.js)

```javascript
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

// Apple 공개키 클라이언트
const appleJwksClient = jwksClient({
    jwksUri: 'https://appleid.apple.com/auth/keys'
});

// Apple OAuth 콜백 (POST!)
app.post('/auth/apple/callback', async (req, res) => {
    const { code, id_token, user } = req.body;

    try {
        // 1. ID Token 검증
        const decoded = jwt.decode(id_token, { complete: true });
        const kid = decoded.header.kid;

        const key = await appleJwksClient.getSigningKey(kid);
        const publicKey = key.getPublicKey();

        const verified = jwt.verify(id_token, publicKey, {
            algorithms: ['RS256'],
            issuer: 'https://appleid.apple.com',
            audience: 'com.yourcompany.web' // Service ID
        });

        // verified에서 사용자 정보 추출
        const { sub: appleId, email } = verified;

        // 2. 첫 로그인시 이름 정보 (user는 첫 로그인에만 옴!)
        let name = null;
        if (user) {
            const userData = JSON.parse(user);
            name = `${userData.name?.firstName} ${userData.name?.lastName}`.trim();
        }

        // 3. DB 처리
        let dbUser = await User.findOne({ appleId });
        if (!dbUser) {
            dbUser = await User.create({
                appleId,
                email,
                name: name || 'Apple User' // 이름 저장 필수!
            });
        }

        // 4. 세션/JWT 생성 및 리다이렉트
        const token = jwt.sign({ userId: dbUser.id }, process.env.JWT_SECRET);
        res.redirect(`/dashboard?token=${token}`);

    } catch (error) {
        console.error('Apple Sign In error:', error);
        res.redirect('/login?error=apple_auth_failed');
    }
});
```

### ⚠️ 주의사항

| 체크 | 항목 |
|------|------|
| ⚠️ | 유료 Developer 계정 필요 ($99/년) |
| ⚠️ | 이름은 **첫 로그인에만** 제공됨 → 꼭 저장! |
| ⚠️ | Private Key(.p8)는 **한 번만** 다운로드 가능 |
| ⚠️ | 콜백은 **POST** (다른 OAuth와 다름!) |
| ⚠️ | 이메일 숨기기 시 relay 이메일로 응답해야 함 |

---

## 3. Microsoft Azure AD

### 🎯 한 줄 요약
> 기업 사용자에게 필수. Microsoft 365 계정으로 로그인.

### 📝 특징

- **개인 계정 + 회사/학교 계정** 모두 지원 가능
- **엔터프라이즈**에서 가장 많이 사용
- **Single Tenant** vs **Multi Tenant** 선택

### 🔧 구현 방법

#### Step 1: Azure Portal 설정

1. https://portal.azure.com 접속
2. **Azure Active Directory** → **앱 등록**
3. **새 등록**
   - 이름: `Your App Name`
   - 지원되는 계정 유형:
     - 단일 테넌트: 우리 조직만
     - 다중 테넌트: 모든 조직
     - 다중 테넌트 + 개인: 모든 조직 + 개인 MS 계정
4. **리디렉션 URI**: `https://yoursite.com/auth/microsoft/callback`
5. **인증서 및 비밀** → **새 클라이언트 암호**

**결과물:**
- Application (client) ID: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
- Directory (tenant) ID: `yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy`
- Client Secret: `zzzzzzzzzzzzzzzz`

#### Step 2: 프론트엔드

```javascript
new KaiAuthKit({
    onSocialLogin: (provider) => {
        if (provider === 'microsoft') {
            const tenant = 'common'; // 또는 특정 tenant ID
            const params = new URLSearchParams({
                client_id: 'YOUR_CLIENT_ID',
                redirect_uri: 'https://yoursite.com/auth/microsoft/callback',
                response_type: 'code',
                scope: 'openid email profile User.Read',
                response_mode: 'query',
                state: generateCSRFToken()
            });
            window.location.href = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize?${params}`;
        }
    }
});
```

#### Step 3: 백엔드

```javascript
app.get('/auth/microsoft/callback', async (req, res) => {
    const { code } = req.query;
    const tenant = 'common';

    try {
        // 1. 토큰 교환
        const tokenRes = await axios.post(
            `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`,
            new URLSearchParams({
                client_id: process.env.MS_CLIENT_ID,
                client_secret: process.env.MS_CLIENT_SECRET,
                code,
                redirect_uri: 'https://yoursite.com/auth/microsoft/callback',
                grant_type: 'authorization_code'
            })
        );

        const { access_token } = tokenRes.data;

        // 2. Microsoft Graph API로 사용자 정보
        const userRes = await axios.get('https://graph.microsoft.com/v1.0/me', {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        const { id, mail, displayName } = userRes.data;

        // 3. DB 처리 및 로그인
        // ...

    } catch (error) {
        console.error('Microsoft auth error:', error);
        res.redirect('/login?error=microsoft_auth_failed');
    }
});
```

### ⚠️ Tenant 유형 이해하기

| Tenant | 설명 | 사용 사례 |
|--------|------|----------|
| `common` | 모든 조직 + 개인 | 일반 웹 서비스 |
| `organizations` | 모든 조직 (회사/학교) | B2B 서비스 |
| `consumers` | 개인 MS 계정만 | 개인 사용자 대상 |
| `{tenant-id}` | 특정 조직만 | 사내 앱 |

---

## 4. Kakao 로그인 (한국)

### 🎯 한 줄 요약
> 한국 사용자 대상 서비스라면 필수! 간단하고 빠름.

### 🔧 구현 방법

#### Step 1: Kakao Developers 설정

1. https://developers.kakao.com 접속
2. **내 애플리케이션** → **애플리케이션 추가**
3. **앱 키** 확인 (REST API 키 사용)
4. **플랫폼** → 웹 사이트 도메인 등록
5. **카카오 로그인** → 활성화
6. **Redirect URI** 등록

**결과물:**
- REST API Key: `xxxxxxxxxxxxxxxxxxxxxxxxxx`
- Redirect URI: `https://yoursite.com/auth/kakao/callback`

#### Step 2: 동의항목 설정

**카카오 로그인** → **동의항목**에서 필요한 정보 설정:
- 닉네임 (필수)
- 프로필 사진
- 카카오계정(이메일) - **비즈 앱 전환 필요!**

⚠️ **이메일 수집은 비즈 앱 전환 후에만 가능!**

#### Step 3: 프론트엔드

```javascript
new KaiAuthKit({
    onSocialLogin: (provider) => {
        if (provider === 'kakao') {
            const params = new URLSearchParams({
                client_id: 'YOUR_REST_API_KEY',
                redirect_uri: 'https://yoursite.com/auth/kakao/callback',
                response_type: 'code',
                scope: 'profile_nickname profile_image account_email'
            });
            window.location.href = `https://kauth.kakao.com/oauth/authorize?${params}`;
        }
    }
});
```

#### Step 4: 백엔드

```javascript
app.get('/auth/kakao/callback', async (req, res) => {
    const { code } = req.query;

    try {
        // 1. 토큰 교환
        const tokenRes = await axios.post('https://kauth.kakao.com/oauth/token',
            new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: process.env.KAKAO_REST_API_KEY,
                redirect_uri: 'https://yoursite.com/auth/kakao/callback',
                code
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        const { access_token } = tokenRes.data;

        // 2. 사용자 정보
        const userRes = await axios.get('https://kapi.kakao.com/v2/user/me', {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        const { id, kakao_account, properties } = userRes.data;
        const email = kakao_account?.email;
        const nickname = properties?.nickname;
        const profileImage = properties?.profile_image;

        // 3. DB 처리
        // ...

    } catch (error) {
        console.error('Kakao auth error:', error);
    }
});
```

### ⚠️ 주의사항

| 체크 | 항목 |
|------|------|
| ⚠️ | 이메일 수집은 **비즈 앱 전환** 필요 |
| ⚠️ | 사업자 등록 없이는 일부 기능 제한 |
| ✅ | JavaScript SDK도 있음 (선택사항) |

---

## 5. Naver 로그인 (한국)

### 🎯 한 줄 요약
> 카카오와 함께 한국 필수 로그인. 이메일 바로 수집 가능.

### 🔧 구현 방법

#### Step 1: Naver Developers 설정

1. https://developers.naver.com 접속
2. **Application** → **애플리케이션 등록**
3. **사용 API**: 네이버 로그인
4. **Callback URL** 등록
5. **Client ID**, **Client Secret** 확인

**결과물:**
- Client ID: `xxxxxxxxxxxxxxxxxxxx`
- Client Secret: `yyyyyyyyyy`

#### Step 2: 프론트엔드

```javascript
new KaiAuthKit({
    onSocialLogin: (provider) => {
        if (provider === 'naver') {
            const state = generateCSRFToken(); // CSRF 방지용 필수!
            const params = new URLSearchParams({
                client_id: 'YOUR_CLIENT_ID',
                redirect_uri: 'https://yoursite.com/auth/naver/callback',
                response_type: 'code',
                state
            });
            // state를 세션/쿠키에 저장
            sessionStorage.setItem('naver_state', state);
            window.location.href = `https://nid.naver.com/oauth2.0/authorize?${params}`;
        }
    }
});
```

#### Step 3: 백엔드

```javascript
app.get('/auth/naver/callback', async (req, res) => {
    const { code, state } = req.query;

    // state 검증 (CSRF 방지)
    // ...

    try {
        // 1. 토큰 교환
        const tokenRes = await axios.get('https://nid.naver.com/oauth2.0/token', {
            params: {
                grant_type: 'authorization_code',
                client_id: process.env.NAVER_CLIENT_ID,
                client_secret: process.env.NAVER_CLIENT_SECRET,
                code,
                state
            }
        });

        const { access_token } = tokenRes.data;

        // 2. 사용자 정보
        const userRes = await axios.get('https://openapi.naver.com/v1/nid/me', {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        const { response } = userRes.data;
        // response: { id, email, name, nickname, profile_image, ... }

        // 3. DB 처리
        // ...

    } catch (error) {
        console.error('Naver auth error:', error);
    }
});
```

---

## 6. LINE 로그인 (일본/아시아)

### 🎯 한 줄 요약
> 일본, 대만, 태국 사용자 대상이라면 필수!

### 🔧 구현 방법

#### Step 1: LINE Developers 설정

1. https://developers.line.biz 접속
2. **Console** → **Create a new provider**
3. **Create a LINE Login channel**
4. **Callback URL** 등록

**결과물:**
- Channel ID: `1234567890`
- Channel Secret: `xxxxxxxxxxxxxxxxxxxxxxx`

#### Step 2: 프론트엔드

```javascript
new KaiAuthKit({
    onSocialLogin: (provider) => {
        if (provider === 'line') {
            const state = generateCSRFToken();
            const params = new URLSearchParams({
                response_type: 'code',
                client_id: 'YOUR_CHANNEL_ID',
                redirect_uri: 'https://yoursite.com/auth/line/callback',
                state,
                scope: 'profile openid email',
                nonce: generateNonce() // 재사용 공격 방지
            });
            window.location.href = `https://access.line.me/oauth2/v2.1/authorize?${params}`;
        }
    }
});
```

#### Step 3: 백엔드

```javascript
app.get('/auth/line/callback', async (req, res) => {
    const { code } = req.query;

    try {
        // 1. 토큰 교환
        const tokenRes = await axios.post('https://api.line.me/oauth2/v2.1/token',
            new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: 'https://yoursite.com/auth/line/callback',
                client_id: process.env.LINE_CHANNEL_ID,
                client_secret: process.env.LINE_CHANNEL_SECRET
            })
        );

        const { access_token, id_token } = tokenRes.data;

        // 2. ID Token 검증 및 사용자 정보
        const decoded = jwt.decode(id_token);
        // decoded: { sub, name, picture, email }

        // 또는 Profile API 사용
        const profileRes = await axios.get('https://api.line.me/v2/profile', {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        // 3. DB 처리
        // ...

    } catch (error) {
        console.error('LINE auth error:', error);
    }
});
```

---

## 7. Passkey/FIDO2 (WebAuthn)

### 🎯 한 줄 요약
> **비밀번호 없는 미래!** 지문/얼굴/보안키로 로그인. 가장 안전함.

### 📝 작동 원리 (쉬운 설명)

```
[등록 과정]
1. 서버: "이 사용자 등록하려고 해. 도전(challenge) 줄게"
2. 브라우저: 사용자에게 지문/얼굴 요청
3. 기기: 공개키/비밀키 쌍 생성, 비밀키는 기기에 저장
4. 브라우저: 공개키 + 서명을 서버로 전송
5. 서버: 공개키 저장 (나중에 인증용)

[로그인 과정]
1. 서버: "로그인하려고? 도전(challenge) 줄게"
2. 브라우저: 사용자에게 지문/얼굴 요청
3. 기기: 저장된 비밀키로 도전에 서명
4. 브라우저: 서명을 서버로 전송
5. 서버: 저장된 공개키로 서명 검증 → 로그인 성공!
```

**핵심**: 비밀키는 절대 기기 밖으로 나가지 않음! 피싱 불가능!

### 🔧 구현 방법

#### Step 1: 라이브러리 설치

```bash
# Node.js
npm install @simplewebauthn/server @simplewebauthn/browser
```

#### Step 2: 프론트엔드 (등록)

```javascript
import { startRegistration } from '@simplewebauthn/browser';

async function registerPasskey() {
    try {
        // 1. 서버에서 등록 옵션 가져오기
        const optionsRes = await fetch('/auth/passkey/register-options', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'user@example.com' })
        });
        const options = await optionsRes.json();

        // 2. 브라우저에서 Passkey 생성 (지문/얼굴 요청)
        const credential = await startRegistration(options);

        // 3. 서버에 등록 완료
        const verifyRes = await fetch('/auth/passkey/register-verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credential)
        });

        const result = await verifyRes.json();
        if (result.verified) {
            alert('Passkey 등록 완료!');
        }

    } catch (error) {
        console.error('Passkey registration failed:', error);
    }
}
```

#### Step 3: 백엔드 (등록)

```javascript
const {
    generateRegistrationOptions,
    verifyRegistrationResponse
} = require('@simplewebauthn/server');

const rpName = 'Your App Name';
const rpID = 'yoursite.com';
const origin = 'https://yoursite.com';

// 등록 옵션 생성
app.post('/auth/passkey/register-options', async (req, res) => {
    const { username } = req.body;

    // 사용자의 기존 Passkey 조회
    const user = await User.findOne({ email: username });
    const existingCredentials = user?.passkeys || [];

    const options = await generateRegistrationOptions({
        rpName,
        rpID,
        userID: user.id,
        userName: username,
        attestationType: 'none',
        excludeCredentials: existingCredentials.map(cred => ({
            id: cred.credentialID,
            type: 'public-key',
            transports: cred.transports
        })),
        authenticatorSelection: {
            residentKey: 'preferred',
            userVerification: 'preferred'
        }
    });

    // challenge 저장 (검증용)
    await saveChallenge(user.id, options.challenge);

    res.json(options);
});

// 등록 검증
app.post('/auth/passkey/register-verify', async (req, res) => {
    const { body } = req;
    const user = await getCurrentUser(req);
    const expectedChallenge = await getChallenge(user.id);

    try {
        const verification = await verifyRegistrationResponse({
            response: body,
            expectedChallenge,
            expectedOrigin: origin,
            expectedRPID: rpID
        });

        if (verification.verified) {
            // Passkey 정보 저장
            await User.updateOne(
                { _id: user.id },
                {
                    $push: {
                        passkeys: {
                            credentialID: verification.registrationInfo.credentialID,
                            credentialPublicKey: verification.registrationInfo.credentialPublicKey,
                            counter: verification.registrationInfo.counter,
                            transports: body.response.transports
                        }
                    }
                }
            );
        }

        res.json({ verified: verification.verified });

    } catch (error) {
        console.error('Passkey verification failed:', error);
        res.status(400).json({ error: error.message });
    }
});
```

#### Step 4: 프론트엔드 (로그인)

```javascript
import { startAuthentication } from '@simplewebauthn/browser';

async function loginWithPasskey() {
    try {
        // 1. 서버에서 인증 옵션
        const optionsRes = await fetch('/auth/passkey/auth-options', {
            method: 'POST'
        });
        const options = await optionsRes.json();

        // 2. 지문/얼굴로 인증
        const credential = await startAuthentication(options);

        // 3. 서버에서 검증
        const verifyRes = await fetch('/auth/passkey/auth-verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credential)
        });

        const result = await verifyRes.json();
        if (result.verified) {
            // 로그인 성공!
            window.location.href = '/dashboard';
        }

    } catch (error) {
        console.error('Passkey login failed:', error);
    }
}
```

### ⚠️ 주의사항

| 체크 | 항목 |
|------|------|
| ⚠️ | **HTTPS 필수** (localhost 제외) |
| ⚠️ | rpID는 도메인과 일치해야 함 |
| ✅ | counter 검증으로 복제 공격 방지 |
| ✅ | 여러 Passkey 등록 가능하게 (기기 분실 대비) |

---

## 8. OTP 2단계 인증

### 🎯 한 줄 요약
> 비밀번호 + 6자리 숫자 = 훨씬 안전!

### 📝 TOTP 작동 원리

```
[등록]
1. 서버: 32자리 비밀키 생성 (base32)
2. 서버: QR 코드로 변환
3. 사용자: Google Authenticator 등으로 스캔
4. 앱: 비밀키 저장, 30초마다 6자리 코드 생성

[인증]
1. 사용자: 앱에서 현재 코드 확인 (예: 123456)
2. 사용자: 웹사이트에 코드 입력
3. 서버: 같은 비밀키로 코드 계산, 일치하면 OK!
```

### 🔧 구현 방법

```bash
npm install speakeasy qrcode
```

#### 등록

```javascript
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

// OTP 설정 시작
app.post('/auth/otp/setup', async (req, res) => {
    const user = await getCurrentUser(req);

    // 비밀키 생성
    const secret = speakeasy.generateSecret({
        name: `YourApp (${user.email})`,
        issuer: 'YourApp'
    });

    // 임시 저장 (아직 활성화 X)
    await User.updateOne(
        { _id: user.id },
        { otpSecretTemp: secret.base32 }
    );

    // QR 코드 생성
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    res.json({
        qrCode: qrCodeUrl,
        manualKey: secret.base32 // QR 안 되면 수동 입력용
    });
});

// OTP 활성화 (첫 검증)
app.post('/auth/otp/verify-setup', async (req, res) => {
    const { token } = req.body;
    const user = await getCurrentUser(req);

    // 검증
    const verified = speakeasy.totp.verify({
        secret: user.otpSecretTemp,
        encoding: 'base32',
        token,
        window: 1 // 앞뒤 30초 허용
    });

    if (verified) {
        await User.updateOne(
            { _id: user.id },
            {
                otpSecret: user.otpSecretTemp,
                otpEnabled: true,
                $unset: { otpSecretTemp: 1 }
            }
        );

        // 백업 코드 생성 (OTP 앱 분실시 사용)
        const backupCodes = generateBackupCodes();
        await saveBackupCodes(user.id, backupCodes);

        res.json({ success: true, backupCodes });
    } else {
        res.status(400).json({ error: 'Invalid code' });
    }
});
```

#### 로그인 시 OTP 검증

```javascript
// 1단계: 이메일/비밀번호 확인
app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.otpEnabled) {
        // OTP 필요 - 임시 토큰 발급
        const tempToken = jwt.sign(
            { userId: user.id, step: 'otp' },
            process.env.JWT_SECRET,
            { expiresIn: '5m' }
        );
        return res.json({ requireOTP: true, tempToken });
    }

    // OTP 없으면 바로 로그인
    const token = generateFullToken(user);
    res.json({ token });
});

// 2단계: OTP 검증
app.post('/auth/login/otp', async (req, res) => {
    const { tempToken, otpCode } = req.body;

    try {
        const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
        if (decoded.step !== 'otp') throw new Error('Invalid step');

        const user = await User.findById(decoded.userId);

        const verified = speakeasy.totp.verify({
            secret: user.otpSecret,
            encoding: 'base32',
            token: otpCode,
            window: 1
        });

        if (!verified) {
            // 백업 코드 체크
            const isBackupCode = await checkBackupCode(user.id, otpCode);
            if (!isBackupCode) {
                return res.status(401).json({ error: 'Invalid OTP' });
            }
        }

        const token = generateFullToken(user);
        res.json({ token });

    } catch (error) {
        res.status(401).json({ error: 'OTP verification failed' });
    }
});
```

---

## 9. Enterprise SSO (SAML/OIDC)

### 🎯 한 줄 요약
> 기업 고객이 자사 IdP(Okta, Azure AD 등)로 로그인하게 해주는 B2B 필수 기능

### 📝 SAML vs OIDC

| 항목 | SAML 2.0 | OIDC |
|------|----------|------|
| 나이 | 2005년~ (원로) | 2014년~ (신세대) |
| 형식 | XML | JSON |
| 복잡도 | 복잡함 | 상대적 단순 |
| 사용처 | 전통 기업 | 모던 앱 |

### 🔧 OIDC 구현 (권장)

```bash
npm install openid-client
```

```javascript
const { Issuer, generators } = require('openid-client');

// 고객사 IdP 설정 저장
const tenantConfigs = {
    'acme-corp': {
        issuer: 'https://acme-corp.okta.com',
        clientId: 'xxxxxxxx',
        clientSecret: 'yyyyyyyy'
    }
};

// SSO 시작
app.get('/auth/sso/:tenantId', async (req, res) => {
    const { tenantId } = req.params;
    const config = tenantConfigs[tenantId];

    if (!config) {
        return res.status(404).send('Unknown tenant');
    }

    // IdP 설정 자동 탐색
    const issuer = await Issuer.discover(config.issuer);
    const client = new issuer.Client({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uris: ['https://yoursite.com/auth/sso/callback'],
        response_types: ['code']
    });

    const nonce = generators.nonce();
    const state = generators.state();

    // 세션에 저장
    req.session.sso = { tenantId, nonce, state };

    const authUrl = client.authorizationUrl({
        scope: 'openid email profile',
        nonce,
        state
    });

    res.redirect(authUrl);
});

// SSO 콜백
app.get('/auth/sso/callback', async (req, res) => {
    const { tenantId, nonce, state } = req.session.sso;
    const config = tenantConfigs[tenantId];

    const issuer = await Issuer.discover(config.issuer);
    const client = new issuer.Client({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uris: ['https://yoursite.com/auth/sso/callback'],
        response_types: ['code']
    });

    const params = client.callbackParams(req);
    const tokenSet = await client.callback(
        'https://yoursite.com/auth/sso/callback',
        params,
        { nonce, state }
    );

    const userinfo = await client.userinfo(tokenSet.access_token);
    // userinfo: { sub, email, name, ... }

    // DB에서 사용자 찾기/생성 (tenantId로 구분)
    let user = await User.findOne({
        tenantId,
        ssoId: userinfo.sub
    });

    if (!user) {
        user = await User.create({
            tenantId,
            ssoId: userinfo.sub,
            email: userinfo.email,
            name: userinfo.name
        });
    }

    const token = generateToken(user);
    res.redirect(`/dashboard?token=${token}`);
});
```

### ⚠️ SSO 도입 시 고려사항

1. **Tenant별 설정 저장**: DB에 고객사별 IdP 설정 저장
2. **JIT Provisioning**: 첫 로그인 시 자동 계정 생성
3. **SCIM**: 사용자 동기화 (고급)
4. **도메인 매핑**: 이메일 도메인으로 자동 SSO 라우팅

---

## 10. QR 코드 로그인

### 🎯 한 줄 요약
> 모바일 앱에서 QR 스캔 → PC에서 자동 로그인. 카카오톡 PC 로그인 방식!

### 📝 작동 원리

```
[PC]                        [모바일 앱]
  |                              |
  | 1. QR 표시 (세션ID 포함)      |
  |----------------------------->|
  |                              | 2. QR 스캔
  |                              | 3. 서버에 "이 세션 승인" 전송
  |                              |
  | 4. 폴링 중... "승인됨!"       |
  |<-----------------------------|
  | 5. 로그인 완료!               |
```

### 🔧 구현 방법

#### 백엔드

```javascript
const { v4: uuidv4 } = require('uuid');

// QR 세션 저장소 (Redis 권장)
const qrSessions = new Map();

// QR 세션 생성
app.post('/auth/qr/generate', (req, res) => {
    const sessionId = uuidv4();

    qrSessions.set(sessionId, {
        status: 'pending',
        createdAt: Date.now(),
        expiresAt: Date.now() + 60000 // 60초
    });

    // QR에 담을 데이터
    const qrData = JSON.stringify({
        type: 'login',
        sessionId,
        url: `https://yoursite.com/auth/qr/approve/${sessionId}`
    });

    res.json({ sessionId, qrData });
});

// 세션 상태 확인 (PC에서 폴링)
app.get('/auth/qr/status/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    const session = qrSessions.get(sessionId);

    if (!session) {
        return res.json({ status: 'expired' });
    }

    if (Date.now() > session.expiresAt) {
        qrSessions.delete(sessionId);
        return res.json({ status: 'expired' });
    }

    if (session.status === 'approved') {
        qrSessions.delete(sessionId);
        return res.json({
            status: 'approved',
            token: session.token
        });
    }

    res.json({ status: session.status });
});

// QR 승인 (모바일 앱에서 호출)
app.post('/auth/qr/approve/:sessionId', async (req, res) => {
    const { sessionId } = req.params;
    const { userToken } = req.body; // 모바일 앱의 인증 토큰

    // 모바일 앱 사용자 확인
    const user = await verifyMobileToken(userToken);
    if (!user) {
        return res.status(401).json({ error: 'Invalid token' });
    }

    const session = qrSessions.get(sessionId);
    if (!session || Date.now() > session.expiresAt) {
        return res.status(400).json({ error: 'Session expired' });
    }

    // PC용 토큰 생성
    const pcToken = generateToken(user);

    // 세션 업데이트
    session.status = 'approved';
    session.token = pcToken;
    session.userId = user.id;

    res.json({ success: true });
});
```

#### 프론트엔드 (PC)

```javascript
async function startQRLogin() {
    // 1. QR 세션 생성
    const res = await fetch('/auth/qr/generate', { method: 'POST' });
    const { sessionId, qrData } = await res.json();

    // 2. QR 코드 표시
    const qrContainer = document.getElementById('qr-container');
    QRCode.toCanvas(qrContainer, qrData);

    // 3. 상태 폴링
    const pollInterval = setInterval(async () => {
        const statusRes = await fetch(`/auth/qr/status/${sessionId}`);
        const { status, token } = await statusRes.json();

        if (status === 'approved') {
            clearInterval(pollInterval);
            localStorage.setItem('token', token);
            window.location.href = '/dashboard';
        } else if (status === 'expired') {
            clearInterval(pollInterval);
            alert('QR 코드가 만료되었습니다. 다시 시도해주세요.');
        }
    }, 2000); // 2초마다 폴링

    // 60초 후 자동 만료
    setTimeout(() => {
        clearInterval(pollInterval);
    }, 60000);
}
```

---

## 🔐 보안 베스트 프랙티스

### 필수 체크리스트

```
☐ HTTPS 적용 (Let's Encrypt 무료)
☐ 모든 Secret은 환경변수로 관리
☐ CSRF 토큰 (state 파라미터) 사용
☐ Rate Limiting (로그인 시도 제한)
☐ 비밀번호 해싱 (bcrypt, argon2)
☐ JWT는 HttpOnly 쿠키에 저장
☐ Refresh Token 구현
☐ 로그인 알림 (새 기기/위치)
☐ 세션 관리 (다른 기기 로그아웃)
☐ 감사 로그 (로그인 기록)
```

### Rate Limiting 예시

```javascript
const rateLimit = require('express-rate-limit');

// 로그인 시도 제한
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15분
    max: 5, // 최대 5회
    message: { error: 'Too many login attempts. Try again in 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
    // IP + 이메일 조합으로 제한
    keyGenerator: (req) => `${req.ip}-${req.body.email}`
});

app.post('/auth/login', loginLimiter, async (req, res) => {
    // 로그인 처리
});
```

### 안전한 세션 관리

```javascript
// JWT + Refresh Token 전략
const ACCESS_TOKEN_EXPIRY = '15m';  // 짧게
const REFRESH_TOKEN_EXPIRY = '7d';  // 길게

function generateTokens(user) {
    const accessToken = jwt.sign(
        { userId: user.id, type: 'access' },
        process.env.JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
        { userId: user.id, type: 'refresh', jti: uuidv4() },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    return { accessToken, refreshToken };
}

// 쿠키로 설정 (HttpOnly!)
res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: true, // HTTPS만
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000
});

res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/auth/refresh', // 이 경로에서만 전송
    maxAge: 7 * 24 * 60 * 60 * 1000
});
```

---

## 📚 참고 자료

### 공식 문서
- [Google OAuth](https://developers.google.com/identity/protocols/oauth2)
- [Apple Sign In](https://developer.apple.com/sign-in-with-apple/)
- [Microsoft Identity Platform](https://docs.microsoft.com/en-us/azure/active-directory/develop/)
- [Kakao Developers](https://developers.kakao.com/docs/latest/ko/kakaologin/common)
- [Naver Developers](https://developers.naver.com/docs/login/overview/)
- [LINE Developers](https://developers.line.biz/en/docs/line-login/)
- [WebAuthn Guide](https://webauthn.guide/)

### 라이브러리
- [@simplewebauthn/server](https://github.com/MasterKale/SimpleWebAuthn) - Passkey
- [speakeasy](https://github.com/speakeasyjs/speakeasy) - OTP
- [openid-client](https://github.com/panva/node-openid-client) - OIDC

---

> **Made with ❤️ by KAITRUST**
>
> 질문이나 개선 제안은 언제든 환영합니다!
