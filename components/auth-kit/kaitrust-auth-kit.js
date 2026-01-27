/**
 * ============================================================================
 * KAITRUST AUTH KIT - Universal Authentication Component
 * ============================================================================
 * Version: 1.0.0
 * Author: KAITRUST (Korea AI Trust Association)
 * License: MIT
 *
 * A plug-and-play authentication component with support for:
 * - Email/Password login
 * - Social OAuth: Google, Apple, Microsoft, Kakao, Naver, LINE, GitHub, etc.
 * - Advanced Auth: Passkey/FIDO2, OTP/2FA, Enterprise SSO
 * - QR Code login
 * ============================================================================
 */

(function(global) {
    'use strict';

    /**
     * Default configuration
     */
    const DEFAULT_CONFIG = {
        container: '#kai-auth',
        mode: 'login', // 'login', 'register', 'reset'
        theme: 'dark', // 'dark', 'light'
        showTabs: true,
        showQRTab: true,
        showAdvanced: true,
        showSecurityBadges: true,
        enablePasskey: true,
        enableOTP: true,
        enableSSO: true,

        // Social providers to show (order matters)
        socialProviders: ['google', 'apple', 'microsoft', 'kakao', 'naver', 'line'],

        // Texts (i18n support)
        texts: {
            title: 'SECURE LOGIN',
            subtitle: 'Sign in to your account',
            emailLabel: 'Email or Username',
            emailPlaceholder: 'user@company.com',
            passwordLabel: 'Password',
            passwordPlaceholder: '••••••••••••',
            rememberMe: 'Remember me',
            forgotPassword: 'Forgot password?',
            loginButton: 'Secure Login',
            socialDivider: 'SOCIAL AUTH',
            advancedTitle: 'ADVANCED AUTHENTICATION',
            passkey: 'Passkey / FIDO2',
            otp: 'OTP Verification',
            sso: 'Enterprise SSO (SAML/OIDC)',
            noAccount: "Don't have an account?",
            signUp: 'Sign up',
            qrTabLabel: 'QR Code',
            credentialsTabLabel: 'Login',
            qrInstructions: 'Scan with your mobile app',
            qrHint: 'QR code refreshes every 60 seconds',
            securityLevel: 'SECURITY LEVEL: MAXIMUM'
        },

        // Social provider display names
        providerNames: {
            google: 'Google',
            apple: 'Apple',
            microsoft: 'Microsoft',
            kakao: '카카오',
            naver: '네이버',
            line: 'LINE',
            github: 'GitHub',
            facebook: 'Facebook',
            twitter: 'Twitter'
        },

        // Callbacks
        onLogin: null,
        onSocialLogin: null,
        onPasskey: null,
        onOTP: null,
        onSSO: null,
        onQRGenerate: null,
        onForgotPassword: null,
        onSignUp: null
    };

    /**
     * Social provider icons (Font Awesome classes)
     */
    const PROVIDER_ICONS = {
        google: 'fab fa-google',
        apple: 'fab fa-apple',
        microsoft: 'fab fa-microsoft',
        kakao: 'fas fa-comment', // Kakao uses chat icon
        naver: null, // Uses custom "N" text
        line: 'fab fa-line',
        github: 'fab fa-github',
        facebook: 'fab fa-facebook-f',
        twitter: 'fab fa-twitter'
    };

    /**
     * KaiAuthKit Class
     */
    class KaiAuthKit {
        constructor(config = {}) {
            this.config = { ...DEFAULT_CONFIG, ...config };
            this.config.texts = { ...DEFAULT_CONFIG.texts, ...config.texts };
            this.config.providerNames = { ...DEFAULT_CONFIG.providerNames, ...config.providerNames };
            this.container = null;
            this.activeTab = 'credentials';

            this.init();
        }

        /**
         * Initialize the component
         */
        init() {
            // Find container
            if (typeof this.config.container === 'string') {
                this.container = document.querySelector(this.config.container);
            } else {
                this.container = this.config.container;
            }

            if (!this.container) {
                console.error('[KaiAuthKit] Container not found:', this.config.container);
                return;
            }

            // Render
            this.render();
            this.bindEvents();

            // Generate initial QR if enabled
            if (this.config.showQRTab && this.config.onQRGenerate) {
                this.generateQR();
            }
        }

        /**
         * Render the auth component
         */
        render() {
            const { config } = this;
            const themeClass = config.theme === 'light' ? 'light-mode' : '';

            this.container.innerHTML = `
                <div class="kai-auth-container">
                    <div class="kai-auth-box ${themeClass}">
                        <!-- Header -->
                        <div class="kai-auth-header">
                            <h1 class="kai-auth-title">${config.texts.title}</h1>
                            <p class="kai-auth-subtitle">${config.texts.subtitle}</p>
                            <div class="kai-auth-security-badge">
                                <i class="fas fa-lock"></i>
                                <span>${config.texts.securityLevel}</span>
                            </div>
                        </div>

                        <!-- Tabs -->
                        ${config.showTabs && config.showQRTab ? this.renderTabs() : ''}

                        <!-- Credentials Tab -->
                        <div id="kai-auth-credentials" class="kai-auth-tab-content ${this.activeTab === 'credentials' ? '' : 'kai-auth-hidden'}">
                            ${this.renderCredentialsForm()}
                            ${this.renderDivider(config.texts.socialDivider)}
                            ${this.renderSocialGrid()}
                            ${config.showAdvanced ? this.renderAdvancedMethods() : ''}
                        </div>

                        <!-- QR Tab -->
                        ${config.showQRTab ? `
                        <div id="kai-auth-qr" class="kai-auth-tab-content ${this.activeTab === 'qr' ? '' : 'kai-auth-hidden'}">
                            ${this.renderQRCode()}
                        </div>
                        ` : ''}

                        <!-- Footer -->
                        ${this.renderFooter()}
                    </div>
                </div>
            `;
        }

        /**
         * Render tabs
         */
        renderTabs() {
            const { texts } = this.config;
            return `
                <div class="kai-auth-tabs">
                    <button class="kai-auth-tab active" data-tab="credentials">
                        <i class="fas fa-key"></i> ${texts.credentialsTabLabel}
                    </button>
                    <button class="kai-auth-tab" data-tab="qr">
                        <i class="fas fa-qrcode"></i> ${texts.qrTabLabel}
                    </button>
                </div>
            `;
        }

        /**
         * Render credentials form
         */
        renderCredentialsForm() {
            const { texts } = this.config;
            return `
                <form class="kai-auth-form" id="kai-auth-form">
                    <div class="kai-auth-field">
                        <label class="kai-auth-label">
                            <i class="fas fa-envelope"></i>
                            ${texts.emailLabel}
                        </label>
                        <div class="kai-auth-input-wrap">
                            <input type="text" class="kai-auth-input" id="kai-auth-email"
                                   placeholder="${texts.emailPlaceholder}" required>
                            <i class="fas fa-user"></i>
                        </div>
                    </div>
                    <div class="kai-auth-field">
                        <label class="kai-auth-label">
                            <i class="fas fa-shield-halved"></i>
                            ${texts.passwordLabel}
                        </label>
                        <div class="kai-auth-input-wrap">
                            <input type="password" class="kai-auth-input" id="kai-auth-password"
                                   placeholder="${texts.passwordPlaceholder}" required>
                            <i class="fas fa-lock"></i>
                        </div>
                    </div>
                    <div class="kai-auth-options">
                        <label class="kai-auth-checkbox">
                            <input type="checkbox" id="kai-auth-remember">
                            <span>${texts.rememberMe}</span>
                        </label>
                        <a href="#" class="kai-auth-link" id="kai-auth-forgot">${texts.forgotPassword}</a>
                    </div>
                    <button type="submit" class="kai-auth-btn">
                        <i class="fas fa-right-to-bracket"></i>
                        ${texts.loginButton}
                    </button>
                </form>
            `;
        }

        /**
         * Render divider
         */
        renderDivider(text) {
            return `<div class="kai-auth-divider"><span>${text}</span></div>`;
        }

        /**
         * Render social login grid
         */
        renderSocialGrid() {
            const { socialProviders, providerNames } = this.config;
            const cols = socialProviders.length <= 4 ? socialProviders.length : 3;

            const buttons = socialProviders.map(provider => {
                const icon = PROVIDER_ICONS[provider];
                const name = providerNames[provider] || provider;

                if (provider === 'naver') {
                    return `
                        <button class="kai-auth-social naver" data-provider="naver">
                            <span class="naver-n">N</span>
                            <span>${name}</span>
                        </button>
                    `;
                }

                return `
                    <button class="kai-auth-social ${provider}" data-provider="${provider}">
                        <i class="${icon}"></i>
                        <span>${name}</span>
                    </button>
                `;
            }).join('');

            return `<div class="kai-auth-social-grid cols-${cols}">${buttons}</div>`;
        }

        /**
         * Render advanced authentication methods
         */
        renderAdvancedMethods() {
            const { texts, enablePasskey, enableOTP, enableSSO } = this.config;

            let buttons = '';

            if (enablePasskey) {
                buttons += `
                    <button class="kai-auth-advanced-btn" data-method="passkey">
                        <i class="fas fa-fingerprint"></i>
                        <span>${texts.passkey}</span>
                    </button>
                `;
            }

            if (enableOTP) {
                buttons += `
                    <button class="kai-auth-advanced-btn" data-method="otp">
                        <i class="fas fa-mobile-screen"></i>
                        <span>${texts.otp}</span>
                    </button>
                `;
            }

            if (enableSSO) {
                buttons += `
                    <button class="kai-auth-advanced-btn enterprise full-width" data-method="sso">
                        <i class="fas fa-building"></i>
                        <span>${texts.sso}</span>
                    </button>
                `;
            }

            return `
                <div class="kai-auth-advanced">
                    <div class="kai-auth-advanced-title">
                        <i class="fas fa-fingerprint"></i>
                        ${texts.advancedTitle}
                    </div>
                    <div class="kai-auth-advanced-grid">
                        ${buttons}
                    </div>
                </div>
            `;
        }

        /**
         * Render QR code section
         */
        renderQRCode() {
            const { texts } = this.config;
            return `
                <div class="kai-auth-qr">
                    <div class="kai-auth-qr-code" id="kai-auth-qr-container">
                        <!-- QR code will be inserted here -->
                        <svg viewBox="0 0 100 100">
                            <rect x="10" y="10" width="25" height="25" fill="#000"/>
                            <rect x="65" y="10" width="25" height="25" fill="#000"/>
                            <rect x="10" y="65" width="25" height="25" fill="#000"/>
                            <rect x="15" y="15" width="15" height="15" fill="#fff"/>
                            <rect x="70" y="15" width="15" height="15" fill="#fff"/>
                            <rect x="15" y="70" width="15" height="15" fill="#fff"/>
                            <rect x="18" y="18" width="9" height="9" fill="#000"/>
                            <rect x="73" y="18" width="9" height="9" fill="#000"/>
                            <rect x="18" y="73" width="9" height="9" fill="#000"/>
                            <rect x="40" y="40" width="20" height="20" fill="#000"/>
                            <rect x="45" y="45" width="10" height="10" fill="#fff"/>
                        </svg>
                    </div>
                    <div class="kai-auth-qr-text">
                        <strong>${texts.qrInstructions}</strong>
                    </div>
                    <div class="kai-auth-qr-hint">
                        <i class="fas fa-info-circle"></i>
                        ${texts.qrHint}
                    </div>
                </div>
            `;
        }

        /**
         * Render footer
         */
        renderFooter() {
            const { texts, showSecurityBadges } = this.config;

            return `
                <div class="kai-auth-footer">
                    <p>${texts.noAccount} <a href="#" id="kai-auth-signup">${texts.signUp}</a></p>
                </div>
                ${showSecurityBadges ? `
                <div class="kai-auth-badges">
                    <div class="kai-auth-badge">
                        <i class="fas fa-shield-halved"></i>
                        <span>256-bit SSL</span>
                    </div>
                    <div class="kai-auth-badge">
                        <i class="fas fa-user-shield"></i>
                        <span>FIDO2</span>
                    </div>
                    <div class="kai-auth-badge">
                        <i class="fas fa-certificate"></i>
                        <span>Certified</span>
                    </div>
                </div>
                ` : ''}
            `;
        }

        /**
         * Bind event listeners
         */
        bindEvents() {
            // Tab switching
            this.container.querySelectorAll('.kai-auth-tab').forEach(tab => {
                tab.addEventListener('click', (e) => this.switchTab(e.currentTarget.dataset.tab));
            });

            // Form submission
            const form = this.container.querySelector('#kai-auth-form');
            if (form) {
                form.addEventListener('submit', (e) => this.handleLogin(e));
            }

            // Social login buttons
            this.container.querySelectorAll('.kai-auth-social').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const provider = e.currentTarget.dataset.provider;
                    this.handleSocialLogin(provider);
                });
            });

            // Advanced methods
            this.container.querySelectorAll('.kai-auth-advanced-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const method = e.currentTarget.dataset.method;
                    this.handleAdvancedAuth(method);
                });
            });

            // Forgot password
            const forgotLink = this.container.querySelector('#kai-auth-forgot');
            if (forgotLink) {
                forgotLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleForgotPassword();
                });
            }

            // Sign up
            const signupLink = this.container.querySelector('#kai-auth-signup');
            if (signupLink) {
                signupLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleSignUp();
                });
            }
        }

        /**
         * Switch tabs
         */
        switchTab(tabName) {
            this.activeTab = tabName;

            // Update tab buttons
            this.container.querySelectorAll('.kai-auth-tab').forEach(tab => {
                tab.classList.toggle('active', tab.dataset.tab === tabName);
            });

            // Update tab content
            this.container.querySelectorAll('.kai-auth-tab-content').forEach(content => {
                content.classList.add('kai-auth-hidden');
            });

            const activeContent = this.container.querySelector(`#kai-auth-${tabName}`);
            if (activeContent) {
                activeContent.classList.remove('kai-auth-hidden');
            }

            // Generate QR if switching to QR tab
            if (tabName === 'qr' && this.config.onQRGenerate) {
                this.generateQR();
            }
        }

        /**
         * Handle login form submission
         */
        handleLogin(e) {
            e.preventDefault();

            const email = this.container.querySelector('#kai-auth-email').value;
            const password = this.container.querySelector('#kai-auth-password').value;
            const remember = this.container.querySelector('#kai-auth-remember').checked;

            if (this.config.onLogin) {
                this.config.onLogin({ email, password, remember });
            } else {
                console.log('[KaiAuthKit] Login:', { email, remember });
            }
        }

        /**
         * Handle social login
         */
        handleSocialLogin(provider) {
            if (this.config.onSocialLogin) {
                this.config.onSocialLogin(provider);
            } else {
                console.log('[KaiAuthKit] Social login:', provider);
            }
        }

        /**
         * Handle advanced authentication methods
         */
        handleAdvancedAuth(method) {
            switch (method) {
                case 'passkey':
                    if (this.config.onPasskey) {
                        this.config.onPasskey();
                    } else {
                        this.initiatePasskey();
                    }
                    break;
                case 'otp':
                    if (this.config.onOTP) {
                        this.config.onOTP();
                    } else {
                        console.log('[KaiAuthKit] OTP authentication requested');
                    }
                    break;
                case 'sso':
                    if (this.config.onSSO) {
                        this.config.onSSO();
                    } else {
                        console.log('[KaiAuthKit] SSO authentication requested');
                    }
                    break;
            }
        }

        /**
         * Initiate Passkey/WebAuthn authentication
         */
        async initiatePasskey() {
            if (!window.PublicKeyCredential) {
                alert('Passkey is not supported in this browser.');
                return;
            }

            try {
                // Check if passkey is available
                const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
                if (!available) {
                    alert('No platform authenticator available.');
                    return;
                }

                console.log('[KaiAuthKit] Passkey authentication initiated');
                // Actual implementation would call your server to get challenge
                // and then call navigator.credentials.get()

            } catch (error) {
                console.error('[KaiAuthKit] Passkey error:', error);
            }
        }

        /**
         * Generate QR code
         */
        generateQR() {
            const container = this.container.querySelector('#kai-auth-qr-container');
            if (container && this.config.onQRGenerate) {
                this.config.onQRGenerate(container);
            }
        }

        /**
         * Handle forgot password
         */
        handleForgotPassword() {
            if (this.config.onForgotPassword) {
                this.config.onForgotPassword();
            } else {
                console.log('[KaiAuthKit] Forgot password requested');
            }
        }

        /**
         * Handle sign up
         */
        handleSignUp() {
            if (this.config.onSignUp) {
                this.config.onSignUp();
            } else {
                console.log('[KaiAuthKit] Sign up requested');
            }
        }

        /**
         * Set QR code content
         */
        setQRCode(content) {
            const container = this.container.querySelector('#kai-auth-qr-container');
            if (container) {
                container.innerHTML = content;
            }
        }

        /**
         * Update configuration
         */
        updateConfig(newConfig) {
            this.config = { ...this.config, ...newConfig };
            this.render();
            this.bindEvents();
        }

        /**
         * Destroy the component
         */
        destroy() {
            if (this.container) {
                this.container.innerHTML = '';
            }
        }
    }

    /**
     * Factory function for quick initialization
     */
    function createAuthKit(config) {
        return new KaiAuthKit(config);
    }

    /**
     * Auto-initialize on DOMContentLoaded if data attribute present
     */
    document.addEventListener('DOMContentLoaded', () => {
        const autoInit = document.querySelectorAll('[data-kai-auth-kit]');
        autoInit.forEach(el => {
            const config = el.dataset.kaiAuthKitConfig;
            const options = config ? JSON.parse(config) : {};
            options.container = el;
            new KaiAuthKit(options);
        });
    });

    // Export
    global.KaiAuthKit = KaiAuthKit;
    global.createAuthKit = createAuthKit;

})(typeof window !== 'undefined' ? window : this);
