import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const PeerComparison = ({ comparisonData }) => {
  const [selectedMetric, setSelectedMetric] = useState('overall');

  const metrics = [
    { id: 'overall', label: 'Overall Progress', icon: 'TrendingUp' },
    { id: 'timeSpent', label: 'Study Time', icon: 'Clock' },
    { id: 'accuracy', label: 'Accuracy', icon: 'Target' },
    { id: 'streaks', label: 'Consistency', icon: 'Flame' }
  ];

  const getRankColor = (rank) => {
    if (rank <= 3) return 'text-success';
    if (rank <= 10) return 'text-primary';
    if (rank <= 20) return 'text-warning';
    return 'text-text-secondary';
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getPercentileColor = (percentile) => {
    if (percentile >= 90) return 'text-success';
    if (percentile >= 75) return 'text-primary';
    if (percentile >= 50) return 'text-warning';
    return 'text-error';
  };

  const currentData = comparisonData?.[selectedMetric];

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-heading font-semibold text-foreground">Class Comparison</h3>
        <div className="flex items-center space-x-2 text-sm text-text-secondary">
          <Icon name="Users" size={16} />
          <span>{comparisonData?.totalStudents} students</span>
        </div>
      </div>
      {/* Metric Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {metrics?.map((metric) => (
          <button
            key={metric?.id}
            onClick={() => setSelectedMetric(metric?.id)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-body font-medium transition-all duration-200 ${
              selectedMetric === metric?.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-text-secondary hover:text-foreground hover:bg-muted/80'
            }`}
          >
            <Icon name={metric?.icon} size={14} />
            <span>{metric?.label}</span>
          </button>
        ))}
      </div>
      {/* Current Performance */}
      <div className="bg-muted/50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-body font-medium text-foreground">Your Performance</h4>
          <div className={`text-lg font-heading font-bold ${getRankColor(currentData?.yourRank)}`}>
            {getRankBadge(currentData?.yourRank)}
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-xl font-heading font-bold text-foreground">
              {currentData?.yourScore}
              {selectedMetric === 'timeSpent' ? 'h' : selectedMetric === 'accuracy' ? '%' : ''}
            </div>
            <div className="text-xs text-text-secondary">Your Score</div>
          </div>
          <div>
            <div className={`text-xl font-heading font-bold ${getPercentileColor(currentData?.percentile)}`}>
              {currentData?.percentile}%
            </div>
            <div className="text-xs text-text-secondary">Percentile</div>
          </div>
          <div>
            <div className="text-xl font-heading font-bold text-primary">
              {currentData?.classAverage}
              {selectedMetric === 'timeSpent' ? 'h' : selectedMetric === 'accuracy' ? '%' : ''}
            </div>
            <div className="text-xs text-text-secondary">Class Average</div>
          </div>
          <div>
            <div className="text-xl font-heading font-bold text-secondary">
              +{currentData?.improvement}
            </div>
            <div className="text-xs text-text-secondary">This Week</div>
          </div>
        </div>
      </div>
      {/* Distribution Chart */}
      <div className="mb-6">
        <h4 className="font-body font-medium text-foreground mb-3">Class Distribution</h4>
        <div className="space-y-2">
          {currentData?.distribution?.map((range, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-20 text-sm text-text-secondary">
                {range?.range}
              </div>
              <div className="flex-1 bg-muted rounded-full h-2 relative">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(range?.count / comparisonData?.totalStudents) * 100}%` }}
                />
                {range?.includesYou && (
                  <div className="absolute top-0 left-0 w-full h-2 flex items-center">
                    <div 
                      className="w-1 h-4 bg-error rounded-full"
                      style={{ marginLeft: `${(currentData?.yourScore / range?.max) * 100}%` }}
                    />
                  </div>
                )}
              </div>
              <div className="w-8 text-sm text-text-secondary text-right">
                {range?.count}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Collaborative Achievements */}
      <div className="pt-4 border-t border-border">
        <h4 className="font-body font-medium text-foreground mb-3">Team Achievements</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {comparisonData?.teamAchievements?.map((achievement, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
              <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                <Icon name="Users" size={14} color="var(--color-success)" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-body font-medium text-foreground">
                  {achievement?.title}
                </div>
                <div className="text-xs text-text-secondary">
                  {achievement?.participants} participants
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PeerComparison;