import React from 'react';
import Icon from '../../../components/AppIcon';

const CompetencyTracker = ({ competencies }) => {
  const getMasteryColor = (level) => {
    const colors = {
      'Mastered': 'text-success',
      'Proficient': 'text-primary',
      'Developing': 'text-warning',
      'Beginner': 'text-error'
    };
    return colors?.[level] || 'text-text-secondary';
  };

  const getMasteryBgColor = (level) => {
    const colors = {
      'Mastered': 'bg-success',
      'Proficient': 'bg-primary',
      'Developing': 'bg-warning',
      'Beginner': 'bg-error'
    };
    return colors?.[level] || 'bg-muted';
  };

  const getMasteryPercentage = (level) => {
    const percentages = {
      'Mastered': 100,
      'Proficient': 75,
      'Developing': 50,
      'Beginner': 25
    };
    return percentages?.[level] || 0;
  };

  const getSkillIcon = (skillType) => {
    const icons = {
      'problem-solving': 'Puzzle',
      'critical-thinking': 'Brain',
      'creativity': 'Lightbulb',
      'collaboration': 'Users',
      'communication': 'MessageCircle',
      'technical': 'Settings'
    };
    return icons?.[skillType] || 'CheckCircle';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-heading font-semibold text-foreground">Competency Tracker</h3>
        <div className="flex items-center space-x-2 text-sm text-text-secondary">
          <Icon name="TrendingUp" size={16} />
          <span>Overall Progress: 68%</span>
        </div>
      </div>
      <div className="space-y-4">
        {competencies?.map((competency) => (
          <div key={competency?.id} className="border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name={getSkillIcon(competency?.type)} size={16} color="var(--color-primary)" />
                </div>
                <div>
                  <h4 className="font-body font-medium text-foreground">{competency?.name}</h4>
                  <p className="text-sm text-text-secondary">{competency?.subject}</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-body font-medium ${getMasteryColor(competency?.masteryLevel)} bg-current/10`}>
                {competency?.masteryLevel}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-sm text-text-secondary mb-2">
                <span>Progress</span>
                <span>{competency?.progress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getMasteryBgColor(competency?.masteryLevel)}`}
                  style={{ width: `${competency?.progress}%` }}
                />
              </div>
            </div>

            {/* Skills Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {competency?.skills?.map((skill, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">{skill?.name}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-muted rounded-full h-1">
                      <div 
                        className={`h-1 rounded-full ${getMasteryBgColor(skill?.level)}`}
                        style={{ width: `${getMasteryPercentage(skill?.level)}%` }}
                      />
                    </div>
                    <span className={`text-xs ${getMasteryColor(skill?.level)}`}>
                      {skill?.level}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Recommendations */}
            {competency?.recommendations && competency?.recommendations?.length > 0 && (
              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex items-start space-x-2">
                  <Icon name="Lightbulb" size={14} color="var(--color-warning)" className="mt-0.5" />
                  <div className="text-sm text-text-secondary">
                    <span className="font-body font-medium">Recommendation: </span>
                    {competency?.recommendations?.[0]}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompetencyTracker;