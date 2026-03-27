import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EngagementMetrics = ({ studentData }) => {
  const [selectedMetric, setSelectedMetric] = useState('completion');

  const completionData = [
    { name: 'Completed', value: 78, color: '#10B981' },
    { name: 'In Progress', value: 15, color: '#F59E0B' },
    { name: 'Not Started', value: 7, color: '#EF4444' }
  ];

  const engagementPatterns = [
    { time: '9 AM', sessions: 12, duration: 45 },
    { time: '11 AM', sessions: 18, duration: 52 },
    { time: '1 PM', sessions: 25, duration: 38 },
    { time: '3 PM', sessions: 32, duration: 48 },
    { time: '5 PM', sessions: 28, duration: 55 },
    { time: '7 PM', sessions: 22, duration: 42 },
    { time: '9 PM', sessions: 15, duration: 35 }
  ];

  const learningStrategies = [
    {
      strategy: 'Trial & Error',
      usage: 45,
      effectiveness: 72,
      description: 'Learns through experimentation'
    },
    {
      strategy: 'Hint Usage',
      usage: 32,
      effectiveness: 85,
      description: 'Uses hints strategically'
    },
    {
      strategy: 'Peer Collaboration',
      usage: 28,
      effectiveness: 78,
      description: 'Engages with classmates'
    },
    {
      strategy: 'Resource Review',
      usage: 38,
      effectiveness: 68,
      description: 'Reviews materials before attempts'
    }
  ];

  const challengeAreas = [
    {
      area: 'Complex Problem Solving',
      difficulty: 85,
      attempts: 12,
      successRate: 42,
      recommendation: 'Break down into smaller steps'
    },
    {
      area: 'Abstract Concepts',
      difficulty: 78,
      attempts: 8,
      successRate: 55,
      recommendation: 'Use visual aids and examples'
    },
    {
      area: 'Time Management',
      difficulty: 65,
      attempts: 15,
      successRate: 68,
      recommendation: 'Practice with timed exercises'
    }
  ];

  const metrics = [
    { id: 'completion', name: 'Completion Rate', icon: 'CheckCircle' },
    { id: 'engagement', name: 'Engagement Pattern', icon: 'Clock' },
    { id: 'strategies', name: 'Learning Strategies', icon: 'Brain' },
    { id: 'challenges', name: 'Challenge Areas', icon: 'AlertTriangle' }
  ];

  const renderCompletionMetrics = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h4 className="text-base font-heading font-semibold text-foreground">
          Game Completion Status
        </h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={completionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {completionData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2">
          {completionData?.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item?.color }}
                />
                <span className="text-sm font-body text-foreground">{item?.name}</span>
              </div>
              <span className="text-sm font-mono text-text-secondary">{item?.value}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-base font-heading font-semibold text-foreground">
          Key Metrics
        </h4>
        <div className="space-y-4">
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-body text-text-secondary">Average Session Time</span>
              <Icon name="Clock" size={16} color="var(--color-text-secondary)" />
            </div>
            <div className="text-2xl font-heading font-bold text-foreground">47 min</div>
            <div className="text-xs text-success">+12% from last week</div>
          </div>
          
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-body text-text-secondary">Retry Rate</span>
              <Icon name="RotateCcw" size={16} color="var(--color-text-secondary)" />
            </div>
            <div className="text-2xl font-heading font-bold text-foreground">23%</div>
            <div className="text-xs text-warning">-5% from last week</div>
          </div>
          
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-body text-text-secondary">Help Requests</span>
              <Icon name="HelpCircle" size={16} color="var(--color-text-secondary)" />
            </div>
            <div className="text-2xl font-heading font-bold text-foreground">8</div>
            <div className="text-xs text-success">-3 from last week</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEngagementPattern = () => (
    <div className="space-y-4">
      <h4 className="text-base font-heading font-semibold text-foreground">
        Daily Engagement Pattern
      </h4>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={engagementPatterns}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="time" 
              stroke="var(--color-text-secondary)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-text-secondary)"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="sessions" fill="var(--color-primary)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-lg font-heading font-bold text-foreground">3:00 PM</div>
          <div className="text-xs text-text-secondary">Peak Activity</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-heading font-bold text-foreground">48 min</div>
          <div className="text-xs text-text-secondary">Avg Duration</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-heading font-bold text-foreground">5.2</div>
          <div className="text-xs text-text-secondary">Sessions/Day</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-heading font-bold text-foreground">87%</div>
          <div className="text-xs text-text-secondary">Consistency</div>
        </div>
      </div>
    </div>
  );

  const renderLearningStrategies = () => (
    <div className="space-y-4">
      <h4 className="text-base font-heading font-semibold text-foreground">
        Learning Strategy Analysis
      </h4>
      <div className="space-y-4">
        {learningStrategies?.map((strategy, index) => (
          <div key={index} className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-sm font-body font-medium text-foreground">
                {strategy?.strategy}
              </h5>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-text-secondary">Usage:</span>
                <span className="text-xs font-mono text-foreground">{strategy?.usage}%</span>
              </div>
            </div>
            <p className="text-xs text-text-secondary mb-3">{strategy?.description}</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">Effectiveness</span>
                <span className="font-mono text-foreground">{strategy?.effectiveness}%</span>
              </div>
              <div className="w-full bg-background rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${strategy?.effectiveness}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderChallengeAreas = () => (
    <div className="space-y-4">
      <h4 className="text-base font-heading font-semibold text-foreground">
        Areas Requiring Support
      </h4>
      <div className="space-y-4">
        {challengeAreas?.map((challenge, index) => (
          <div key={index} className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-sm font-body font-medium text-foreground">
                {challenge?.area}
              </h5>
              <div className="flex items-center space-x-1">
                <Icon name="AlertTriangle" size={14} color="var(--color-warning)" />
                <span className="text-xs font-mono text-warning">{challenge?.difficulty}%</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <span className="text-xs text-text-secondary">Attempts:</span>
                <span className="text-xs font-mono text-foreground ml-1">{challenge?.attempts}</span>
              </div>
              <div>
                <span className="text-xs text-text-secondary">Success Rate:</span>
                <span className="text-xs font-mono text-foreground ml-1">{challenge?.successRate}%</span>
              </div>
            </div>
            <div className="bg-accent/10 rounded-md p-2">
              <div className="flex items-start space-x-2">
                <Icon name="Lightbulb" size={14} color="var(--color-accent)" />
                <span className="text-xs text-foreground">{challenge?.recommendation}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (selectedMetric) {
      case 'completion':
        return renderCompletionMetrics();
      case 'engagement':
        return renderEngagementPattern();
      case 'strategies':
        return renderLearningStrategies();
      case 'challenges':
        return renderChallengeAreas();
      default:
        return renderCompletionMetrics();
    }
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
            Engagement Analytics
          </h3>
          <p className="text-sm text-text-secondary">
            Detailed insights into learning patterns and behaviors
          </p>
        </div>
      </div>
      {/* Metric Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {metrics?.map((metric) => (
          <Button
            key={metric?.id}
            variant={selectedMetric === metric?.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedMetric(metric?.id)}
            iconName={metric?.icon}
            iconPosition="left"
            iconSize={16}
          >
            {metric?.name}
          </Button>
        ))}
      </div>
      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default EngagementMetrics;