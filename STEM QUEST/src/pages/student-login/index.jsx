import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLogo from './components/AppLogo';
import LanguageSelector from './components/LanguageSelector';
import LoginForm from './components/LoginForm';

import SciFiBackground from '../../components/ui/SciFiBackground';

const StudentLogin = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const userData = localStorage.getItem('stemquest_user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user?.isAuthenticated) {
          if (user.role === 'teacher') {
            navigate('/student-analytics');
          } else {
            navigate('/student-dashboard');
          }
          return;
        }
      } catch (error) {
        localStorage.removeItem('stemquest_user');
      }
    }

    // Load saved language preference
    const savedLanguage = localStorage.getItem('stemquest_language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }

    // Set up online/offline listeners
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [navigate]);

  const handleLanguageChange = (language) => {
    setCurrentLanguage(language);
  };

  return (
    <div className="min-h-screen bg-transparent relative overflow-x-hidden flex flex-col">
      <SciFiBackground />

      {/* Header */}
      <header className="w-full p-6 bg-slate-950/40 backdrop-blur-md border-b border-blue-500/30 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex-1">
            <LanguageSelector
              currentLanguage={currentLanguage}
              onLanguageChange={handleLanguageChange}
            />
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isOffline ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`}></div>
            <span className="text-[10px] cyber-text text-slate-400">{isOffline ? 'OFFLINE_MODE' : 'CORE_STREAM_ON'}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 lg:p-6 relative z-10">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <div className="mb-10 text-center">
            <div className="inline-block p-4 bg-blue-600/10 rounded-2xl border border-blue-500/30 mb-4 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
              <AppLogo language={currentLanguage} />
            </div>
            <h2 className="text-sm cyber-text text-blue-400 opacity-60 tracking-[0.5em]">AUTH_PROTOCOL_V4</h2>
          </div>

          {/* Login Card */}
          <div className="console-panel p-10 border-t-4 border-t-blue-500">
            <LoginForm
              language={currentLanguage}
              isOffline={isOffline}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full p-6 bg-slate-950/40 backdrop-blur-md border-t border-blue-500/20 z-10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[10px] cyber-text text-slate-500 tracking-widest">
            SYSTEM_TIME: {new Date()?.getFullYear()} STEM_QUEST
          </p>
        </div>
      </footer>
    </div>
  );
};

export default StudentLogin;