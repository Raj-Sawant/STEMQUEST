import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OfflineSyncStatus = ({ syncData, onManualSync }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSyncTime, setLastSyncTime] = useState(syncData?.lastSync);
  const [isSyncing, setIsSyncing] = useState(false);

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

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      await onManualSync?.();
      setLastSyncTime(new Date()?.toISOString());
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const formatLastSync = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return date?.toLocaleDateString();
  };

  const getPendingChangesCount = () => {
    return (syncData?.pendingProgress || 0) + 
           (syncData?.pendingAchievements || 0) + 
           (syncData?.pendingGameData || 0);
  };

  const getSyncStatusColor = () => {
    if (!isOnline) return 'text-warning';
    if (getPendingChangesCount() > 0) return 'text-error';
    return 'text-success';
  };

  const getSyncStatusIcon = () => {
    if (isSyncing) return 'RefreshCw';
    if (!isOnline) return 'WifiOff';
    if (getPendingChangesCount() > 0) return 'AlertCircle';
    return 'CheckCircle';
  };

  const getSyncStatusText = () => {
    if (isSyncing) return 'Syncing...';
    if (!isOnline) return 'Offline Mode';
    if (getPendingChangesCount() > 0) return 'Sync Pending';
    return 'All Synced';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-heading font-semibold text-foreground">Sync Status</h3>
        <div className={`flex items-center space-x-2 ${getSyncStatusColor()}`}>
          <Icon 
            name={getSyncStatusIcon()} 
            size={18} 
            className={isSyncing ? 'animate-spin' : ''}
          />
          <span className="text-sm font-body font-medium">{getSyncStatusText()}</span>
        </div>
      </div>
      {/* Connection Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
          <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-success' : 'bg-error'}`} />
          <div>
            <div className="text-sm font-body font-medium text-foreground">
              {isOnline ? 'Connected' : 'Offline'}
            </div>
            <div className="text-xs text-text-secondary">
              {isOnline ? 'Real-time sync available' : 'Data saved locally'}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
          <Icon name="Clock" size={16} color="var(--color-text-secondary)" />
          <div>
            <div className="text-sm font-body font-medium text-foreground">Last Sync</div>
            <div className="text-xs text-text-secondary">{formatLastSync(lastSyncTime)}</div>
          </div>
        </div>
      </div>
      {/* Pending Changes */}
      {getPendingChangesCount() > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-body font-medium text-foreground mb-3">Pending Changes</h4>
          <div className="space-y-2">
            {syncData?.pendingProgress > 0 && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Icon name="TrendingUp" size={14} color="var(--color-text-secondary)" />
                  <span className="text-text-secondary">Progress Updates</span>
                </div>
                <span className="text-foreground font-body font-medium">{syncData?.pendingProgress}</span>
              </div>
            )}
            {syncData?.pendingAchievements > 0 && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Icon name="Award" size={14} color="var(--color-text-secondary)" />
                  <span className="text-text-secondary">New Achievements</span>
                </div>
                <span className="text-foreground font-body font-medium">{syncData?.pendingAchievements}</span>
              </div>
            )}
            {syncData?.pendingGameData > 0 && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Icon name="Gamepad2" size={14} color="var(--color-text-secondary)" />
                  <span className="text-text-secondary">Game Sessions</span>
                </div>
                <span className="text-foreground font-body font-medium">{syncData?.pendingGameData}</span>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Sync Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="text-sm text-text-secondary">
          {isOnline ? (
            getPendingChangesCount() > 0 ? (
              `${getPendingChangesCount()} items waiting to sync`
            ) : (
              'All data is up to date'
            )
          ) : (
            'Data will sync when connection is restored'
          )}
        </div>
        
        {isOnline && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualSync}
            loading={isSyncing}
            iconName="RefreshCw"
            iconPosition="left"
            disabled={isSyncing}
          >
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </Button>
        )}
      </div>
      {/* Storage Info */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Icon name="HardDrive" size={14} color="var(--color-text-secondary)" />
            <span className="text-text-secondary">Local Storage</span>
          </div>
          <span className="text-foreground">
            {syncData?.storageUsed}MB / {syncData?.storageLimit}MB
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-1 mt-2">
          <div 
            className="bg-primary h-1 rounded-full transition-all duration-300"
            style={{ width: `${(syncData?.storageUsed / syncData?.storageLimit) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default OfflineSyncStatus;