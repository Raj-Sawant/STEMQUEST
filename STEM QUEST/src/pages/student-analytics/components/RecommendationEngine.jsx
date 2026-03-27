import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecommendationEngine = ({ studentData }) => {
  const [selectedCategory, setSelectedCategory] = useState('learning');
  const [expandedCard, setExpandedCard] = useState(null);

  const recommendations = {
    learning: [
      {
        id: 1,
        title: 'Focus on Algebraic Concepts',
        priority: 'high',
        category: 'Mathematics',
        description: 'Student shows strong arithmetic skills but struggles with abstract algebraic thinking',
        suggestedActions: [
          'Complete "Algebra Foundations" game series',
          'Practice with visual algebra manipulatives',
          'Work through 15 minutes of algebra problems daily'
        ],
        expectedOutcome: 'Improve algebra scores by 15-20% within 2 weeks',
        timeEstimate: '2-3 weeks',
        difficulty: 'Medium',
        resources: [
          { name: 'Algebra Quest Game', type: 'game', duration: '30 min' },
          { name: 'Visual Algebra Tutorial', type: 'video', duration: '15 min' },
          { name: 'Practice Worksheets', type: 'worksheet', duration: '20 min' }
        ]
      },
      {
        id: 2,
        title: 'Enhance Problem-Solving Speed',
        priority: 'medium',
        category: 'General Skills',
        description: 'Student demonstrates good problem-solving accuracy but takes longer than average',
        suggestedActions: [
          'Practice timed problem-solving exercises',
          'Learn pattern recognition techniques',
          'Use speed-building mini-games'
        ],
        expectedOutcome: 'Reduce problem-solving time by 25%',
        timeEstimate: '3-4 weeks',
        difficulty: 'Easy',
        resources: [
          { name: 'Speed Math Challenge', type: 'game', duration: '20 min' },
          { name: 'Pattern Recognition Quiz', type: 'quiz', duration: '10 min' }
        ]
      },
      {
        id: 3,
        title: 'Strengthen Physics Fundamentals',
        priority: 'low',
        category: 'Science',
        description: 'Good understanding of basic concepts but needs reinforcement in advanced topics',
        suggestedActions: [
          'Review force and motion simulations',
          'Complete interactive physics experiments',
          'Join peer study groups for physics'
        ],
        expectedOutcome: 'Solid foundation for advanced physics concepts',
        timeEstimate: '4-5 weeks',
        difficulty: 'Hard',
        resources: [
          { name: 'Physics Simulator', type: 'simulation', duration: '45 min' },
          { name: 'Force & Motion Lab', type: 'experiment', duration: '60 min' }
        ]
      }
    ],
    engagement: [
      {
        id: 4,
        title: 'Increase Session Duration',
        priority: 'medium',
        category: 'Engagement',
        description: 'Student has frequent but short learning sessions. Longer sessions could improve retention',
        suggestedActions: [
          'Set 45-minute focused study blocks',
          'Use gamification rewards for longer sessions',
          'Create engaging project-based activities'
        ],
        expectedOutcome: 'Increase average session time from 25 to 40 minutes',
        timeEstimate: '2 weeks',
        difficulty: 'Easy',
        resources: [
          { name: 'Focus Timer App', type: 'tool', duration: 'Variable' },
          { name: 'Project Builder Game', type: 'game', duration: '45 min' }
        ]
      },
      {
        id: 5,
        title: 'Encourage Peer Collaboration',
        priority: 'low',
        category: 'Social Learning',
        description: 'Student works well independently but could benefit from collaborative learning',
        suggestedActions: [
          'Join study groups for challenging topics',
          'Participate in team-based challenges',
          'Mentor younger students in strong subjects'
        ],
        expectedOutcome: 'Improved communication and teamwork skills',
        timeEstimate: 'Ongoing',
        difficulty: 'Medium',
        resources: [
          { name: 'Team Challenge Arena', type: 'game', duration: '30 min' },
          { name: 'Peer Tutoring Program', type: 'program', duration: '60 min' }
        ]
      }
    ],
    intervention: [
      {
        id: 6,
        title: 'Address Time Management Issues',
        priority: 'high',
        category: 'Study Skills',
        description: 'Student frequently runs out of time on assessments despite knowing the material',
        suggestedActions: [
          'Practice with timed assessments',
          'Learn time allocation strategies',
          'Use visual time management tools'
        ],
        expectedOutcome: 'Complete assessments within time limits',
        timeEstimate: '2-3 weeks',
        difficulty: 'Medium',
        resources: [
          { name: 'Time Management Workshop', type: 'workshop', duration: '90 min' },
          { name: 'Timed Practice Tests', type: 'assessment', duration: '45 min' }
        ]
      },
      {
        id: 7,
        title: 'Reduce Hint Dependency',
        priority: 'medium',
        category: 'Independence',
        description: 'Student relies heavily on hints and guidance, limiting independent problem-solving',
        suggestedActions: [
          'Gradually reduce hint availability',
          'Practice self-reflection techniques',
          'Build confidence through easier challenges first'
        ],
        expectedOutcome: 'Increase independent problem-solving by 40%',
        timeEstimate: '3-4 weeks',
        difficulty: 'Hard',
        resources: [
          { name: 'Independent Challenge Mode', type: 'game', duration: '30 min' },
          { name: 'Self-Assessment Tools', type: 'tool', duration: '15 min' }
        ]
      }
    ]
  };

  const categories = [
    { id: 'learning', name: 'Learning Path', icon: 'BookOpen', color: 'var(--color-primary)' },
    { id: 'engagement', name: 'Engagement', icon: 'Zap', color: 'var(--color-success)' },
    { id: 'intervention', name: 'Interventions', icon: 'AlertCircle', color: 'var(--color-warning)' }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'var(--color-error)';
      case 'medium': return 'var(--color-warning)';
      case 'low': return 'var(--color-success)';
      default: return 'var(--color-text-secondary)';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return 'AlertTriangle';
      case 'medium': return 'Clock';
      case 'low': return 'CheckCircle';
      default: return 'Info';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'var(--color-success)';
      case 'Medium': return 'var(--color-warning)';
      case 'Hard': return 'var(--color-error)';
      default: return 'var(--color-text-secondary)';
    }
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case 'game': return 'Gamepad2';
      case 'video': return 'Play';
      case 'worksheet': return 'FileText';
      case 'quiz': return 'HelpCircle';
      case 'simulation': return 'Atom';
      case 'experiment': return 'Flask';
      case 'tool': return 'Settings';
      case 'workshop': return 'Users';
      case 'assessment': return 'ClipboardCheck';
      case 'program': return 'GraduationCap';
      default: return 'Book';
    }
  };

  const currentRecommendations = recommendations?.[selectedCategory] || [];

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
            AI Recommendations
          </h3>
          <p className="text-sm text-text-secondary">
            Personalized suggestions based on performance analytics
          </p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            iconSize={16}
          >
            Refresh
          </Button>
        </div>
      </div>
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories?.map((category) => (
          <Button
            key={category?.id}
            variant={selectedCategory === category?.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category?.id)}
            iconName={category?.icon}
            iconPosition="left"
            iconSize={16}
          >
            {category?.name}
          </Button>
        ))}
      </div>
      {/* Recommendations List */}
      <div className="space-y-4">
        {currentRecommendations?.map((recommendation) => (
          <div
            key={recommendation?.id}
            className="bg-muted rounded-lg border border-border overflow-hidden"
          >
            {/* Card Header */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getPriorityColor(recommendation?.priority) }}
                    />
                    <span className="text-xs font-caption text-text-secondary uppercase tracking-wide">
                      {recommendation?.category}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Icon
                        name={getPriorityIcon(recommendation?.priority)}
                        size={12}
                        color={getPriorityColor(recommendation?.priority)}
                      />
                      <span
                        className="text-xs font-caption uppercase"
                        style={{ color: getPriorityColor(recommendation?.priority) }}
                      >
                        {recommendation?.priority} Priority
                      </span>
                    </div>
                  </div>
                  <h4 className="text-base font-heading font-semibold text-foreground mb-2">
                    {recommendation?.title}
                  </h4>
                  <p className="text-sm text-text-secondary">
                    {recommendation?.description}
                  </p>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setExpandedCard(
                    expandedCard === recommendation?.id ? null : recommendation?.id
                  )}
                  iconName={expandedCard === recommendation?.id ? 'ChevronUp' : 'ChevronDown'}
                  iconSize={16}
                >
                  <span className="sr-only">Toggle details</span>
                </Button>
              </div>

              {/* Quick Info */}
              <div className="flex flex-wrap gap-4 text-xs">
                <div className="flex items-center space-x-1">
                  <Icon name="Clock" size={12} color="var(--color-text-secondary)" />
                  <span className="text-text-secondary">{recommendation?.timeEstimate}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="BarChart3" size={12} color={getDifficultyColor(recommendation?.difficulty)} />
                  <span style={{ color: getDifficultyColor(recommendation?.difficulty) }}>
                    {recommendation?.difficulty}
                  </span>
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedCard === recommendation?.id && (
              <div className="border-t border-border p-4 bg-background">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Suggested Actions */}
                  <div className="space-y-3">
                    <h5 className="text-sm font-heading font-semibold text-foreground">
                      Suggested Actions
                    </h5>
                    <ul className="space-y-2">
                      {recommendation?.suggestedActions?.map((action, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Icon name="CheckCircle" size={14} color="var(--color-success)" />
                          <span className="text-sm text-foreground">{action}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mt-4">
                      <div className="flex items-start space-x-2">
                        <Icon name="Target" size={16} color="var(--color-primary)" />
                        <div>
                          <h6 className="text-sm font-body font-medium text-foreground mb-1">
                            Expected Outcome
                          </h6>
                          <p className="text-sm text-text-secondary">
                            {recommendation?.expectedOutcome}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Resources */}
                  <div className="space-y-3">
                    <h5 className="text-sm font-heading font-semibold text-foreground">
                      Recommended Resources
                    </h5>
                    <div className="space-y-2">
                      {recommendation?.resources?.map((resource, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-surface rounded-lg">
                              <Icon
                                name={getResourceIcon(resource?.type)}
                                size={16}
                                color="var(--color-primary)"
                              />
                            </div>
                            <div>
                              <h6 className="text-sm font-body font-medium text-foreground">
                                {resource?.name}
                              </h6>
                              <p className="text-xs text-text-secondary">
                                {resource?.type} • {resource?.duration}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            iconName="ExternalLink"
                            iconSize={14}
                          >
                            Start
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-border">
                  <Button
                    variant="default"
                    iconName="Play"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Start Recommendation
                  </Button>
                  <Button
                    variant="outline"
                    iconName="Calendar"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Schedule Later
                  </Button>
                  <Button
                    variant="ghost"
                    iconName="X"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
        <div className="text-center">
          <div className="text-lg font-heading font-bold text-error">
            {recommendations?.learning?.filter(r => r?.priority === 'high')?.length + 
             recommendations?.engagement?.filter(r => r?.priority === 'high')?.length + 
             recommendations?.intervention?.filter(r => r?.priority === 'high')?.length}
          </div>
          <div className="text-xs text-text-secondary">High Priority</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-heading font-bold text-warning">
            {recommendations?.learning?.filter(r => r?.priority === 'medium')?.length + 
             recommendations?.engagement?.filter(r => r?.priority === 'medium')?.length + 
             recommendations?.intervention?.filter(r => r?.priority === 'medium')?.length}
          </div>
          <div className="text-xs text-text-secondary">Medium Priority</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-heading font-bold text-success">
            {recommendations?.learning?.filter(r => r?.priority === 'low')?.length + 
             recommendations?.engagement?.filter(r => r?.priority === 'low')?.length + 
             recommendations?.intervention?.filter(r => r?.priority === 'low')?.length}
          </div>
          <div className="text-xs text-text-secondary">Low Priority</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-heading font-bold text-primary">
            {Object.values(recommendations)?.flat()?.length}
          </div>
          <div className="text-xs text-text-secondary">Total Items</div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationEngine;