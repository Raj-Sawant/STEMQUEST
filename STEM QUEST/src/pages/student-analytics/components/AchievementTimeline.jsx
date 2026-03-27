import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AchievementTimeline = ({ studentData }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const achievements = [
    {
      id: 1,
      title: 'Math Master',
      description: 'Completed 50 algebra problems with 90%+ accuracy',
      category: 'math',
      type: 'badge',
      date: '2025-09-08',
      points: 150,
      rarity: 'gold',
      icon: 'Calculator',
      progress: 100
    },
    {
      id: 2,
      title: 'Science Explorer',
      description: 'Discovered 10 new concepts in physics simulations',
      category: 'science',
      type: 'milestone',
      date: '2025-09-06',
      points: 200,
      rarity: 'silver',
      icon: 'Atom',
      progress: 100
    },
    {
      id: 3,
      title: 'Problem Solver',
      description: 'Solved complex engineering challenge in under 30 minutes',
      category: 'engineering',
      type: 'achievement',
      date: '2025-09-05',
      points: 300,
      rarity: 'gold',
      icon: 'Cog',
      progress: 100
    },
    {
      id: 4,
      title: 'Code Warrior',
      description: 'Successfully debugged 5 programs without hints',
      category: 'technology',
      type: 'badge',
      date: '2025-09-03',
      points: 180,
      rarity: 'silver',
      icon: 'Code',
      progress: 100
    },
    {
      id: 5,
      title: 'Collaboration Champion',
      description: 'Helped 3 classmates complete their assignments',
      category: 'social',
      type: 'milestone',
      date: '2025-09-01',
      points: 120,
      rarity: 'bronze',
      icon: 'Users',
      progress: 100
    },
    {
      id: 6,
      title: 'Geometry Genius',
      description: 'Master geometric transformations and proofs',
      category: 'math',
      type: 'badge',
      date: null,
      points: 250,
      rarity: 'gold',
      icon: 'Triangle',
      progress: 75
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories', color: 'var(--color-primary)' },
    { id: 'math', name: 'Mathematics', color: '#2563EB' },
    { id: 'science', name: 'Science', color: '#10B981' },
    { id: 'technology', name: 'Technology', color: '#F59E0B' },
    { id: 'engineering', name: 'Engineering', color: '#7C3AED' },
    { id: 'social', name: 'Social', color: '#EF4444' }
  ];

  const timeframes = [
    { id: 'week', name: 'This Week' },
    { id: 'month', name: 'This Month' },
    { id: 'quarter', name: 'This Quarter' },
    { id: 'year', name: 'This Year' }
  ];

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'gold': return '#F59E0B';
      case 'silver': return '#6B7280';
      case 'bronze': return '#92400E';
      default: return 'var(--color-primary)';
    }
  };

  const getRarityIcon = (rarity) => {
    switch (rarity) {
      case 'gold': return 'Crown';
      case 'silver': return 'Medal';
      case 'bronze': return 'Award';
      default: return 'Star';
    }
  };

  const filteredAchievements = achievements?.filter(achievement => {
    if (selectedCategory !== 'all' && achievement?.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  const completedAchievements = filteredAchievements?.filter(a => a?.progress === 100);
  const inProgressAchievements = filteredAchievements?.filter(a => a?.progress < 100);

  const totalPoints = completedAchievements?.reduce((sum, achievement) => sum + achievement?.points, 0);

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
            Achievement Timeline
          </h3>
          <p className="text-sm text-text-secondary">
            Track badges, milestones, and accomplishments
          </p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e?.target?.value)}
            className="px-3 py-2 text-sm border border-border rounded-lg bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {timeframes?.map(timeframe => (
              <option key={timeframe?.id} value={timeframe?.id}>
                {timeframe?.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories?.map((category) => (
          <button
            key={category?.id}
            onClick={() => setSelectedCategory(category?.id)}
            className={`px-3 py-2 rounded-lg text-sm font-body font-medium transition-all duration-200 ${
              selectedCategory === category?.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-text-secondary hover:bg-muted/80 hover:text-foreground'
            }`}
          >
            {category?.name}
          </button>
        ))}
      </div>
      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-muted rounded-lg p-4 text-center">
          <div className="flex items-center justify-center w-10 h-10 bg-success/10 rounded-lg mx-auto mb-2">
            <Icon name="Award" size={20} color="var(--color-success)" />
          </div>
          <div className="text-xl font-heading font-bold text-foreground">
            {completedAchievements?.length}
          </div>
          <div className="text-xs text-text-secondary">Earned</div>
        </div>
        
        <div className="bg-muted rounded-lg p-4 text-center">
          <div className="flex items-center justify-center w-10 h-10 bg-warning/10 rounded-lg mx-auto mb-2">
            <Icon name="Clock" size={20} color="var(--color-warning)" />
          </div>
          <div className="text-xl font-heading font-bold text-foreground">
            {inProgressAchievements?.length}
          </div>
          <div className="text-xs text-text-secondary">In Progress</div>
        </div>
        
        <div className="bg-muted rounded-lg p-4 text-center">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg mx-auto mb-2">
            <Icon name="Star" size={20} color="var(--color-primary)" />
          </div>
          <div className="text-xl font-heading font-bold text-foreground">
            {totalPoints?.toLocaleString()}
          </div>
          <div className="text-xs text-text-secondary">Points</div>
        </div>
        
        <div className="bg-muted rounded-lg p-4 text-center">
          <div className="flex items-center justify-center w-10 h-10 bg-accent/10 rounded-lg mx-auto mb-2">
            <Icon name="Crown" size={20} color="var(--color-accent)" />
          </div>
          <div className="text-xl font-heading font-bold text-foreground">
            {completedAchievements?.filter(a => a?.rarity === 'gold')?.length}
          </div>
          <div className="text-xs text-text-secondary">Gold Badges</div>
        </div>
      </div>
      {/* Achievement Timeline */}
      <div className="space-y-4">
        <h4 className="text-base font-heading font-semibold text-foreground">
          Recent Achievements
        </h4>
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredAchievements?.map((achievement, index) => (
            <div
              key={achievement?.id}
              className={`relative pl-8 pb-4 ${
                index !== filteredAchievements?.length - 1 ? 'border-l-2 border-border ml-4' : ''
              }`}
            >
              {/* Timeline Dot */}
              <div
                className={`absolute -left-2 top-0 w-4 h-4 rounded-full border-2 border-surface ${
                  achievement?.progress === 100 ? 'bg-success' : 'bg-warning'
                }`}
              />
              
              {/* Achievement Card */}
              <div className={`bg-muted rounded-lg p-4 ml-4 ${
                achievement?.progress < 100 ? 'opacity-75 border-2 border-dashed border-border' : ''
              }`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div
                      className="flex items-center justify-center w-10 h-10 rounded-lg"
                      style={{ backgroundColor: `${getRarityColor(achievement?.rarity)}20` }}
                    >
                      <Icon
                        name={achievement?.icon}
                        size={20}
                        color={getRarityColor(achievement?.rarity)}
                      />
                    </div>
                    <div>
                      <h5 className="text-sm font-body font-semibold text-foreground">
                        {achievement?.title}
                      </h5>
                      <p className="text-xs text-text-secondary">
                        {achievement?.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Icon
                        name={getRarityIcon(achievement?.rarity)}
                        size={14}
                        color={getRarityColor(achievement?.rarity)}
                      />
                      <span className="text-xs font-mono text-foreground">
                        {achievement?.points} pts
                      </span>
                    </div>
                  </div>
                </div>
                
                {achievement?.progress < 100 && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-text-secondary">Progress</span>
                      <span className="text-xs font-mono text-foreground">
                        {achievement?.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-background rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${achievement?.progress}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {achievement?.date && (
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
                    <span className="text-xs text-text-secondary">
                      Earned on {new Date(achievement.date)?.toLocaleDateString()}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Icon name="Calendar" size={12} color="var(--color-text-secondary)" />
                      <span className="text-xs text-text-secondary">
                        {Math.ceil((new Date() - new Date(achievement.date)) / (1000 * 60 * 60 * 24))} days ago
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-border">
        <Button
          variant="outline"
          iconName="Download"
          iconPosition="left"
          iconSize={16}
        >
          Export Report
        </Button>
        <Button
          variant="outline"
          iconName="Share"
          iconPosition="left"
          iconSize={16}
        >
          Share Progress
        </Button>
        <Button
          variant="default"
          iconName="Target"
          iconPosition="left"
          iconSize={16}
        >
          Set New Goals
        </Button>
      </div>
    </div>
  );
};

export default AchievementTimeline;