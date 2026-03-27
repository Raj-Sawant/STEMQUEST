import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const SubjectQuickAccess = ({ subjects }) => {
  const getSubjectIcon = (subject) => {
    const icons = {
      'Math': 'Calculator',
      'Science': 'Atom',
      'Technology': 'Laptop',
      'Engineering': 'Cog'
    };
    return icons?.[subject] || 'BookOpen';
  };

  const getSubjectColor = (subject) => {
    const colors = {
      'Math': 'from-blue-500 to-blue-600',
      'Science': 'from-green-500 to-green-600',
      'Technology': 'from-purple-500 to-purple-600',
      'Engineering': 'from-orange-500 to-orange-600'
    };
    return colors?.[subject] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-card border border-border">
      <h2 className="text-lg font-heading font-semibold text-foreground mb-4">
        Explore Subjects
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {subjects?.map((subject) => (
          <Link
            key={subject?.name}
            to={`/game-library?subject=${subject?.name?.toLowerCase()}`}
            className="group"
          >
            <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-muted to-muted/50 p-4 hover:shadow-lg transition-all duration-200 hover-scale">
              <div className={`absolute inset-0 bg-gradient-to-br ${getSubjectColor(subject?.name)} opacity-10 group-hover:opacity-20 transition-opacity`} />
              
              <div className="relative z-10 text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <Icon name={getSubjectIcon(subject?.name)} size={24} color="var(--color-primary)" />
                </div>
                
                <h3 className="font-body font-medium text-foreground mb-1">
                  {subject?.name}
                </h3>
                
                <p className="text-xs text-text-secondary mb-2">
                  {subject?.gameCount} games
                </p>
                
                <div className="w-full h-2 bg-border rounded-full">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${subject?.progress}%` }}
                  />
                </div>
                
                <p className="text-xs text-text-secondary mt-1">
                  {subject?.progress}% complete
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SubjectQuickAccess;