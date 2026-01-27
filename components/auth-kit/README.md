# KAITRUST Auth Kit

> **Yandex-grade authentication UI component**
>
> A plug-and-play, enterprise-ready authentication system.

---

## Features

- **Social OAuth**: Google, Apple, Microsoft, Kakao, Naver, LINE, GitHub, etc.
- **Advanced Auth**: Passkey/FIDO2, OTP/2FA, Enterprise SSO (SAML/OIDC)
- **QR Code Login**: Mobile app scan-to-login
- **Dark/Light Theme**: Customizable styling
- **i18n Ready**: Full text customization
- **Responsive**: Mobile-first design
- **Accessible**: WCAG compliant

---

## Quick Start

### 1. Include Files

```html
<!-- CSS -->
<link rel="stylesheet" href="kaitrust-auth-kit.css">
<!-- Font Awesome -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<!-- Google Fonts (optional) -->
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=JetBrains+Mono&display=swap" rel="stylesheet">
```

### 2. Add Container

```html
<div id="auth-container"></div>
```

### 3. Initialize

```html
<script src="kaitrust-auth-kit.js"></script>
<script>
const auth = new KaiAuthKit({
    container: '#auth-container',
    socialProviders: ['google', 'apple', 'microsoft'],
    onLogin: (data) => {
        // Handle login
        fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    onSocialLogin: (provider) => {
        window.location.href = `/auth/${provider}`;
    }
});
</script>
```

---

## Configuration

```javascript
new KaiAuthKit({
    // Required
    container: '#auth-container',

    // Theme
    theme: 'dark', // 'dark' | 'light'

    // Features
    showTabs: true,
    showQRTab: true,
    showAdvanced: true,
    showSecurityBadges: true,
    enablePasskey: true,
    enableOTP: true,
    enableSSO: true,

    // Social Providers (order matters)
    socialProviders: [
        'google',     // Global
        'apple',      // Global
        'microsoft',  // Global/Enterprise
        'kakao',      // Korea
        'naver',      // Korea
        'line',       // Japan/Asia
        'github',     // Developers
        'facebook',   // Global
        'twitter'     // Global
    ],

    // Texts (i18n)
    texts: {
        title: 'SECURE LOGIN',
        subtitle: 'Sign in to your account',
        // ... see IMPLEMENTATION-GUIDE.md
    },

    // Callbacks
    onLogin: (data) => {},
    onSocialLogin: (provider) => {},
    onPasskey: () => {},
    onOTP: () => {},
    onSSO: () => {},
    onQRGenerate: (container) => {},
    onForgotPassword: () => {},
    onSignUp: () => {}
});
```

---

## Files

| File | Description |
|------|-------------|
| `kaitrust-auth-kit.css` | All styles (customizable via CSS variables) |
| `kaitrust-auth-kit.js` | Component logic (vanilla JS, no dependencies) |
| `IMPLEMENTATION-GUIDE.md` | Detailed backend implementation for each provider |
| `example.html` | Interactive demo with live configuration |

---

## CSS Variables

Customize the look by overriding CSS variables:

```css
:root {
    /* Brand Colors */
    --kai-auth-primary: #00f5ff;
    --kai-auth-secondary: #0080ff;
    --kai-auth-accent: #a855f7;

    /* Background */
    --kai-auth-bg-dark: #000810;
    --kai-auth-bg-panel: rgba(0, 20, 40, 0.9);

    /* ... see full list in kaitrust-auth-kit.css */
}
```

---

## Implementation Guides

See [IMPLEMENTATION-GUIDE.md](./IMPLEMENTATION-GUIDE.md) for detailed backend setup:

1. Google OAuth 2.0
2. Apple Sign In
3. Microsoft Azure AD
4. Kakao Login
5. Naver Login
6. LINE Login
7. Passkey/FIDO2 (WebAuthn)
8. OTP 2-Factor Authentication
9. Enterprise SSO (SAML/OIDC)
10. QR Code Login

---

## Browser Support

- Chrome 70+
- Firefox 65+
- Safari 14+
- Edge 79+

---

## License

MIT License - KAITRUST (Korea AI Trust Association)
