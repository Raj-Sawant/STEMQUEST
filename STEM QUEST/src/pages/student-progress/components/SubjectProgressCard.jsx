import React from 'react';
import Icon from '../../../components/AppIcon';

const SubjectProgressCard = ({ subject }) => {
  const getSubjectIcon = (subjectName) => {
    const icons = {
      'Mathematics': 'Calculator',
      'Science': 'Microscope',
      'Technology': 'Laptop',
      'Engineering': 'Cog'
    };
    return icons?.[subjectName] || 'BookOpen';
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-warning';
    return 'text-error';
  };

  const getProgressBgColor = (percentage) => {
    if (percentage >= 80) return 'bg-success';
    if (percentage >= 60) return 'bg-warning';
    return 'bg-error';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name={getSubjectIcon(subject?.name)} size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">{subject?.name}</h3>
            <p className="text-sm text-text-secondary">{subject?.totalTopics} topics</p>
          </div>
        </div>
        <div className={`text-2xl font-heading font-bold ${getProgressColor(subject?.completionPercentage)}`}>
          {subject?.completionPercentage}%
        </div>
      </div>
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-text-secondary mb-2">
          <span>Progress</span>
          <span>{subject?.completedTopics}/{subject?.totalTopics} completed</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getProgressBgColor(subject?.completionPercentage)}`}
            style={{ width: `${subject?.completionPercentage}%` }}
          />
        </div>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="text-lg font-heading font-semibold text-foreground">{subject?.timeSpent}h</div>
          <div className="text-text-secondary">Time Spent</div>
        </div>
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="text-lg font-heading font-semibold text-foreground">{subject?.averageScore}%</div>
          <div className="text-text-secondary">Avg Score</div>
        </div>
      </div>
      {/* Recent Activity */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">Last Activity:</span>
          <span className="text-foreground font-body font-medium">{subject?.lastActivity}</span>
        </div>
      </div>
    </div>
  );
};

export default SubjectProgressCard;