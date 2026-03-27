import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AchievementNotification = ({ 
  achievement, 
  isVisible, 
  onClose, 
  autoCloseDelay = 5000 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      
      if (autoCloseDelay > 0) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoCloseDelay);

        return () => clearTimeout(timer);
      }
    }
  }, [isVisible, autoCloseDelay]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  if (!isVisible || !achievement) return null;

  const getAchievementColor = (type) => {
    switch (type) {
      case 'gold': return 'from-yellow-400 to-yellow-600';
      case 'silver': return 'from-gray-300 to-gray-500';
      case 'bronze': return 'from-orange-400 to-orange-600';
      case 'special': return 'from-purple-400 to-purple-600';
      default: return 'from-blue-400 to-blue-600';
    }
  };

  const getAchievementIcon = (category) => {
    switch (category) {
      case 'completion': return 'CheckCircle';
      case 'speed': return 'Zap';
      case 'accuracy': return 'Target';
      case 'streak': return 'Flame';
      case 'exploration': return 'Compass';
      case 'mastery': return 'Crown';
      default: return 'Trophy';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-300 transition-all duration-300 ${
      isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className="bg-surface rounded-lg shadow-modal border border-border p-4 max-w-sm w-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getAchievementColor(achievement?.type)} flex items-center justify-center`}>
              <Icon 
                name={getAchievementIcon(achievement?.category)} 
                size={16} 
                color="white" 
              />
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm">Achievement Unlocked!</h4>
              <p className="text-xs text-text-secondary">{achievement?.type?.toUpperCase()} BADGE</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            iconName="X"
            iconSize={16}
            className="w-6 h-6 -mt-1 -mr-1"
          >
            <span className="sr-only">Close notification</span>
          </Button>
        </div>

        {/* Achievement Details */}
        <div className="space-y-2">
          <h3 className="font-bold text-foreground">{achievement?.title}</h3>
          <p className="text-sm text-text-secondary">{achievement?.description}</p>
          
          {/* Rewards */}
          {achievement?.rewards && (
            <div className="flex items-center space-x-4 pt-2">
              {achievement?.rewards?.points && (
                <div className="flex items-center space-x-1 text-primary">
                  <Icon name="Plus" size={12} />
                  <span className="text-sm font-medium">{achievement?.rewards?.points} XP</span>
                </div>
              )}
              {achievement?.rewards?.badge && (
                <div className="flex items-center space-x-1 text-accent">
                  <Icon name="Award" size={12} />
                  <span className="text-sm font-medium">Badge</span>
                </div>
              )}
              {achievement?.rewards?.unlock && (
                <div className="flex items-center space-x-1 text-success">
                  <Icon name="Unlock" size={12} />
                  <span className="text-sm font-medium">New Content</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Progress Bar (if applicable) */}
        {achievement?.progress && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex justify-between text-xs text-text-secondary mb-1">
              <span>Progress to Next Level</span>
              <span>{achievement?.progress?.current}/{achievement?.progress?.total}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ 
                  width: `${(achievement?.progress?.current / achievement?.progress?.total) * 100}%` 
                }}
              ></div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-4">
          <Button
            variant="primary"
            size="sm"
            onClick={handleClose}
            className="w-full"
          >
            Continue Playing
          </Button>
        </div>
      </div>
    </div>
  );
};

// Achievement Queue Component for multiple notifications
const AchievementQueue = ({ achievements = [], onAchievementClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleAchievement, setVisibleAchievement] = useState(null);

  useEffect(() => {
    if (achievements?.length > 0 && currentIndex < achievements?.length) {
      setVisibleAchievement(achievements?.[currentIndex]);
    } else {
      setVisibleAchievement(null);
    }
  }, [achievements, currentIndex]);

  const handleClose = () => {
    onAchievementClose?.(achievements?.[currentIndex]);
    
    if (currentIndex < achievements?.length - 1) {
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 500);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <AchievementNotification
      achievement={visibleAchievement}
      isVisible={!!visibleAchievement}
      onClose={handleClose}
      autoCloseDelay={4000}
    />
  );
};

export default AchievementNotification;
export { AchievementQueue };