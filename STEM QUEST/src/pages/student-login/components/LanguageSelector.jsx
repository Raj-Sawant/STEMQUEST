import React, { useState, useEffect } from 'react';
import Select from '../../../components/ui/Select';


const LanguageSelector = ({ currentLanguage, onLanguageChange }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'हिंदी (Hindi)' },
    { value: 'bn', label: 'বাংলা (Bengali)' },
    { value: 'te', label: 'తెలుగు (Telugu)' },
    { value: 'mr', label: 'मराठी (Marathi)' },
    { value: 'ta', label: 'தமிழ் (Tamil)' },
    { value: 'gu', label: 'ગુજરાતી (Gujarati)' },
    { value: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
    { value: 'ml', label: 'മലയാളം (Malayalam)' },
    { value: 'or', label: 'ଓଡ଼ିଆ (Odia)' }
  ];

  useEffect(() => {
    // Load saved language preference from localStorage
    const savedLanguage = localStorage.getItem('stemquest_language');
    if (savedLanguage && savedLanguage !== selectedLanguage) {
      setSelectedLanguage(savedLanguage);
      onLanguageChange(savedLanguage);
    }
  }, []);

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    localStorage.setItem('stemquest_language', language);
    onLanguageChange(language);
  };

  return (
    <div className="w-full max-w-xs">
      <Select
        label=""
        placeholder="Select Language"
        options={languageOptions}
        value={selectedLanguage}
        onChange={handleLanguageChange}
        searchable
        className="text-sm"
      />
    </div>
  );
};

export default LanguageSelector;