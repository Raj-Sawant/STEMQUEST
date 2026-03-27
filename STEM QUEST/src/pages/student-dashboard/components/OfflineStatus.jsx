import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OfflineStatus = ({ cachedContent, syncStatus }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSyncTime, setLastSyncTime] = useState(new Date());

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const formatLastSync = () => {
    const now = new Date();
    const diff = now - lastSyncTime;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const handleSync = () => {
    setLastSyncTime(new Date());
    // Simulate sync process
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-card border border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-heading font-semibold text-foreground">
          Offline Content
        </h2>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${
          isOnline 
            ? 'bg-success/10 text-success' :'bg-warning/10 text-warning'
        }`}>
          <Icon name={isOnline ? 'Wifi' : 'WifiOff'} size={14} />
          <span>{isOnline ? 'Online' : 'Offline'}</span>
        </div>
      </div>
      {/* Cached Content Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <Icon name="Download" size={20} color="var(--color-primary)" className="mx-auto mb-2" />
          <p className="text-lg font-bold text-foreground">{cachedContent?.games}</p>
          <p className="text-xs text-text-secondary">Games Available</p>
        </div>
        
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <Icon name="HardDrive" size={20} color="var(--color-secondary)" className="mx-auto mb-2" />
          <p className="text-lg font-bold text-foreground">{cachedContent?.size}</p>
          <p className="text-xs text-text-secondary">Storage Used</p>
        </div>
      </div>
      {/* Sync Status */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              syncStatus?.progress === 100 
                ? 'bg-success/10' :'bg-primary/10'
            }`}>
              <Icon 
                name={syncStatus?.progress === 100 ? 'CheckCircle' : 'RefreshCw'} 
                size={16} 
                color={syncStatus?.progress === 100 ? 'var(--color-success)' : 'var(--color-primary)'}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {syncStatus?.progress === 100 ? 'All synced' : 'Syncing progress...'}
              </p>
              <p className="text-xs text-text-secondary">
                Last sync: {formatLastSync()}
              </p>
            </div>
          </div>
          
          {isOnline && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSync}
              iconName="RefreshCw" 
              iconSize={14}
            >
              Sync
            </Button>
          )}
        </div>

        {/* Sync Progress Bar */}
        {syncStatus?.progress < 100 && (
          <div className="w-full h-2 bg-border rounded-full">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${syncStatus?.progress}%` }}
            />
          </div>
        )}

        {/* Offline Tips */}
        {!isOnline && (
          <div className="p-3 bg-warning/5 border border-warning/20 rounded-lg">
            <div className="flex items-start space-x-2">
              <Icon name="Info" size={16} color="var(--color-warning)" className="mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Offline Mode Active</p>
                <p className="text-xs text-text-secondary mt-1">
                  You can continue playing downloaded games. Progress will sync when you're back online.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfflineStatus;