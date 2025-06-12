// This would be primarily frontend functionality using Web Speech API
// But we can add some backend support for language processing

const supportedLanguages = {
    en: 'English',
    fr: 'French',
  };
  
  const validateLanguage = (lang) => {
    return supportedLanguages[lang] ? lang : 'en';
  };
  
  const getSupportedLanguages = () => {
    return supportedLanguages;
  };
  
  module.exports = {
    validateLanguage,
    getSupportedLanguages,
  };