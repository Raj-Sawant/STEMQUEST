import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GoalSetting = ({ goals, onUpdateGoal, onCreateGoal }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    type: 'completion',
    target: '',
    deadline: '',
    subject: 'Mathematics'
  });

  const goalTypes = [
    { id: 'completion', label: 'Complete Topics', icon: 'CheckCircle' },
    { id: 'score', label: 'Achieve Score', icon: 'Target' },
    { id: 'time', label: 'Study Time', icon: 'Clock' },
    { id: 'streak', label: 'Maintain Streak', icon: 'Flame' }
  ];

  const subjects = ['Mathematics', 'Science', 'Technology', 'Engineering'];

  const getGoalIcon = (type) => {
    const goal = goalTypes?.find(g => g?.id === type);
    return goal ? goal?.icon : 'Target';
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return 'text-success';
    if (progress >= 75) return 'text-primary';
    if (progress >= 50) return 'text-warning';
    return 'text-error';
  };

  const getProgressBgColor = (progress) => {
    if (progress >= 100) return 'bg-success';
    if (progress >= 75) return 'bg-primary';
    if (progress >= 50) return 'bg-warning';
    return 'bg-error';
  };

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleCreateGoal = () => {
    if (newGoal?.title && newGoal?.target && newGoal?.deadline) {
      onCreateGoal?.(newGoal);
      setNewGoal({
        title: '',
        type: 'completion',
        target: '',
        deadline: '',
        subject: 'Mathematics'
      });
      setShowCreateForm(false);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-heading font-semibold text-foreground">Learning Goals</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowCreateForm(!showCreateForm)}
          iconName="Plus"
          iconPosition="left"
        >
          New Goal
        </Button>
      </div>
      {/* Create Goal Form */}
      {showCreateForm && (
        <div className="bg-muted/30 rounded-lg p-4 mb-6">
          <h4 className="font-body font-medium text-foreground mb-4">Create New Goal</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-body font-medium text-foreground mb-2">
                Goal Title
              </label>
              <input
                type="text"
                value={newGoal?.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e?.target?.value })}
                placeholder="Enter goal title"
                className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-body font-medium text-foreground mb-2">
                Goal Type
              </label>
              <select
                value={newGoal?.type}
                onChange={(e) => setNewGoal({ ...newGoal, type: e?.target?.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {goalTypes?.map((type) => (
                  <option key={type?.id} value={type?.id}>{type?.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-body font-medium text-foreground mb-2">
                Target
              </label>
              <input
                type="text"
                value={newGoal?.target}
                onChange={(e) => setNewGoal({ ...newGoal, target: e?.target?.value })}
                placeholder="e.g., 5 topics, 85%, 20 hours"
                className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-body font-medium text-foreground mb-2">
                Deadline
              </label>
              <input
                type="date"
                value={newGoal?.deadline}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: e?.target?.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCreateForm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleCreateGoal}
            >
              Create Goal
            </Button>
          </div>
        </div>
      )}
      {/* Goals List */}
      <div className="space-y-4">
        {goals?.map((goal) => (
          <div key={goal?.id} className="border border-border rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mt-1">
                  <Icon name={getGoalIcon(goal?.type)} size={18} color="var(--color-primary)" />
                </div>
                <div>
                  <h4 className="font-body font-medium text-foreground">{goal?.title}</h4>
                  <p className="text-sm text-text-secondary">{goal?.subject} • Target: {goal?.target}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-text-secondary">
                    <div className="flex items-center space-x-1">
                      <Icon name="Calendar" size={12} />
                      <span>{getDaysRemaining(goal?.deadline)} days left</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="TrendingUp" size={12} />
                      <span>Progress: {goal?.progress}%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`text-lg font-heading font-bold ${getProgressColor(goal?.progress)}`}>
                {goal?.progress}%
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressBgColor(goal?.progress)}`}
                  style={{ width: `${goal?.progress}%` }}
                />
              </div>
            </div>

            {/* Goal Actions */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-text-secondary">
                {goal?.progress >= 100 ? (
                  <div className="flex items-center space-x-1 text-success">
                    <Icon name="CheckCircle" size={14} />
                    <span>Goal Completed!</span>
                  </div>
                ) : (
                  <span>Current: {goal?.current} / {goal?.target}</span>
                )}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onUpdateGoal?.(goal?.id, { ...goal, progress: Math.min(100, goal?.progress + 10) })}
                  iconName="Plus"
                  iconSize={14}
                >
                  Update
                </Button>
              </div>
            </div>
          </div>
        ))}

        {goals?.length === 0 && !showCreateForm && (
          <div className="text-center py-8">
            <Icon name="Target" size={48} color="var(--color-text-secondary)" className="mx-auto mb-4" />
            <h4 className="text-lg font-heading font-medium text-foreground mb-2">No Goals Set</h4>
            <p className="text-text-secondary mb-4">Set learning goals to track your progress and stay motivated.</p>
            <Button
              variant="default"
              onClick={() => setShowCreateForm(true)}
              iconName="Plus"
              iconPosition="left"
            >
              Create Your First Goal
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalSetting;