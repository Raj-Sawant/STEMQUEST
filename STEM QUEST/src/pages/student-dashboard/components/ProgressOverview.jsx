import React from 'react';
import Icon from '../../../components/AppIcon';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const ProgressOverview = ({ progressData, weeklyGoal }) => {
  const getSubjectIcon = (subject) => {
    const icons = {
      'Math': 'Calculator',
      'Science': 'Atom',
      'Technology': 'Laptop',
      'Engineering': 'Cog'
    };
    return icons?.[subject] || 'BookOpen';
  };

  const calculateOverallProgress = () => {
    const total = progressData?.reduce((sum, item) => sum + item?.progress, 0);
    return Math.round(total / progressData?.length);
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-card border border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-heading font-semibold text-foreground">
          Learning Progress
        </h2>
        <Link to="/student-progress">
          <Button variant="ghost" size="sm" iconName="TrendingUp" iconPosition="right">
            Details
          </Button>
        </Link>
      </div>
      {/* Overall Progress */}
      <div className="mb-6 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Overall Progress</span>
          <span className="text-sm font-bold text-primary">{calculateOverallProgress()}%</span>
        </div>
        <div className="w-full h-3 bg-border rounded-full">
          <div 
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
            style={{ width: `${calculateOverallProgress()}%` }}
          />
        </div>
      </div>
      {/* Subject Progress */}
      <div className="space-y-4 mb-6">
        {progressData?.map((subject) => (
          <div key={subject?.name} className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name={getSubjectIcon(subject?.name)} size={18} color="var(--color-text-secondary)" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-foreground">{subject?.name}</span>
                <span className="text-sm text-text-secondary">{subject?.progress}%</span>
              </div>
              <div className="w-full h-2 bg-border rounded-full">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${subject?.progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-text-secondary">
                  {subject?.completedLessons}/{subject?.totalLessons} lessons
                </span>
                <span className="text-xs text-text-secondary">
                  {subject?.timeSpent}h spent
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Weekly Goal */}
      <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
            <Icon name="Target" size={16} color="var(--color-success)" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Weekly Goal</p>
            <p className="text-xs text-text-secondary">
              {weeklyGoal?.completed}/{weeklyGoal?.target} hours completed
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-success">
              {Math.round((weeklyGoal?.completed / weeklyGoal?.target) * 100)}%
            </p>
          </div>
        </div>
        
        <div className="w-full h-2 bg-border rounded-full mt-3">
          <div 
            className="h-full bg-success rounded-full transition-all duration-300"
            style={{ width: `${Math.min((weeklyGoal?.completed / weeklyGoal?.target) * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressOverview;