import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const OfflineIndicator = ({ 
  isOffline = false, 
  syncStatus = 'synced', 
  pendingActions = 0,
  onRetrySync 
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(new Date());

  useEffect(() => {
    if (!isOffline && syncStatus === 'synced') {
      setLastSyncTime(new Date());
    }
  }, [isOffline, syncStatus]);

  const getSyncStatusInfo = () => {
    switch (syncStatus) {
      case 'syncing':
        return {
          icon: 'RefreshCw',
          text: 'Syncing...',
          color: 'text-primary',
          bgColor: 'bg-primary/10'
        };
      case 'error':
        return {
          icon: 'AlertCircle',
          text: 'Sync Error',
          color: 'text-destructive',
          bgColor: 'bg-destructive/10'
        };
      case 'pending':
        return {
          icon: 'Clock',
          text: 'Sync Pending',
          color: 'text-warning',
          bgColor: 'bg-warning/10'
        };
      default:
        return {
          icon: 'CheckCircle',
          text: 'Synced',
          color: 'text-success',
          bgColor: 'bg-success/10'
        };
    }
  };

  const formatLastSync = () => {
    const now = new Date();
    const diffMs = now - lastSyncTime;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return lastSyncTime?.toLocaleDateString();
  };

  const statusInfo = getSyncStatusInfo();

  return (
    <div className="fixed bottom-4 left-4 z-100">
      <div 
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg shadow-sm border cursor-pointer transition-all duration-200 ${
          isOffline 
            ? 'bg-warning/10 border-warning/20 text-warning' 
            : `${statusInfo?.bgColor} border-border ${statusInfo?.color}`
        }`}
        onClick={() => setShowDetails(!showDetails)}
      >
        <Icon 
          name={isOffline ? 'WifiOff' : statusInfo?.icon} 
          size={16} 
          className={syncStatus === 'syncing' ? 'animate-spin' : ''}
        />
        <span className="text-sm font-medium">
          {isOffline ? 'Offline Mode' : statusInfo?.text}
        </span>
        {pendingActions > 0 && (
          <span className="bg-warning text-warning-foreground text-xs px-1.5 py-0.5 rounded-full">
            {pendingActions}
          </span>
        )}
        <Icon 
          name={showDetails ? 'ChevronUp' : 'ChevronDown'} 
          size={14} 
        />
      </div>
      {/* Details Panel */}
      {showDetails && (
        <div className="mt-2 bg-surface border border-border rounded-lg shadow-modal p-4 min-w-64 animate-slide-up">
          <div className="space-y-3">
            {/* Connection Status */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Connection</span>
              <div className="flex items-center space-x-1">
                <Icon 
                  name={isOffline ? 'WifiOff' : 'Wifi'} 
                  size={14} 
                  color={isOffline ? 'var(--color-warning)' : 'var(--color-success)'}
                />
                <span className={`text-sm font-medium ${
                  isOffline ? 'text-warning' : 'text-success'
                }`}>
                  {isOffline ? 'Offline' : 'Online'}
                </span>
              </div>
            </div>

            {/* Sync Status */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Data Sync</span>
              <div className="flex items-center space-x-1">
                <Icon 
                  name={statusInfo?.icon} 
                  size={14} 
                  color={`var(--color-${statusInfo?.color?.split('-')?.[1]})`}
                  className={syncStatus === 'syncing' ? 'animate-spin' : ''}
                />
                <span className={`text-sm font-medium ${statusInfo?.color}`}>
                  {statusInfo?.text}
                </span>
              </div>
            </div>

            {/* Last Sync Time */}
            {!isOffline && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Last Sync</span>
                <span className="text-sm text-foreground">{formatLastSync()}</span>
              </div>
            )}

            {/* Pending Actions */}
            {pendingActions > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Pending</span>
                <span className="text-sm text-warning font-medium">
                  {pendingActions} action{pendingActions !== 1 ? 's' : ''}
                </span>
              </div>
            )}

            {/* Offline Features */}
            {isOffline && (
              <div className="pt-2 border-t border-border">
                <h4 className="text-sm font-medium text-foreground mb-2">Available Offline</h4>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-sm text-success">
                    <Icon name="Check" size={12} />
                    <span>Continue current game</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-success">
                    <Icon name="Check" size={12} />
                    <span>Save progress locally</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-success">
                    <Icon name="Check" size={12} />
                    <span>Access downloaded content</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-text-secondary">
                    <Icon name="X" size={12} />
                    <span>Sync with server</span>
                  </div>
                </div>
              </div>
            )}

            {/* Retry Button */}
            {syncStatus === 'error' && onRetrySync && (
              <div className="pt-2 border-t border-border">
                <button
                  onClick={onRetrySync}
                  className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <Icon name="RefreshCw" size={14} />
                  <span>Retry Sync</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OfflineIndicator;