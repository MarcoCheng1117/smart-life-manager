import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import enTranslations from './locales/en.json';
import zhTranslations from './locales/zh-Hant.json';

// Configure i18next
i18n
  .use(initReactI18next)
  .init({
    // Default language
    lng: localStorage.getItem('language') || 'en',
    
    // Fallback language
    fallbackLng: 'en',
    
    // Debug mode (set to false in production)
    debug: process.env.NODE_ENV === 'development',
    
    // Interpolation options
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    // Resources (translations)
    resources: {
      en: {
        translation: enTranslations,
      },
      'zh-Hant': {
        translation: zhTranslations,
      },
    },
    
    // Namespace options
    defaultNS: 'translation',
    ns: ['translation'],
    
    // Detection options
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    
    // React options
    react: {
      useSuspense: false,
    },
  });

// Export the configured i18n instance
export default i18n;

// Export language utilities
export const languages = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
  },
  'zh-Hant': {
    code: 'zh-Hant',
    name: 'Traditional Chinese',
    nativeName: '繁體中文',
    flag: '🇹🇼',
  },
};

// Language change utility
export const changeLanguage = (languageCode) => {
  i18n.changeLanguage(languageCode);
  localStorage.setItem('language', languageCode);
  
  // Update document language attribute
  document.documentElement.lang = languageCode;
  
  // Dispatch custom event for language change
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: languageCode }));
};

// Get current language info
export const getCurrentLanguage = () => {
  const currentLang = i18n.language;
  return languages[currentLang] || languages.en;
};

// Get available languages
export const getAvailableLanguages = () => Object.values(languages);

// Check if language is RTL
export const isRTL = (languageCode) => {
  const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
  return rtlLanguages.includes(languageCode);
};

// Format date based on language
export const formatDate = (date, options = {}) => {
  const currentLang = i18n.language;
  const locale = currentLang === 'zh-Hant' ? 'zh-TW' : 'en-US';
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(new Date(date));
};

// Format number based on language
export const formatNumber = (number, options = {}) => {
  const currentLang = i18n.language;
  const locale = currentLang === 'zh-Hant' ? 'zh-TW' : 'en-US';
  
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(number);
};

// Format currency based on language
export const formatCurrency = (amount, currency = 'USD', options = {}) => {
  const currentLang = i18n.language;
  const locale = currentLang === 'zh-Hant' ? 'zh-TW' : 'en-US';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(amount);
};

// Format relative time based on language
export const formatRelativeTime = (date, options = {}) => {
  const currentLang = i18n.language;
  const locale = currentLang === 'zh-Hant' ? 'zh-TW' : 'en-US';
  
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
  
  const relativeTimeFormatter = new Intl.RelativeTimeFormat(locale, {
    numeric: 'auto',
    ...options,
  });
  
  if (diffInSeconds < 60) {
    return relativeTimeFormatter.format(-diffInSeconds, 'second');
  } else if (diffInSeconds < 3600) {
    return relativeTimeFormatter.format(-Math.floor(diffInSeconds / 60), 'minute');
  } else if (diffInSeconds < 86400) {
    return relativeTimeFormatter.format(-Math.floor(diffInSeconds / 3600), 'hour');
  } else if (diffInSeconds < 2592000) {
    return relativeTimeFormatter.format(-Math.floor(diffInSeconds / 86400), 'day');
  } else if (diffInSeconds < 31536000) {
    return relativeTimeFormatter.format(-Math.floor(diffInSeconds / 2592000), 'month');
  } else {
    return relativeTimeFormatter.format(-Math.floor(diffInSeconds / 31536000), 'year');
  }
}; 