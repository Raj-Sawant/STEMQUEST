import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StorageManager = ({ downloadedGames, totalStorage, usedStorage, onRemoveGame, onClearAll }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const storagePercentage = (usedStorage / totalStorage) * 100;
  
  const getStorageColor = () => {
    if (storagePercentage >= 90) return 'bg-error';
    if (storagePercentage >= 70) return 'bg-warning';
    return 'bg-success';
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(1)) + ' ' + sizes?.[i];
  };

  if (downloadedGames?.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="HardDrive" size={20} color="var(--color-text-secondary)" />
          <h3 className="text-lg font-heading font-semibold text-foreground">Storage Manager</h3>
        </div>
        
        <div className="text-center py-8">
          <Icon name="Download" size={48} color="var(--color-text-secondary)" className="mx-auto mb-4 opacity-50" />
          <p className="text-text-secondary">No games downloaded yet</p>
          <p className="text-sm text-text-secondary mt-1">
            Download games to play offline and manage storage here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="HardDrive" size={20} color="var(--color-text-secondary)" />
          <h3 className="text-lg font-heading font-semibold text-foreground">Storage Manager</h3>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
          iconSize={16}
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </Button>
      </div>
      {/* Storage Usage Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-text-secondary">Storage Used</span>
          <span className="font-mono text-foreground">
            {formatSize(usedStorage)} / {formatSize(totalStorage)}
          </span>
        </div>
        
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${getStorageColor()}`}
            style={{ width: `${Math.min(storagePercentage, 100)}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between text-xs mt-1">
          <span className="text-text-secondary">{storagePercentage?.toFixed(1)}% used</span>
          {storagePercentage >= 90 && (
            <span className="text-error font-medium">Storage almost full</span>
          )}
        </div>
      </div>
      {/* Quick Actions */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-text-secondary">
          {downloadedGames?.length} game{downloadedGames?.length !== 1 ? 's' : ''} downloaded
        </span>
        
        {downloadedGames?.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
            iconName="Trash2"
            iconPosition="left"
            iconSize={14}
          >
            Clear All
          </Button>
        )}
      </div>
      {/* Downloaded Games List */}
      {isExpanded && (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {downloadedGames?.map((game) => (
            <div key={game?.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={game?.thumbnail}
                    alt={game?.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/assets/images/no_image.png';
                    }}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-body font-medium text-foreground truncate">
                    {game?.title}
                  </h4>
                  <div className="flex items-center space-x-2 text-xs text-text-secondary">
                    <span>{game?.subject}</span>
                    <span>•</span>
                    <span>{game?.fileSize}</span>
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveGame(game?.id)}
                iconName="Trash2"
                iconSize={14}
                className="text-error hover:text-error hover:bg-error/10"
              >
                <span className="sr-only">Remove {game?.title}</span>
              </Button>
            </div>
          ))}
        </div>
      )}
      {/* Storage Tips */}
      {storagePercentage >= 70 && (
        <div className="mt-4 p-3 bg-warning/10 rounded-lg border border-warning/20">
          <div className="flex items-start space-x-2">
            <Icon name="AlertTriangle" size={16} color="var(--color-warning)" className="mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-warning mb-1">Storage Running Low</p>
              <p className="text-xs text-text-secondary">
                Consider removing unused games to free up space for new downloads.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorageManager;