import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const ProgressTracker = ({ 
  currentLevel = 1, 
  totalLevels = 10, 
  levelProgress = 0, 
  overallProgress = 0,
  achievements = [],
  onLevelComplete 
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    // Animate progress bar
    const timer = setTimeout(() => {
      setAnimatedProgress(levelProgress);
    }, 300);

    return () => clearTimeout(timer);
  }, [levelProgress]);

  useEffect(() => {
    // Show level up animation when level changes
    if (levelProgress >= 100) {
      setShowLevelUp(true);
      const timer = setTimeout(() => {
        setShowLevelUp(false);
        onLevelComplete?.();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [levelProgress, onLevelComplete]);

  const getProgressColor = () => {
    if (levelProgress >= 80) return 'bg-success';
    if (levelProgress >= 50) return 'bg-accent';
    return 'bg-primary';
  };

  const getLevelIcon = () => {
    if (currentLevel <= 3) return 'Seedling';
    if (currentLevel <= 6) return 'Sprout';
    if (currentLevel <= 9) return 'TreePine';
    return 'Crown';
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-4 space-y-4">
      {/* Level Information */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon name={getLevelIcon()} size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Level {currentLevel}</h3>
            <p className="text-sm text-text-secondary">of {totalLevels} levels</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-primary">{Math.round(levelProgress)}%</div>
          <div className="text-xs text-text-secondary">Complete</div>
        </div>
      </div>
      {/* Level Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Level Progress</span>
          <span className="text-foreground font-medium">{Math.round(animatedProgress)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full ${getProgressColor()} transition-all duration-1000 ease-out rounded-full relative`}
            style={{ width: `${Math.min(animatedProgress, 100)}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
      </div>
      {/* Overall Course Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Course Progress</span>
          <span className="text-foreground font-medium">{Math.round(overallProgress)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="h-full bg-secondary transition-all duration-500 ease-out rounded-full"
            style={{ width: `${Math.min(overallProgress, 100)}%` }}
          ></div>
        </div>
      </div>
      {/* Recent Achievements */}
      {achievements?.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Recent Achievements</h4>
          <div className="flex flex-wrap gap-2">
            {achievements?.slice(0, 3)?.map((achievement, index) => (
              <div 
                key={index}
                className="flex items-center space-x-1 bg-accent/10 text-accent px-2 py-1 rounded-full text-xs"
              >
                <Icon name={achievement?.icon} size={12} />
                <span>{achievement?.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Level Milestones */}
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: Math.min(totalLevels, 10) }, (_, index) => {
          const level = index + 1;
          const isCompleted = level < currentLevel;
          const isCurrent = level === currentLevel;
          
          return (
            <div 
              key={level}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200 ${
                isCompleted 
                  ? 'bg-success text-success-foreground' 
                  : isCurrent 
                    ? 'bg-primary text-primary-foreground ring-2 ring-primary/30' 
                    : 'bg-muted text-text-secondary'
              }`}
            >
              {isCompleted ? (
                <Icon name="Check" size={12} />
              ) : (
                level
              )}
            </div>
          );
        })}
      </div>
      {/* Level Up Animation Overlay */}
      {showLevelUp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-200 animate-fade-in">
          <div className="bg-surface rounded-lg p-8 text-center max-w-sm mx-4 animate-scale-in">
            <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Trophy" size={32} color="white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Level Up!</h2>
            <p className="text-text-secondary mb-4">
              Congratulations! You've reached Level {currentLevel + 1}
            </p>
            <div className="flex items-center justify-center space-x-2 text-accent">
              <Icon name="Star" size={16} />
              <span className="font-medium">+50 XP Bonus</span>
              <Icon name="Star" size={16} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;