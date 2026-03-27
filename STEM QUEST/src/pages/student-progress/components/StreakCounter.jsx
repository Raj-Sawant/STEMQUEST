import React from 'react';
import Icon from '../../../components/AppIcon';

const StreakCounter = ({ streakData }) => {
  const getStreakIcon = (type) => {
    const icons = {
      'daily': 'Calendar',
      'weekly': 'CalendarDays',
      'login': 'LogIn',
      'completion': 'CheckCircle'
    };
    return icons?.[type] || 'Flame';
  };

  const getStreakColor = (streak) => {
    if (streak >= 30) return 'text-success';
    if (streak >= 14) return 'text-primary';
    if (streak >= 7) return 'text-warning';
    return 'text-text-secondary';
  };

  const getStreakBgColor = (streak) => {
    if (streak >= 30) return 'bg-success/10';
    if (streak >= 14) return 'bg-primary/10';
    if (streak >= 7) return 'bg-warning/10';
    return 'bg-muted';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-heading font-semibold text-foreground">Learning Streaks</h3>
        <div className="flex items-center space-x-2">
          <Icon name="Flame" size={18} color="var(--color-warning)" />
          <span className="text-sm text-text-secondary">Keep it up!</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {streakData?.streaks?.map((streak) => (
          <div key={streak?.type} className={`p-4 rounded-lg border ${getStreakBgColor(streak?.current)}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Icon name={getStreakIcon(streak?.type)} size={16} color="var(--color-text-secondary)" />
                <span className="text-sm font-body font-medium text-foreground capitalize">
                  {streak?.type} Streak
                </span>
              </div>
              <div className={`text-xl font-heading font-bold ${getStreakColor(streak?.current)}`}>
                {streak?.current}
              </div>
            </div>
            <div className="flex justify-between text-xs text-text-secondary">
              <span>Best: {streak?.best}</span>
              <span>Last: {streak?.lastActivity}</span>
            </div>
          </div>
        ))}
      </div>
      {/* Weekly Calendar */}
      <div className="mb-4">
        <h4 className="text-sm font-body font-medium text-foreground mb-3">This Week's Activity</h4>
        <div className="grid grid-cols-7 gap-2">
          {streakData?.weeklyActivity?.map((day, index) => (
            <div key={index} className="text-center">
              <div className="text-xs text-text-secondary mb-1">{day?.day}</div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto ${
                day?.completed 
                  ? 'bg-success text-white' 
                  : day?.isToday 
                    ? 'bg-primary/20 border-2 border-primary text-primary' :'bg-muted text-text-secondary'
              }`}>
                {day?.completed ? (
                  <Icon name="Check" size={14} />
                ) : (
                  <span className="text-xs">{day?.date}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Consistency Metrics */}
      <div className="pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-heading font-bold text-primary">
              {streakData?.consistency?.weeklyAverage}%
            </div>
            <div className="text-sm text-text-secondary">Weekly Average</div>
          </div>
          <div>
            <div className="text-2xl font-heading font-bold text-secondary">
              {streakData?.consistency?.monthlyGoal}%
            </div>
            <div className="text-sm text-text-secondary">Monthly Goal</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreakCounter;