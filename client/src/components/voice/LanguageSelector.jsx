import { useState } from 'react';
import voiceService from '../../services/voiceService';

const SUPPORTED_LANGUAGES = [
  { code: 'en-US', label: 'English' },
  { code: 'fr-FR', label: 'Français' }
];

const LanguageSelector = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    voiceService.setLanguage(newLang);
  };

  return (
    <select
      value={selectedLanguage}
      onChange={handleLanguageChange}
      className="px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      {SUPPORTED_LANGUAGES.map(lang => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  );
};

export default LanguageSelector;
