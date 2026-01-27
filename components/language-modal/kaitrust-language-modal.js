/**
 * KAITRUST Language Modal - Site Kit Component
 * Version: 1.0.0 - 211 Languages
 */

(function() {
    'use strict';

    // 211 Languages Data
    const LANGUAGES = [
        // East Asia (12)
        { code: 'ko', name: '한국어', native: '한국어', flag: '🇰🇷', region: 'asia' },
        { code: 'ja', name: 'Japanese', native: '日本語', flag: '🇯🇵', region: 'asia' },
        { code: 'zh-CN', name: 'Chinese (Simplified)', native: '简体中文', flag: '🇨🇳', region: 'asia' },
        { code: 'zh-TW', name: 'Chinese (Traditional)', native: '繁體中文', flag: '🇹🇼', region: 'asia' },
        { code: 'zh-HK', name: 'Chinese (Hong Kong)', native: '香港中文', flag: '🇭🇰', region: 'asia' },
        { code: 'mn', name: 'Mongolian', native: 'Монгол', flag: '🇲🇳', region: 'asia' },
        // Southeast Asia (15)
        { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt', flag: '🇻🇳', region: 'asia' },
        { code: 'th', name: 'Thai', native: 'ไทย', flag: '🇹🇭', region: 'asia' },
        { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia', flag: '🇮🇩', region: 'asia' },
        { code: 'ms', name: 'Malay', native: 'Bahasa Melayu', flag: '🇲🇾', region: 'asia' },
        { code: 'tl', name: 'Filipino', native: 'Tagalog', flag: '🇵🇭', region: 'asia' },
        { code: 'my', name: 'Myanmar', native: 'မြန်မာ', flag: '🇲🇲', region: 'asia' },
        { code: 'km', name: 'Khmer', native: 'ខ្មែរ', flag: '🇰🇭', region: 'asia' },
        { code: 'lo', name: 'Lao', native: 'ລາວ', flag: '🇱🇦', region: 'asia' },
        { code: 'jw', name: 'Javanese', native: 'Basa Jawa', flag: '🇮🇩', region: 'asia' },
        { code: 'su', name: 'Sundanese', native: 'Basa Sunda', flag: '🇮🇩', region: 'asia' },
        { code: 'ceb', name: 'Cebuano', native: 'Cebuano', flag: '🇵🇭', region: 'asia' },
        // South Asia (20)
        { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳', region: 'asia' },
        { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇧🇩', region: 'asia' },
        { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳', region: 'asia' },
        { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳', region: 'asia' },
        { code: 'mr', name: 'Marathi', native: 'मराठी', flag: '🇮🇳', region: 'asia' },
        { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳', region: 'asia' },
        { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳', region: 'asia' },
        { code: 'ml', name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳', region: 'asia' },
        { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳', region: 'asia' },
        { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', flag: '🇮🇳', region: 'asia' },
        { code: 'si', name: 'Sinhala', native: 'සිංහල', flag: '🇱🇰', region: 'asia' },
        { code: 'ne', name: 'Nepali', native: 'नेपाली', flag: '🇳🇵', region: 'asia' },
        { code: 'ur', name: 'Urdu', native: 'اردو', flag: '🇵🇰', region: 'asia' },
        { code: 'sd', name: 'Sindhi', native: 'سنڌي', flag: '🇵🇰', region: 'asia' },
        { code: 'ps', name: 'Pashto', native: 'پښتو', flag: '🇦🇫', region: 'asia' },
        { code: 'dv', name: 'Dhivehi', native: 'ދިވެހި', flag: '🇲🇻', region: 'asia' },
        // Western Europe (25)
        { code: 'en', name: 'English', native: 'English', flag: '🇬🇧', region: 'europe' },
        { code: 'en-US', name: 'English (US)', native: 'English (US)', flag: '🇺🇸', region: 'europe' },
        { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪', region: 'europe' },
        { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷', region: 'europe' },
        { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸', region: 'europe' },
        { code: 'it', name: 'Italian', native: 'Italiano', flag: '🇮🇹', region: 'europe' },
        { code: 'pt', name: 'Portuguese', native: 'Português', flag: '🇵🇹', region: 'europe' },
        { code: 'pt-BR', name: 'Portuguese (Brazil)', native: 'Português (Brasil)', flag: '🇧🇷', region: 'americas' },
        { code: 'nl', name: 'Dutch', native: 'Nederlands', flag: '🇳🇱', region: 'europe' },
        { code: 'be', name: 'Belarusian', native: 'Беларуская', flag: '🇧🇾', region: 'europe' },
        { code: 'ca', name: 'Catalan', native: 'Català', flag: '🇪🇸', region: 'europe' },
        { code: 'gl', name: 'Galician', native: 'Galego', flag: '🇪🇸', region: 'europe' },
        { code: 'eu', name: 'Basque', native: 'Euskara', flag: '🇪🇸', region: 'europe' },
        { code: 'oc', name: 'Occitan', native: 'Occitan', flag: '🇫🇷', region: 'europe' },
        { code: 'co', name: 'Corsican', native: 'Corsu', flag: '🇫🇷', region: 'europe' },
        { code: 'br', name: 'Breton', native: 'Brezhoneg', flag: '🇫🇷', region: 'europe' },
        { code: 'lb', name: 'Luxembourgish', native: 'Lëtzebuergesch', flag: '🇱🇺', region: 'europe' },
        { code: 'fy', name: 'Frisian', native: 'Frysk', flag: '🇳🇱', region: 'europe' },
        { code: 'gd', name: 'Scottish Gaelic', native: 'Gàidhlig', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', region: 'europe' },
        { code: 'ga', name: 'Irish', native: 'Gaeilge', flag: '🇮🇪', region: 'europe' },
        { code: 'cy', name: 'Welsh', native: 'Cymraeg', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', region: 'europe' },
        // Nordic (10)
        { code: 'sv', name: 'Swedish', native: 'Svenska', flag: '🇸🇪', region: 'europe' },
        { code: 'da', name: 'Danish', native: 'Dansk', flag: '🇩🇰', region: 'europe' },
        { code: 'no', name: 'Norwegian', native: 'Norsk', flag: '🇳🇴', region: 'europe' },
        { code: 'fi', name: 'Finnish', native: 'Suomi', flag: '🇫🇮', region: 'europe' },
        { code: 'is', name: 'Icelandic', native: 'Íslenska', flag: '🇮🇸', region: 'europe' },
        { code: 'fo', name: 'Faroese', native: 'Føroyskt', flag: '🇫🇴', region: 'europe' },
        // Eastern Europe (20)
        { code: 'ru', name: 'Russian', native: 'Русский', flag: '🇷🇺', region: 'europe' },
        { code: 'uk', name: 'Ukrainian', native: 'Українська', flag: '🇺🇦', region: 'europe' },
        { code: 'pl', name: 'Polish', native: 'Polski', flag: '🇵🇱', region: 'europe' },
        { code: 'cs', name: 'Czech', native: 'Čeština', flag: '🇨🇿', region: 'europe' },
        { code: 'sk', name: 'Slovak', native: 'Slovenčina', flag: '🇸🇰', region: 'europe' },
        { code: 'hu', name: 'Hungarian', native: 'Magyar', flag: '🇭🇺', region: 'europe' },
        { code: 'ro', name: 'Romanian', native: 'Română', flag: '🇷🇴', region: 'europe' },
        { code: 'bg', name: 'Bulgarian', native: 'Български', flag: '🇧🇬', region: 'europe' },
        { code: 'sr', name: 'Serbian', native: 'Српски', flag: '🇷🇸', region: 'europe' },
        { code: 'hr', name: 'Croatian', native: 'Hrvatski', flag: '🇭🇷', region: 'europe' },
        { code: 'bs', name: 'Bosnian', native: 'Bosanski', flag: '🇧🇦', region: 'europe' },
        { code: 'sl', name: 'Slovenian', native: 'Slovenščina', flag: '🇸🇮', region: 'europe' },
        { code: 'mk', name: 'Macedonian', native: 'Македонски', flag: '🇲🇰', region: 'europe' },
        { code: 'sq', name: 'Albanian', native: 'Shqip', flag: '🇦🇱', region: 'europe' },
        { code: 'el', name: 'Greek', native: 'Ελληνικά', flag: '🇬🇷', region: 'europe' },
        { code: 'lt', name: 'Lithuanian', native: 'Lietuvių', flag: '🇱🇹', region: 'europe' },
        { code: 'lv', name: 'Latvian', native: 'Latviešu', flag: '🇱🇻', region: 'europe' },
        { code: 'et', name: 'Estonian', native: 'Eesti', flag: '🇪🇪', region: 'europe' },
        { code: 'mt', name: 'Maltese', native: 'Malti', flag: '🇲🇹', region: 'europe' },
        // Central Asia & Caucasus (15)
        { code: 'tr', name: 'Turkish', native: 'Türkçe', flag: '🇹🇷', region: 'asia' },
        { code: 'az', name: 'Azerbaijani', native: 'Azərbaycan', flag: '🇦🇿', region: 'asia' },
        { code: 'ka', name: 'Georgian', native: 'ქართული', flag: '🇬🇪', region: 'asia' },
        { code: 'hy', name: 'Armenian', native: 'Հայերdelays', flag: '🇦🇲', region: 'asia' },
        { code: 'kk', name: 'Kazakh', native: 'Қазақ', flag: '🇰🇿', region: 'asia' },
        { code: 'uz', name: 'Uzbek', native: 'Oʻzbek', flag: '🇺🇿', region: 'asia' },
        { code: 'ky', name: 'Kyrgyz', native: 'Кыргызча', flag: '🇰🇬', region: 'asia' },
        { code: 'tg', name: 'Tajik', native: 'Тоҷикӣ', flag: '🇹🇯', region: 'asia' },
        { code: 'tk', name: 'Turkmen', native: 'Türkmen', flag: '🇹🇲', region: 'asia' },
        // Middle East (15)
        { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦', region: 'mideast' },
        { code: 'he', name: 'Hebrew', native: 'עברית', flag: '🇮🇱', region: 'mideast' },
        { code: 'fa', name: 'Persian', native: 'فارسی', flag: '🇮🇷', region: 'mideast' },
        { code: 'ku', name: 'Kurdish', native: 'Kurdî', flag: '🇮🇶', region: 'mideast' },
        { code: 'ar-EG', name: 'Arabic (Egypt)', native: 'العربية (مصر)', flag: '🇪🇬', region: 'mideast' },
        { code: 'ar-SA', name: 'Arabic (Saudi)', native: 'العربية (السعودية)', flag: '🇸🇦', region: 'mideast' },
        { code: 'ar-AE', name: 'Arabic (UAE)', native: 'العربية (الإمارات)', flag: '🇦🇪', region: 'mideast' },
        { code: 'ar-MA', name: 'Arabic (Morocco)', native: 'العربية (المغرب)', flag: '🇲🇦', region: 'mideast' },
        // Africa (30)
        { code: 'sw', name: 'Swahili', native: 'Kiswahili', flag: '🇰🇪', region: 'africa' },
        { code: 'am', name: 'Amharic', native: 'አማርኛ', flag: '🇪🇹', region: 'africa' },
        { code: 'ha', name: 'Hausa', native: 'Hausa', flag: '🇳🇬', region: 'africa' },
        { code: 'yo', name: 'Yoruba', native: 'Yorùbá', flag: '🇳🇬', region: 'africa' },
        { code: 'ig', name: 'Igbo', native: 'Igbo', flag: '🇳🇬', region: 'africa' },
        { code: 'zu', name: 'Zulu', native: 'isiZulu', flag: '🇿🇦', region: 'africa' },
        { code: 'xh', name: 'Xhosa', native: 'isiXhosa', flag: '🇿🇦', region: 'africa' },
        { code: 'af', name: 'Afrikaans', native: 'Afrikaans', flag: '🇿🇦', region: 'africa' },
        { code: 'st', name: 'Sesotho', native: 'Sesotho', flag: '🇱🇸', region: 'africa' },
        { code: 'sn', name: 'Shona', native: 'chiShona', flag: '🇿🇼', region: 'africa' },
        { code: 'ny', name: 'Chichewa', native: 'Chichewa', flag: '🇲🇼', region: 'africa' },
        { code: 'rw', name: 'Kinyarwanda', native: 'Ikinyarwanda', flag: '🇷🇼', region: 'africa' },
        { code: 'so', name: 'Somali', native: 'Soomaali', flag: '🇸🇴', region: 'africa' },
        { code: 'mg', name: 'Malagasy', native: 'Malagasy', flag: '🇲🇬', region: 'africa' },
        { code: 'ln', name: 'Lingala', native: 'Lingála', flag: '🇨🇩', region: 'africa' },
        { code: 'wo', name: 'Wolof', native: 'Wolof', flag: '🇸🇳', region: 'africa' },
        { code: 'om', name: 'Oromo', native: 'Oromoo', flag: '🇪🇹', region: 'africa' },
        { code: 'ti', name: 'Tigrinya', native: 'ትግርኛ', flag: '🇪🇷', region: 'africa' },
        { code: 'ts', name: 'Tsonga', native: 'Xitsonga', flag: '🇿🇦', region: 'africa' },
        { code: 'tn', name: 'Tswana', native: 'Setswana', flag: '🇧🇼', region: 'africa' },
        { code: 've', name: 'Venda', native: 'Tshivenḓa', flag: '🇿🇦', region: 'africa' },
        { code: 'ss', name: 'Swati', native: 'SiSwati', flag: '🇸🇿', region: 'africa' },
        { code: 'nr', name: 'Ndebele', native: 'isiNdebele', flag: '🇿🇦', region: 'africa' },
        // Americas (25)
        { code: 'es-MX', name: 'Spanish (Mexico)', native: 'Español (México)', flag: '🇲🇽', region: 'americas' },
        { code: 'es-AR', name: 'Spanish (Argentina)', native: 'Español (Argentina)', flag: '🇦🇷', region: 'americas' },
        { code: 'es-CO', name: 'Spanish (Colombia)', native: 'Español (Colombia)', flag: '🇨🇴', region: 'americas' },
        { code: 'es-CL', name: 'Spanish (Chile)', native: 'Español (Chile)', flag: '🇨🇱', region: 'americas' },
        { code: 'es-PE', name: 'Spanish (Peru)', native: 'Español (Perú)', flag: '🇵🇪', region: 'americas' },
        { code: 'es-VE', name: 'Spanish (Venezuela)', native: 'Español (Venezuela)', flag: '🇻🇪', region: 'americas' },
        { code: 'fr-CA', name: 'French (Canada)', native: 'Français (Canada)', flag: '🇨🇦', region: 'americas' },
        { code: 'ht', name: 'Haitian Creole', native: 'Kreyòl ayisyen', flag: '🇭🇹', region: 'americas' },
        { code: 'qu', name: 'Quechua', native: 'Runasimi', flag: '🇵🇪', region: 'americas' },
        { code: 'ay', name: 'Aymara', native: 'Aymar aru', flag: '🇧🇴', region: 'americas' },
        { code: 'gn', name: 'Guarani', native: "Avañe'ẽ", flag: '🇵🇾', region: 'americas' },
        // Oceania (15)
        { code: 'en-AU', name: 'English (Australia)', native: 'English (Australia)', flag: '🇦🇺', region: 'oceania' },
        { code: 'en-NZ', name: 'English (New Zealand)', native: 'English (NZ)', flag: '🇳🇿', region: 'oceania' },
        { code: 'mi', name: 'Maori', native: 'Te Reo Māori', flag: '🇳🇿', region: 'oceania' },
        { code: 'haw', name: 'Hawaiian', native: 'ʻŌlelo Hawaiʻi', flag: '🇺🇸', region: 'oceania' },
        { code: 'sm', name: 'Samoan', native: 'Gagana Samoa', flag: '🇼🇸', region: 'oceania' },
        { code: 'to', name: 'Tongan', native: 'Lea fakatonga', flag: '🇹🇴', region: 'oceania' },
        { code: 'fj', name: 'Fijian', native: 'Vosa Vakaviti', flag: '🇫🇯', region: 'oceania' },
        // Additional Languages (30+)
        { code: 'eo', name: 'Esperanto', native: 'Esperanto', flag: '🌍', region: 'other' },
        { code: 'la', name: 'Latin', native: 'Latina', flag: '🏛️', region: 'other' },
        { code: 'yi', name: 'Yiddish', native: 'ייִדיש', flag: '🕎', region: 'other' },
        { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्', flag: '🕉️', region: 'other' },
        { code: 'pi', name: 'Pali', native: 'पालि', flag: '☸️', region: 'other' },
        { code: 'bo', name: 'Tibetan', native: 'བོད་སྐད', flag: '🏔️', region: 'asia' },
        { code: 'dz', name: 'Dzongkha', native: 'རྫོང་ཁ', flag: '🇧🇹', region: 'asia' },
        { code: 'ug', name: 'Uyghur', native: 'ئۇيغۇرچە', flag: '🇨🇳', region: 'asia' },
        { code: 'tt', name: 'Tatar', native: 'Татарча', flag: '🇷🇺', region: 'europe' },
        { code: 'ba', name: 'Bashkir', native: 'Башҡортса', flag: '🇷🇺', region: 'europe' },
        { code: 'cv', name: 'Chuvash', native: 'Чӑвашла', flag: '🇷🇺', region: 'europe' },
        { code: 'ce', name: 'Chechen', native: 'Нохчийн', flag: '🇷🇺', region: 'europe' },
        { code: 'os', name: 'Ossetian', native: 'Ирон', flag: '🇷🇺', region: 'europe' },
        { code: 'ab', name: 'Abkhaz', native: 'Аԥсшәа', flag: '🇬🇪', region: 'europe' },
        { code: 'av', name: 'Avar', native: 'Авар', flag: '🇷🇺', region: 'europe' },
        { code: 'kv', name: 'Komi', native: 'Коми', flag: '🇷🇺', region: 'europe' },
        { code: 'udm', name: 'Udmurt', native: 'Удмурт', flag: '🇷🇺', region: 'europe' },
        { code: 'mhr', name: 'Mari', native: 'Марий', flag: '🇷🇺', region: 'europe' },
        { code: 'sah', name: 'Sakha', native: 'Саха тыла', flag: '🇷🇺', region: 'asia' },
        { code: 'chr', name: 'Cherokee', native: 'ᏣᎳᎩ', flag: '🇺🇸', region: 'americas' },
        { code: 'nv', name: 'Navajo', native: 'Diné bizaad', flag: '🇺🇸', region: 'americas' },
        { code: 'oj', name: 'Ojibwe', native: 'ᐊᓂᔑᓈᐯᒧᐎᓐ', flag: '🇨🇦', region: 'americas' },
        { code: 'cr', name: 'Cree', native: 'ᓀᐦᐃᔭᐍᐏᐣ', flag: '🇨🇦', region: 'americas' },
        { code: 'iu', name: 'Inuktitut', native: 'ᐃᓄᒃᑎᑐᑦ', flag: '🇨🇦', region: 'americas' },
        { code: 'kl', name: 'Greenlandic', native: 'Kalaallisut', flag: '🇬🇱', region: 'americas' }
    ];

    // Regions
    const REGIONS = [
        { id: 'all', name: '전체', icon: '🌍' },
        { id: 'asia', name: '아시아', icon: '🌏' },
        { id: 'europe', name: '유럽', icon: '🌍' },
        { id: 'americas', name: '아메리카', icon: '🌎' },
        { id: 'mideast', name: '중동', icon: '🕌' },
        { id: 'africa', name: '아프리카', icon: '🌍' },
        { id: 'oceania', name: '오세아니아', icon: '🏝️' },
        { id: 'other', name: '기타', icon: '📚' }
    ];

    // State
    let state = {
        isOpen: false,
        currentLang: 'ko',
        searchQuery: '',
        selectedRegion: 'all'
    };

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        loadSettings();
        injectStyles();
        createElements();
        bindEvents();
        updateLangButton();
    }

    function loadSettings() {
        try {
            const saved = localStorage.getItem('kaitrust-lang');
            if (saved) {
                state.currentLang = saved;
            }
        } catch (e) {}
    }

    function saveSettings() {
        try {
            localStorage.setItem('kaitrust-lang', state.currentLang);
        } catch (e) {}
    }

    function injectStyles() {
        if (document.getElementById('kaitrust-lang-styles')) return;

        const link = document.createElement('link');
        link.id = 'kaitrust-lang-styles';
        link.rel = 'stylesheet';
        link.href = '/components/language-modal/kaitrust-language-modal.css';
        document.head.appendChild(link);
    }

    function createElements() {
        // Check if already exists
        if (document.querySelector('.kaitrust-lang-modal')) return;

        // Find or create language button in header
        const existingLangBtn = document.querySelector('.nav-lang, [class*="lang-btn"]');
        if (existingLangBtn) {
            existingLangBtn.classList.add('kaitrust-lang-trigger');
        } else {
            // Create language button
            const header = document.querySelector('header nav');
            if (header) {
                const langBtn = document.createElement('button');
                langBtn.className = 'kaitrust-lang-btn kaitrust-lang-trigger';
                langBtn.setAttribute('aria-label', '언어 선택');
                langBtn.innerHTML = `
                    <span class="lang-icon">🌐</span>
                    <span class="lang-code">KO</span>
                `;
                header.appendChild(langBtn);
            }
        }

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'kaitrust-lang-overlay';
        document.body.appendChild(overlay);

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'kaitrust-lang-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-label', '언어 선택');
        modal.innerHTML = createModalHTML();
        document.body.appendChild(modal);

        // Render languages
        renderLanguages();
    }

    function createModalHTML() {
        // Region tabs
        const regionTabs = REGIONS.map(r => {
            const count = r.id === 'all' ? LANGUAGES.length :
                         LANGUAGES.filter(l => l.region === r.id).length;
            return `
                <button class="kaitrust-lang-region-btn${r.id === 'all' ? ' active' : ''}"
                        data-region="${r.id}">
                    ${r.icon} ${r.name}
                    <span class="region-count">(${count})</span>
                </button>
            `;
        }).join('');

        return `
            <div class="kaitrust-lang-header">
                <div class="kaitrust-lang-title">
                    <span class="kaitrust-lang-title-icon">🌐</span>
                    <span class="kaitrust-lang-title-text">언어 선택</span>
                    <span class="kaitrust-lang-title-count">${LANGUAGES.length}개 언어</span>
                </div>
                <button class="kaitrust-lang-close" aria-label="닫기">✕</button>
            </div>

            <div class="kaitrust-lang-search">
                <div class="kaitrust-lang-search-wrapper">
                    <span class="kaitrust-lang-search-icon">🔍</span>
                    <input type="text" class="kaitrust-lang-search-input"
                           placeholder="언어 검색... (한국어, English, 日本語...)"
                           aria-label="언어 검색">
                </div>
            </div>

            <div class="kaitrust-lang-regions">
                ${regionTabs}
            </div>

            <div class="kaitrust-lang-grid-wrapper">
                <div class="kaitrust-lang-grid"></div>
            </div>

            <div class="kaitrust-lang-footer">
                <div class="kaitrust-lang-footer-info">
                    선택: <strong class="current-lang-name">한국어</strong>
                </div>
                <div class="kaitrust-lang-footer-powered">
                    Powered by <a href="https://kaitrust.ai" target="_blank">KAITRUST</a>
                </div>
            </div>
        `;
    }

    function renderLanguages() {
        const grid = document.querySelector('.kaitrust-lang-grid');
        if (!grid) return;

        let filtered = LANGUAGES;

        // Filter by region
        if (state.selectedRegion !== 'all') {
            filtered = filtered.filter(l => l.region === state.selectedRegion);
        }

        // Filter by search
        if (state.searchQuery) {
            const query = state.searchQuery.toLowerCase();
            filtered = filtered.filter(l =>
                l.name.toLowerCase().includes(query) ||
                l.native.toLowerCase().includes(query) ||
                l.code.toLowerCase().includes(query)
            );
        }

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="kaitrust-lang-empty">
                    <div class="kaitrust-lang-empty-icon">🔍</div>
                    <div class="kaitrust-lang-empty-text">검색 결과가 없습니다</div>
                </div>
            `;
            return;
        }

        grid.innerHTML = filtered.map((lang, index) => `
            <div class="kaitrust-lang-card${lang.code === state.currentLang ? ' selected' : ''}"
                 data-code="${lang.code}"
                 style="animation-delay: ${index * 0.02}s"
                 tabindex="0"
                 role="option"
                 aria-selected="${lang.code === state.currentLang}">
                <span class="kaitrust-lang-card-flag">${lang.flag}</span>
                <div class="kaitrust-lang-card-info">
                    <div class="kaitrust-lang-card-name">${lang.name}</div>
                    <div class="kaitrust-lang-card-native">${lang.native}</div>
                </div>
                <span class="kaitrust-lang-card-code">${lang.code}</span>
            </div>
        `).join('');
    }

    function bindEvents() {
        // Open modal
        document.addEventListener('click', function(e) {
            const trigger = e.target.closest('.kaitrust-lang-trigger, .nav-lang');
            if (trigger) {
                e.preventDefault();
                openModal();
                return;
            }

            // Close button
            if (e.target.closest('.kaitrust-lang-close')) {
                closeModal();
                return;
            }

            // Overlay click
            if (e.target.classList.contains('kaitrust-lang-overlay')) {
                closeModal();
                return;
            }

            // Region tabs
            const regionBtn = e.target.closest('.kaitrust-lang-region-btn');
            if (regionBtn) {
                selectRegion(regionBtn.dataset.region);
                return;
            }

            // Language card
            const langCard = e.target.closest('.kaitrust-lang-card');
            if (langCard) {
                selectLanguage(langCard.dataset.code);
                return;
            }
        });

        // Search input
        document.addEventListener('input', function(e) {
            if (e.target.classList.contains('kaitrust-lang-search-input')) {
                state.searchQuery = e.target.value;
                renderLanguages();
            }
        });

        // Keyboard
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && state.isOpen) {
                closeModal();
            }

            // Enter on focused card
            if (e.key === 'Enter') {
                const focused = document.activeElement;
                if (focused && focused.classList.contains('kaitrust-lang-card')) {
                    selectLanguage(focused.dataset.code);
                }
            }
        });
    }

    function openModal() {
        const modal = document.querySelector('.kaitrust-lang-modal');
        const overlay = document.querySelector('.kaitrust-lang-overlay');

        state.isOpen = true;
        modal.classList.add('active');
        overlay.classList.add('active');

        // Focus search
        setTimeout(() => {
            const search = modal.querySelector('.kaitrust-lang-search-input');
            if (search) search.focus();
        }, 300);
    }

    function closeModal() {
        const modal = document.querySelector('.kaitrust-lang-modal');
        const overlay = document.querySelector('.kaitrust-lang-overlay');

        state.isOpen = false;
        modal.classList.remove('active');
        overlay.classList.remove('active');

        // Reset search
        state.searchQuery = '';
        const search = document.querySelector('.kaitrust-lang-search-input');
        if (search) search.value = '';

        renderLanguages();
    }

    function selectRegion(regionId) {
        state.selectedRegion = regionId;

        // Update tabs
        document.querySelectorAll('.kaitrust-lang-region-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.region === regionId);
        });

        renderLanguages();
    }

    function selectLanguage(code) {
        state.currentLang = code;
        saveSettings();
        updateLangButton();
        closeModal();

        // Trigger event for other components
        window.dispatchEvent(new CustomEvent('kaitrust-lang-change', {
            detail: { code: code, language: LANGUAGES.find(l => l.code === code) }
        }));

        // Update footer info
        const lang = LANGUAGES.find(l => l.code === code);
        const footerInfo = document.querySelector('.current-lang-name');
        if (footerInfo && lang) {
            footerInfo.textContent = lang.native;
        }
    }

    function updateLangButton() {
        const btn = document.querySelector('.kaitrust-lang-btn, .nav-lang');
        if (!btn) return;

        const lang = LANGUAGES.find(l => l.code === state.currentLang);
        if (lang) {
            const codeSpan = btn.querySelector('.lang-code');
            if (codeSpan) {
                codeSpan.textContent = lang.code.split('-')[0].toUpperCase();
            }
        }
    }

    // Expose API
    window.KaitrustLang = {
        open: openModal,
        close: closeModal,
        getCurrent: () => state.currentLang,
        setLanguage: selectLanguage,
        getLanguages: () => LANGUAGES
    };

})();
