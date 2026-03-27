import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import SubjectProgressCard from './components/SubjectProgressCard';
import AchievementBadge from './components/AchievementBadge';
import PerformanceChart from './components/PerformanceChart';
import CompetencyTracker from './components/CompetencyTracker';
import StreakCounter from './components/StreakCounter';
import PeerComparison from './components/PeerComparison';
import GoalSetting from './components/GoalSetting';
import OfflineSyncStatus from './components/OfflineSyncStatus';
import SciFiBackground from '../../components/ui/SciFiBackground';

const StudentProgress = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  // Mock data for subjects progress
  const subjectsData = [
    {
      id: 1,
      name: "Mathematics",
      completionPercentage: 78,
      completedTopics: 23,
      totalTopics: 30,
      timeSpent: 45,
      averageScore: 85,
      lastActivity: "2 hours ago"
    },
    {
      id: 2,
      name: "Science",
      completionPercentage: 65,
      completedTopics: 18,
      totalTopics: 28,
      timeSpent: 38,
      averageScore: 79,
      lastActivity: "1 day ago"
    },
    {
      id: 3,
      name: "Technology",
      completionPercentage: 82,
      completedTopics: 16,
      totalTopics: 20,
      timeSpent: 32,
      averageScore: 88,
      lastActivity: "3 hours ago"
    },
    {
      id: 4,
      name: "Engineering",
      completionPercentage: 45,
      completedTopics: 9,
      totalTopics: 20,
      timeSpent: 22,
      averageScore: 72,
      lastActivity: "5 days ago"
    }
  ];

  // Mock data for achievements
  const achievementsData = [
    {
      id: 1,
      title: "Math Master",
      description: "Complete 20 mathematics topics",
      category: "completion",
      type: "gold",
      isUnlocked: true,
      unlockedDate: "Dec 5, 2024",
      criteria: "Complete 20 topics"
    },
    {
      id: 2,
      title: "Speed Learner",
      description: "Complete 5 topics in one day",
      category: "speed",
      type: "silver",
      isUnlocked: true,
      unlockedDate: "Dec 3, 2024",
      criteria: "Complete 5 topics in 24 hours"
    },
    {
      id: 3,
      title: "Accuracy Expert",
      description: "Achieve 95% accuracy in 10 quizzes",
      category: "accuracy",
      type: "bronze",
      isUnlocked: true,
      unlockedDate: "Dec 1, 2024",
      criteria: "95% accuracy in 10 quizzes"
    },
    {
      id: 4,
      title: "Collaboration Champion",
      description: "Participate in 5 group activities",
      category: "collaboration",
      type: "platinum",
      isUnlocked: false,
      criteria: "Join 5 collaborative sessions"
    },
    {
      id: 5,
      title: "Explorer",
      description: "Try all subject areas",
      category: "exploration",
      type: "gold",
      isUnlocked: false,
      criteria: "Complete at least 1 topic in each subject"
    },
    {
      id: 6,
      title: "Streak Master",
      description: "Maintain 30-day learning streak",
      category: "streak",
      type: "platinum",
      isUnlocked: false,
      criteria: "Study for 30 consecutive days"
    }
  ];

  // Mock data for performance charts
  const performanceData = [
    { period: "Week 1", score: 72, timeSpent: 8 },
    { period: "Week 2", score: 78, timeSpent: 12 },
    { period: "Week 3", score: 85, timeSpent: 15 },
    { period: "Week 4", score: 82, timeSpent: 18 },
    { period: "Week 5", score: 88, timeSpent: 20 },
    { period: "Week 6", score: 91, timeSpent: 22 }
  ];

  // Mock data for competencies
  const competenciesData = [
    {
      id: 1,
      name: "Problem Solving",
      subject: "Mathematics",
      type: "problem-solving",
      masteryLevel: "Proficient",
      progress: 75,
      skills: [
        { name: "Algebraic Thinking", level: "Proficient" },
        { name: "Geometric Reasoning", level: "Developing" },
        { name: "Statistical Analysis", level: "Beginner" }
      ],
      recommendations: ["Practice more geometric problems to improve spatial reasoning"]
    },
    {
      id: 2,
      name: "Scientific Method",
      subject: "Science",
      type: "critical-thinking",
      masteryLevel: "Developing",
      progress: 60,
      skills: [
        { name: "Hypothesis Formation", level: "Developing" },
        { name: "Data Collection", level: "Proficient" },
        { name: "Analysis & Conclusion", level: "Developing" }
      ],
      recommendations: ["Focus on forming clear, testable hypotheses"]
    }
  ];

  // Mock data for streaks
  const streakData = {
    streaks: [
      { type: "daily", current: 12, best: 28, lastActivity: "Today" },
      { type: "weekly", current: 3, best: 8, lastActivity: "This week" },
      { type: "login", current: 15, best: 45, lastActivity: "Today" },
      { type: "completion", current: 8, best: 12, lastActivity: "Yesterday" }
    ],
    weeklyActivity: [
      { day: "Mon", date: 4, completed: true, isToday: false },
      { day: "Tue", date: 5, completed: true, isToday: false },
      { day: "Wed", date: 6, completed: true, isToday: false },
      { day: "Thu", date: 7, completed: false, isToday: false },
      { day: "Fri", date: 8, completed: true, isToday: false },
      { day: "Sat", date: 9, completed: false, isToday: false },
      { day: "Sun", date: 10, completed: true, isToday: true }
    ],
    consistency: {
      weeklyAverage: 78,
      monthlyGoal: 85
    }
  };

  // Mock data for peer comparison
  const peerComparisonData = {
    totalStudents: 45,
    overall: {
      yourRank: 8,
      yourScore: 85,
      percentile: 82,
      classAverage: 76,
      improvement: 5,
      distribution: [
        { range: "90-100", count: 5, max: 100, includesYou: false },
        { range: "80-89", count: 12, max: 89, includesYou: true },
        { range: "70-79", count: 18, max: 79, includesYou: false },
        { range: "60-69", count: 8, max: 69, includesYou: false },
        { range: "50-59", count: 2, max: 59, includesYou: false }
      ]
    },
    timeSpent: {
      yourRank: 12,
      yourScore: 22,
      percentile: 73,
      classAverage: 18,
      improvement: 3,
      distribution: [
        { range: "25-30h", count: 8, max: 30, includesYou: false },
        { range: "20-24h", count: 15, max: 24, includesYou: true },
        { range: "15-19h", count: 12, max: 19, includesYou: false },
        { range: "10-14h", count: 7, max: 14, includesYou: false },
        { range: "5-9h", count: 3, max: 9, includesYou: false }
      ]
    },
    accuracy: {
      yourRank: 6,
      yourScore: 88,
      percentile: 87,
      classAverage: 81,
      improvement: 2,
      distribution: [
        { range: "95-100%", count: 3, max: 100, includesYou: false },
        { range: "85-94%", count: 14, max: 94, includesYou: true },
        { range: "75-84%", count: 16, max: 84, includesYou: false },
        { range: "65-74%", count: 9, max: 74, includesYou: false },
        { range: "55-64%", count: 3, max: 64, includesYou: false }
      ]
    },
    streaks: {
      yourRank: 15,
      yourScore: 12,
      percentile: 67,
      classAverage: 9,
      improvement: 4,
      distribution: [
        { range: "25-30", count: 4, max: 30, includesYou: false },
        { range: "15-24", count: 11, max: 24, includesYou: true },
        { range: "10-14", count: 18, max: 14, includesYou: false },
        { range: "5-9", count: 8, max: 9, includesYou: false },
        { range: "1-4", count: 4, max: 4, includesYou: false }
      ]
    },
    teamAchievements: [
      { title: "Class Math Challenge", participants: 32 },
      { title: "Science Fair Project", participants: 28 }
    ]
  };

  // Mock data for goals
  const [goalsData, setGoalsData] = useState([
    {
      id: 1,
      title: "Complete Algebra Module",
      type: "completion",
      subject: "Mathematics",
      target: "15 topics",
      current: "12 topics",
      progress: 80,
      deadline: "2024-12-20"
    },
    {
      id: 2,
      title: "Achieve 90% Quiz Average",
      type: "score",
      subject: "Science",
      target: "90%",
      current: "85%",
      progress: 85,
      deadline: "2024-12-25"
    }
  ]);

  // Mock data for sync status
  const syncData = {
    lastSync: "2024-12-10T14:30:00Z",
    pendingProgress: 3,
    pendingAchievements: 1,
    pendingGameData: 2,
    storageUsed: 12.5,
    storageLimit: 50
  };

  const timeframes = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'This Quarter' },
    { id: 'year', label: 'This Year' }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'subjects', label: 'Subjects', icon: 'BookOpen' },
    { id: 'achievements', label: 'Achievements', icon: 'Award' },
    { id: 'goals', label: 'Goals', icon: 'Target' },
    { id: 'comparison', label: 'Compare', icon: 'Users' }
  ];

  const handleCreateGoal = (newGoal) => {
    const goal = {
      ...newGoal,
      id: Date.now(),
      current: "0",
      progress: 0
    };
    setGoalsData([...goalsData, goal]);
  };

  const handleUpdateGoal = (goalId, updatedGoal) => {
    setGoalsData(goalsData?.map(goal =>
      goal?.id === goalId ? updatedGoal : goal
    ));
  };

  const handleManualSync = async () => {
    // Simulate sync process
    return new Promise(resolve => {
      setTimeout(resolve, 2000);
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('selectedLanguage');
    // Handle logout logic
  };

  return (
    <div className="min-h-screen bg-transparent relative overflow-x-hidden">
      <SciFiBackground />
      <Header
        userRole="student"
        isAuthenticated={true}
        onLogout={handleLogout}
      />
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
              My Progress
            </h1>
            <p className="text-text-secondary">
              Track your STEM learning journey and achievements
            </p>
          </div>

          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e?.target?.value)}
              className="px-3 py-2 border border-border rounded-lg bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {timeframes?.map((timeframe) => (
                <option key={timeframe?.id} value={timeframe?.id}>
                  {timeframe?.label}
                </option>
              ))}
            </select>

            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
            >
              Export
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-border">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-body font-medium border-b-2 transition-all duration-200 ${activeTab === tab?.id
                ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-foreground hover:border-muted'
                }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-card rounded-lg border border-border p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Icon name="TrendingUp" size={24} color="var(--color-primary)" />
                </div>
                <div className="text-2xl font-heading font-bold text-foreground mb-1">68%</div>
                <div className="text-sm text-text-secondary">Overall Progress</div>
              </div>

              <div className="bg-card rounded-lg border border-border p-6 text-center">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Icon name="Award" size={24} color="var(--color-success)" />
                </div>
                <div className="text-2xl font-heading font-bold text-foreground mb-1">12</div>
                <div className="text-sm text-text-secondary">Achievements</div>
              </div>

              <div className="bg-card rounded-lg border border-border p-6 text-center">
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Icon name="Clock" size={24} color="var(--color-warning)" />
                </div>
                <div className="text-2xl font-heading font-bold text-foreground mb-1">137h</div>
                <div className="text-sm text-text-secondary">Study Time</div>
              </div>

              <div className="bg-card rounded-lg border border-border p-6 text-center">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Icon name="Flame" size={24} color="var(--color-secondary)" />
                </div>
                <div className="text-2xl font-heading font-bold text-foreground mb-1">12</div>
                <div className="text-sm text-text-secondary">Day Streak</div>
              </div>
            </div>

            {/* Charts and Streaks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <PerformanceChart
                data={performanceData}
                type="area"
                title="Learning Progress Over Time"
                color="var(--color-primary)"
              />
              <StreakCounter streakData={streakData} />
            </div>

            {/* Competency and Sync Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <CompetencyTracker competencies={competenciesData} />
              </div>
              <div>
                <OfflineSyncStatus
                  syncData={syncData}
                  onManualSync={handleManualSync}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'subjects' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subjectsData?.map((subject) => (
              <SubjectProgressCard key={subject?.id} subject={subject} />
            ))}
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-8">
            {/* Achievement Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-card rounded-lg border border-border p-6 text-center">
                <div className="text-3xl font-heading font-bold text-success mb-2">3</div>
                <div className="text-sm text-text-secondary">Earned This Month</div>
              </div>
              <div className="bg-card rounded-lg border border-border p-6 text-center">
                <div className="text-3xl font-heading font-bold text-primary mb-2">6</div>
                <div className="text-sm text-text-secondary">Total Achievements</div>
              </div>
              <div className="bg-card rounded-lg border border-border p-6 text-center">
                <div className="text-3xl font-heading font-bold text-warning mb-2">3</div>
                <div className="text-sm text-text-secondary">In Progress</div>
              </div>
            </div>

            {/* Achievement Gallery */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-heading font-semibold text-foreground mb-6">
                Achievement Gallery
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
                {achievementsData?.map((achievement) => (
                  <AchievementBadge key={achievement?.id} achievement={achievement} />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'goals' && (
          <GoalSetting
            goals={goalsData}
            onCreateGoal={handleCreateGoal}
            onUpdateGoal={handleUpdateGoal}
          />
        )}

        {activeTab === 'comparison' && (
          <PeerComparison comparisonData={peerComparisonData} />
        )}
      </main>
    </div>
  );
};

export default StudentProgress;