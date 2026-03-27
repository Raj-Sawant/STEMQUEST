import React, { useState } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ComparativeAnalysis = ({ studentData }) => {
  const [comparisonType, setComparisonType] = useState('class');
  const [selectedMetric, setSelectedMetric] = useState('overall');

  const radarData = [
    { subject: 'Math', student: 82, classAvg: 75, gradeAvg: 78 },
    { subject: 'Science', student: 88, classAvg: 80, gradeAvg: 82 },
    { subject: 'Technology', student: 75, classAvg: 78, gradeAvg: 76 },
    { subject: 'Engineering', student: 79, classAvg: 72, gradeAvg: 74 },
    { subject: 'Problem Solving', student: 85, classAvg: 77, gradeAvg: 79 },
    { subject: 'Collaboration', student: 90, classAvg: 82, gradeAvg: 80 }
  ];

  const performanceComparison = [
    { category: 'Quiz Scores', student: 85, class: 78, grade: 80, national: 75 },
    { category: 'Assignment Completion', student: 92, class: 85, grade: 87, national: 82 },
    { category: 'Engagement Time', student: 78, class: 82, grade: 79, national: 76 },
    { category: 'Help Requests', student: 15, class: 22, grade: 20, national: 25 },
    { category: 'Peer Interactions', student: 88, class: 75, grade: 78, national: 72 }
  ];

  const rankingData = {
    class: {
      position: 3,
      total: 28,
      percentile: 89,
      improvement: '+2 positions'
    },
    grade: {
      position: 12,
      total: 156,
      percentile: 92,
      improvement: '+5 positions'
    },
    school: {
      position: 28,
      total: 420,
      percentile: 93,
      improvement: '+8 positions'
    }
  };

  const strengthsWeaknesses = {
    strengths: [
      {
        area: 'Scientific Reasoning',
        score: 92,
        description: 'Excellent at hypothesis formation and testing',
        comparison: '+15% above class average'
      },
      {
        area: 'Collaborative Learning',
        score: 90,
        description: 'Strong peer interaction and teamwork skills',
        comparison: '+12% above class average'
      },
      {
        area: 'Problem Persistence',
        score: 88,
        description: 'Demonstrates resilience in challenging tasks',
        comparison: '+10% above class average'
      }
    ],
    weaknesses: [
      {
        area: 'Time Management',
        score: 65,
        description: 'Struggles with completing tasks within time limits',
        comparison: '-8% below class average'
      },
      {
        area: 'Abstract Thinking',
        score: 68,
        description: 'Difficulty with theoretical concepts',
        comparison: '-5% below class average'
      },
      {
        area: 'Self-Assessment',
        score: 72,
        description: 'Limited reflection on learning progress',
        comparison: '-3% below class average'
      }
    ]
  };

  const comparisonTypes = [
    { id: 'class', name: 'Class Average', icon: 'Users' },
    { id: 'grade', name: 'Grade Level', icon: 'GraduationCap' },
    { id: 'school', name: 'School Wide', icon: 'Building' }
  ];

  const metrics = [
    { id: 'overall', name: 'Overall Performance' },
    { id: 'subjects', name: 'Subject Breakdown' },
    { id: 'skills', name: 'Skill Analysis' },
    { id: 'ranking', name: 'Ranking & Position' }
  ];

  const getPerformanceColor = (studentScore, comparisonScore) => {
    const difference = studentScore - comparisonScore;
    if (difference > 10) return 'var(--color-success)';
    if (difference > 0) return 'var(--color-primary)';
    if (difference > -10) return 'var(--color-warning)';
    return 'var(--color-error)';
  };

  const getPerformanceIcon = (studentScore, comparisonScore) => {
    const difference = studentScore - comparisonScore;
    if (difference > 5) return 'TrendingUp';
    if (difference > 0) return 'ArrowUp';
    if (difference > -5) return 'Minus';
    return 'TrendingDown';
  };

  const renderRadarChart = () => (
    <div className="space-y-4">
      <h4 className="text-base font-heading font-semibold text-foreground">
        Performance Radar
      </h4>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid stroke="var(--color-border)" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: 'var(--color-text-secondary)' }}
            />
            <Radar
              name="Student"
              dataKey="student"
              stroke="var(--color-primary)"
              fill="var(--color-primary)"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Radar
              name={comparisonType === 'class' ? 'Class Avg' : comparisonType === 'grade' ? 'Grade Avg' : 'School Avg'}
              dataKey={comparisonType === 'class' ? 'classAvg' : 'gradeAvg'}
              stroke="var(--color-text-secondary)"
              fill="var(--color-text-secondary)"
              fillOpacity={0.1}
              strokeWidth={2}
              strokeDasharray="5 5"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px'
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderPerformanceComparison = () => (
    <div className="space-y-4">
      <h4 className="text-base font-heading font-semibold text-foreground">
        Detailed Comparison
      </h4>
      <div className="space-y-3">
        {performanceComparison?.map((item, index) => (
          <div key={index} className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-sm font-body font-medium text-foreground">
                {item?.category}
              </h5>
              <div className="flex items-center space-x-1">
                <Icon
                  name={getPerformanceIcon(item?.student, item?.[comparisonType])}
                  size={16}
                  color={getPerformanceColor(item?.student, item?.[comparisonType])}
                />
                <span
                  className="text-sm font-mono"
                  style={{ color: getPerformanceColor(item?.student, item?.[comparisonType]) }}
                >
                  {item?.student > item?.[comparisonType] ? '+' : ''}
                  {(item?.student - item?.[comparisonType])?.toFixed(1)}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">Student Score</span>
                <span className="font-mono text-foreground">{item?.student}</span>
              </div>
              <div className="w-full bg-background rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${item?.student}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">
                  {comparisonType === 'class' ? 'Class' : comparisonType === 'grade' ? 'Grade' : 'School'} Average
                </span>
                <span className="font-mono text-text-secondary">{item?.[comparisonType]}</span>
              </div>
              <div className="w-full bg-background rounded-full h-1">
                <div
                  className="bg-text-secondary h-1 rounded-full transition-all duration-300"
                  style={{ width: `${item?.[comparisonType]}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRankingInfo = () => {
    const currentRanking = rankingData?.[comparisonType];
    
    return (
      <div className="space-y-4">
        <h4 className="text-base font-heading font-semibold text-foreground">
          Ranking & Position
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-muted rounded-lg p-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-2">
              <Icon name="Trophy" size={24} color="var(--color-primary)" />
            </div>
            <div className="text-2xl font-heading font-bold text-foreground">
              #{currentRanking?.position}
            </div>
            <div className="text-xs text-text-secondary">Current Rank</div>
          </div>
          
          <div className="bg-muted rounded-lg p-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-success/10 rounded-lg mx-auto mb-2">
              <Icon name="Users" size={24} color="var(--color-success)" />
            </div>
            <div className="text-2xl font-heading font-bold text-foreground">
              {currentRanking?.total}
            </div>
            <div className="text-xs text-text-secondary">Total Students</div>
          </div>
          
          <div className="bg-muted rounded-lg p-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg mx-auto mb-2">
              <Icon name="Target" size={24} color="var(--color-accent)" />
            </div>
            <div className="text-2xl font-heading font-bold text-foreground">
              {currentRanking?.percentile}%
            </div>
            <div className="text-xs text-text-secondary">Percentile</div>
          </div>
          
          <div className="bg-muted rounded-lg p-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-lg mx-auto mb-2">
              <Icon name="TrendingUp" size={24} color="var(--color-secondary)" />
            </div>
            <div className="text-2xl font-heading font-bold text-foreground">
              {currentRanking?.improvement}
            </div>
            <div className="text-xs text-text-secondary">This Month</div>
          </div>
        </div>
      </div>
    );
  };

  const renderStrengthsWeaknesses = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Strengths */}
      <div className="space-y-4">
        <h4 className="text-base font-heading font-semibold text-success">
          Key Strengths
        </h4>
        <div className="space-y-3">
          {strengthsWeaknesses?.strengths?.map((strength, index) => (
            <div key={index} className="bg-success/5 border border-success/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-sm font-body font-medium text-foreground">
                  {strength?.area}
                </h5>
                <div className="flex items-center space-x-1">
                  <Icon name="TrendingUp" size={14} color="var(--color-success)" />
                  <span className="text-sm font-mono text-success">{strength?.score}%</span>
                </div>
              </div>
              <p className="text-xs text-text-secondary mb-2">{strength?.description}</p>
              <div className="text-xs text-success font-medium">{strength?.comparison}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Weaknesses */}
      <div className="space-y-4">
        <h4 className="text-base font-heading font-semibold text-warning">
          Areas for Improvement
        </h4>
        <div className="space-y-3">
          {strengthsWeaknesses?.weaknesses?.map((weakness, index) => (
            <div key={index} className="bg-warning/5 border border-warning/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-sm font-body font-medium text-foreground">
                  {weakness?.area}
                </h5>
                <div className="flex items-center space-x-1">
                  <Icon name="TrendingDown" size={14} color="var(--color-warning)" />
                  <span className="text-sm font-mono text-warning">{weakness?.score}%</span>
                </div>
              </div>
              <p className="text-xs text-text-secondary mb-2">{weakness?.description}</p>
              <div className="text-xs text-warning font-medium">{weakness?.comparison}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (selectedMetric) {
      case 'overall':
        return renderRadarChart();
      case 'subjects':
        return renderPerformanceComparison();
      case 'skills':
        return renderStrengthsWeaknesses();
      case 'ranking':
        return renderRankingInfo();
      default:
        return renderRadarChart();
    }
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
            Comparative Analysis
          </h3>
          <p className="text-sm text-text-secondary">
            Compare performance against peers and benchmarks
          </p>
        </div>
      </div>
      {/* Comparison Type Selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        {comparisonTypes?.map((type) => (
          <Button
            key={type?.id}
            variant={comparisonType === type?.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setComparisonType(type?.id)}
            iconName={type?.icon}
            iconPosition="left"
            iconSize={16}
          >
            {type?.name}
          </Button>
        ))}
      </div>
      {/* Metric Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {metrics?.map((metric) => (
          <button
            key={metric?.id}
            onClick={() => setSelectedMetric(metric?.id)}
            className={`px-3 py-2 rounded-lg text-sm font-body font-medium transition-all duration-200 ${
              selectedMetric === metric?.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-text-secondary hover:bg-muted/80 hover:text-foreground'
            }`}
          >
            {metric?.name}
          </button>
        ))}
      </div>
      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default ComparativeAnalysis;