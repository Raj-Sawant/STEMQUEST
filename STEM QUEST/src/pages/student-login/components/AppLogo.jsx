import React from 'react';
import Icon from '../../../components/AppIcon';

const AppLogo = ({ language = 'en' }) => {
  const translations = {
    en: {
      title: 'STEM Quest',
      tagline: 'Learn • Play • Discover'
    },
    hi: {
      title: 'STEM Quest',
      tagline: 'सीखें • खेलें • खोजें'
    },
    bn: {
      title: 'STEM Quest',
      tagline: 'শিখুন • খেলুন • আবিষ্কার করুন'
    }
  };

  const t = translations?.[language] || translations?.en;

  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center mb-4">
        <div className="relative">
          {/* Main logo container */}
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg">
            <Icon name="Atom" size={32} color="white" />
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-pulse"></div>
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-success rounded-full animate-pulse delay-300"></div>
        </div>
      </div>
      <h1 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
        {t?.title}
      </h1>
      <p className="text-text-secondary font-body text-sm lg:text-base">
        {t?.tagline}
      </p>
    </div>
  );
};

export default AppLogo;