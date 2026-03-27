import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const PerformanceChart = ({ data, type = 'line', title, color = 'var(--color-primary)' }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-modal">
          <p className="text-sm font-body font-medium text-foreground mb-1">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm text-text-secondary">
              <span className="font-body font-medium">{entry?.name}:</span> {entry?.value}
              {entry?.dataKey === 'score' && '%'}
              {entry?.dataKey === 'timeSpent' && 'h'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    if (type === 'area') {
      return (
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis 
            dataKey="period" 
            tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }}
            axisLine={{ stroke: 'var(--color-border)' }}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }}
            axisLine={{ stroke: 'var(--color-border)' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="score" 
            stroke={color}
            fill={`${color}20`}
            strokeWidth={2}
            name="Score"
          />
        </AreaChart>
      );
    }

    return (
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis 
          dataKey="period" 
          tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }}
          axisLine={{ stroke: 'var(--color-border)' }}
        />
        <YAxis 
          tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }}
          axisLine={{ stroke: 'var(--color-border)' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey="score" 
          stroke={color}
          strokeWidth={2}
          dot={{ fill: color, strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, fill: color }}
          name="Score"
        />
        {data?.[0]?.timeSpent !== undefined && (
          <Line 
            type="monotone" 
            dataKey="timeSpent" 
            stroke="var(--color-secondary)"
            strokeWidth={2}
            dot={{ fill: 'var(--color-secondary)', strokeWidth: 2, r: 4 }}
            name="Time Spent"
          />
        )}
      </LineChart>
    );
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="text-lg font-heading font-semibold text-foreground mb-4">{title}</h3>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;