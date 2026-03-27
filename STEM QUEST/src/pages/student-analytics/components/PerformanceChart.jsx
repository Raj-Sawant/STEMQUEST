import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PerformanceChart = ({ studentData, selectedSubject, onSubjectChange }) => {
  const [chartType, setChartType] = useState('line');
  const [timeRange, setTimeRange] = useState('month');

  const subjects = [
    { id: 'math', name: 'Mathematics', color: '#2563EB' },
    { id: 'science', name: 'Science', color: '#10B981' },
    { id: 'technology', name: 'Technology', color: '#F59E0B' },
    { id: 'engineering', name: 'Engineering', color: '#7C3AED' }
  ];

  const performanceData = [
    { date: 'Week 1', math: 65, science: 72, technology: 58, engineering: 61 },
    { date: 'Week 2', math: 68, science: 75, technology: 62, engineering: 65 },
    { date: 'Week 3', math: 72, science: 78, technology: 68, engineering: 70 },
    { date: 'Week 4', math: 75, science: 82, technology: 72, engineering: 74 },
    { date: 'Week 5', math: 78, science: 85, technology: 75, engineering: 78 },
    { date: 'Week 6', math: 82, science: 88, technology: 78, engineering: 82 }
  ];

  const skillBreakdown = {
    math: [
      { skill: 'Algebra', score: 85, maxScore: 100 },
      { skill: 'Geometry', score: 78, maxScore: 100 },
      { skill: 'Statistics', score: 72, maxScore: 100 },
      { skill: 'Calculus', score: 68, maxScore: 100 }
    ],
    science: [
      { skill: 'Physics', score: 88, maxScore: 100 },
      { skill: 'Chemistry', score: 82, maxScore: 100 },
      { skill: 'Biology', score: 85, maxScore: 100 },
      { skill: 'Earth Science', score: 79, maxScore: 100 }
    ],
    technology: [
      { skill: 'Programming', score: 75, maxScore: 100 },
      { skill: 'Digital Literacy', score: 82, maxScore: 100 },
      { skill: 'Data Analysis', score: 70, maxScore: 100 },
      { skill: 'Web Design', score: 68, maxScore: 100 }
    ],
    engineering: [
      { skill: 'Design Thinking', score: 80, maxScore: 100 },
      { skill: 'Problem Solving', score: 85, maxScore: 100 },
      { skill: 'Systems Analysis', score: 72, maxScore: 100 },
      { skill: 'Project Management', score: 75, maxScore: 100 }
    ]
  };

  const currentSubject = subjects?.find(s => s?.id === selectedSubject) || subjects?.[0];
  const currentSkills = skillBreakdown?.[selectedSubject] || skillBreakdown?.math;

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
            Performance Analytics
          </h3>
          <p className="text-sm text-text-secondary">
            Track progress across STEM subjects over time
          </p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Button
            variant={chartType === 'line' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('line')}
            iconName="TrendingUp"
            iconSize={16}
          >
            Trend
          </Button>
          <Button
            variant={chartType === 'bar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('bar')}
            iconName="BarChart3"
            iconSize={16}
          >
            Compare
          </Button>
        </div>
      </div>
      {/* Subject Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {subjects?.map((subject) => (
          <button
            key={subject?.id}
            onClick={() => onSubjectChange(subject?.id)}
            className={`px-4 py-2 rounded-lg text-sm font-body font-medium transition-all duration-200 ${
              selectedSubject === subject?.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-text-secondary hover:bg-muted/80 hover:text-foreground'
            }`}
          >
            {subject?.name}
          </button>
        ))}
      </div>
      {/* Chart Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis 
                    dataKey="date" 
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
                  <Line
                    type="monotone"
                    dataKey={selectedSubject}
                    stroke={currentSubject?.color}
                    strokeWidth={3}
                    dot={{ fill: currentSubject?.color, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: currentSubject?.color, strokeWidth: 2 }}
                  />
                </LineChart>
              ) : (
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis 
                    dataKey="date" 
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
                  {subjects?.map((subject) => (
                    <Bar
                      key={subject?.id}
                      dataKey={subject?.id}
                      fill={subject?.color}
                      opacity={selectedSubject === subject?.id ? 1 : 0.3}
                    />
                  ))}
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Breakdown */}
        <div className="space-y-4">
          <h4 className="text-base font-heading font-semibold text-foreground">
            {currentSubject?.name} Skills
          </h4>
          <div className="space-y-3">
            {currentSkills?.map((skill, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-body text-foreground">
                    {skill?.skill}
                  </span>
                  <span className="text-sm font-mono text-text-secondary">
                    {skill?.score}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${skill?.score}%`,
                      backgroundColor: currentSubject?.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Performance Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-success/10 rounded-lg mx-auto mb-2">
            <Icon name="TrendingUp" size={20} color="var(--color-success)" />
          </div>
          <div className="text-2xl font-heading font-bold text-foreground">
            {performanceData?.[performanceData?.length - 1]?.[selectedSubject]}%
          </div>
          <div className="text-xs text-text-secondary">Current Score</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-2">
            <Icon name="Target" size={20} color="var(--color-primary)" />
          </div>
          <div className="text-2xl font-heading font-bold text-foreground">
            +{performanceData?.[performanceData?.length - 1]?.[selectedSubject] - performanceData?.[0]?.[selectedSubject]}%
          </div>
          <div className="text-xs text-text-secondary">Improvement</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg mx-auto mb-2">
            <Icon name="Award" size={20} color="var(--color-accent)" />
          </div>
          <div className="text-2xl font-heading font-bold text-foreground">A-</div>
          <div className="text-xs text-text-secondary">Grade</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-lg mx-auto mb-2">
            <Icon name="Users" size={20} color="var(--color-secondary)" />
          </div>
          <div className="text-2xl font-heading font-bold text-foreground">85th</div>
          <div className="text-xs text-text-secondary">Percentile</div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;