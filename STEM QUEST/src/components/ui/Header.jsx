import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ userRole: propRole, isAuthenticated = true, onLogout }) => {
  const [userRole, setUserRole] = useState(propRole || 'student');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const location = useLocation();

  useEffect(() => {
    if (!propRole) {
      const userData = localStorage.getItem('stemquest_user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          if (user.role) setUserRole(user.role);
        } catch (e) { }
      }
    }
  }, [propRole]);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/student-dashboard',
      icon: 'LayoutDashboard',
      roles: ['student', 'teacher']
    },
    {
      label: 'Games',
      path: '/game-library',
      icon: 'Gamepad2',
      roles: ['student', 'teacher']
    },
    {
      label: 'Progress',
      path: '/student-progress',
      icon: 'TrendingUp',
      roles: ['student', 'teacher']
    },
    {
      label: 'Analytics',
      path: '/student-analytics',
      icon: 'BarChart3',
      roles: ['teacher']
    }
  ];

  const visibleItems = navigationItems?.filter(item =>
    item?.roles?.includes(userRole)
  );

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-slate-950/40 backdrop-blur-md border-b border-blue-500/30 z-[100] shadow-2xl">
        <div className="flex items-center justify-between h-20 px-4 lg:px-8">
          {/* Logo */}
          <Link to="/student-dashboard" className="flex items-center space-x-3 group">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.4)] group-hover:scale-110 transition-transform">
              <Icon name="Atom" size={24} color="white" className="animate-[pulse_2s_infinite]" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-white  tracking-tighter leading-none">
                STEM QUEST
              </span>

            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {visibleItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`flex items-center space-x-2 px-6 py-2 rounded-xl text-xs cyber-text transition-all duration-300 ${isActivePath(item?.path)
                  ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] border border-blue-400'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
              >
                <Icon name={item?.icon} size={14} />
                <span>{item?.label}</span>
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Connection Status */}
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-[10px] cyber-text border ${isOffline
              ? 'bg-rose-500/10 text-rose-500 border-rose-500/30' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
              }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${isOffline ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`}></div>
              <span>{isOffline ? 'OFFLINE' : 'SYSTEM_STABLE'}</span>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center border border-indigo-400/50 shadow-lg">
                <Icon name="User" size={20} color="white" />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  try {
                    // Force clear all security tokens
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('studentData');
                    localStorage.removeItem('stemquest_user');
                    localStorage.removeItem('stemquest_language');
                    localStorage.removeItem('selectedLanguage');
                    sessionStorage.clear();

                    onLogout?.();

                    // Absolute redirect ensuring security terminal entry
                    setTimeout(() => {
                      window.location.href = '/student-login';
                    }, 100);
                  } catch (error) {
                    console.error('CRITICAL: TERMINATION_SEQUENCE_FAILURE', error);
                    window.location.href = '/student-login';
                  }
                }}
                className="border-rose-500/30 text-rose-500 hover:bg-rose-500/10 cyber-text text-[10px]"
                iconName="LogOut"
              >
                LOG OUT
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={handleMobileMenuToggle}
            iconName={isMobileMenuOpen ? 'X' : 'Menu'}
            iconSize={20}
          >
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-surface border-t border-border animate-slide-in">
            <nav className="px-4 py-3 space-y-1">
              {visibleItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  onClick={closeMobileMenu}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-body font-medium transition-all duration-200 touch-target ${isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-text-secondary hover:text-foreground hover:bg-muted'
                    }`}
                >
                  <Icon name={item?.icon} size={20} />
                  <span>{item?.label}</span>
                </Link>
              ))}

              {/* Mobile Actions */}
              <div className="pt-3 mt-3 border-t border-border space-y-2">
                {/* Connection Status */}
                <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-caption ${isOffline
                  ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                  }`}>
                  <Icon
                    name={isOffline ? 'WifiOff' : 'Wifi'}
                    size={16}
                  />
                  <span>{isOffline ? 'Offline Mode' : 'Connected'}</span>
                </div>

                {/* User Info */}
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                      <Icon name="User" size={16} color="white" />
                    </div>
                    <span className="text-sm font-body text-foreground">
                      {userRole === 'teacher' ? 'Teacher' : 'Student'}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      try {
                        closeMobileMenu();

                        // Clear authentication data
                        localStorage.removeItem('authToken');
                        localStorage.removeItem('studentData');
                        localStorage.removeItem('stemquest_user');
                        localStorage.removeItem('stemquest_language');
                        sessionStorage.clear();

                        onLogout?.();

                        // Force page redirect as fallback
                        setTimeout(() => {
                          if (window.location?.pathname !== '/student-login') {
                            window.location.href = '/student-login';
                          }
                        }, 100);
                      } catch (error) {
                        console.error('Mobile logout error:', error);
                        // Force redirect on error
                        window.location.href = '/student-login';
                      }
                    }}
                    iconName="LogOut"
                    iconSize={16}
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>
      {/* Spacer for fixed header */}
      <div className="h-20" />
    </>
  );
};

export default Header;