import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AchievementShowcase = ({ achievements, recentBadges }) => {
  const getBadgeIcon = (type) => {
    const icons = {
      'streak': 'Flame',
      'completion': 'Trophy',
      'mastery': 'Star',
      'exploration': 'Compass',
      'collaboration': 'Users'
    };
    return icons?.[type] || 'Award';
  };

  const getBadgeColor = (rarity) => {
    const colors = {
      'common': 'from-gray-400 to-gray-500',
      'rare': 'from-blue-400 to-blue-500',
      'epic': 'from-purple-400 to-purple-500',
      'legendary': 'from-yellow-400 to-yellow-500'
    };
    return colors?.[rarity] || 'from-gray-400 to-gray-500';
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-card border border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-heading font-semibold text-foreground">
          Achievements
        </h2>
        <Button variant="ghost" size="sm" iconName="Award" iconPosition="left">
          View All
        </Button>
      </div>
      {/* Achievement Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-2 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon name="Trophy" size={20} color="var(--color-primary)" />
          </div>
          <p className="text-2xl font-bold text-foreground">{achievements?.totalBadges}</p>
          <p className="text-xs text-text-secondary">Badges</p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-2 bg-success/10 rounded-full flex items-center justify-center">
            <Icon name="Target" size={20} color="var(--color-success)" />
          </div>
          <p className="text-2xl font-bold text-foreground">{achievements?.completedChallenges}</p>
          <p className="text-xs text-text-secondary">Challenges</p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-2 bg-warning/10 rounded-full flex items-center justify-center">
            <Icon name="Zap" size={20} color="var(--color-warning)" />
          </div>
          <p className="text-2xl font-bold text-foreground">{achievements?.currentLevel}</p>
          <p className="text-xs text-text-secondary">Level</p>
        </div>
      </div>
      {/* Recent Badges */}
      <div>
        <h3 className="text-sm font-body font-medium text-foreground mb-3">
          Recent Badges
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {recentBadges?.map((badge) => (
            <div
              key={badge?.id}
              className="group relative p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
            >
              <div className="text-center">
                <div className={`w-10 h-10 mx-auto mb-2 bg-gradient-to-br ${getBadgeColor(badge?.rarity)} rounded-full flex items-center justify-center shadow-sm`}>
                  <Icon name={getBadgeIcon(badge?.type)} size={18} color="white" />
                </div>
                
                <h4 className="text-xs font-medium text-foreground truncate">
                  {badge?.name}
                </h4>
                
                <p className="text-xs text-text-secondary mt-1">
                  {new Date(badge.earnedAt)?.toLocaleDateString()}
                </p>
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-surface border border-border rounded text-xs text-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                {badge?.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AchievementShowcase;