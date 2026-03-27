import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import PerformanceChart from './components/PerformanceChart';
import EngagementMetrics from './components/EngagementMetrics';
import AchievementTimeline from './components/AchievementTimeline';
import ComparativeAnalysis from './components/ComparativeAnalysis';
import RecommendationEngine from './components/RecommendationEngine';

const StudentAnalytics = () => {
  const navigate = useNavigate();
  const [selectedStudent, setSelectedStudent] = useState('student-1');
  const [selectedSubject, setSelectedSubject] = useState('math');
  const [activeTab, setActiveTab] = useState('overview');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [lastSyncTime, setLastSyncTime] = useState(new Date());

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      const token = localStorage.getItem('stemquest_token');
      if (!token) {
        setError('No login session found. Please log in as a teacher to access this page.');
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/teacher/students`, {
          headers: { 'x-auth-token': token }
        });
        setStudents(res.data);
        if (res.data.length > 0) setSelectedStudent(res.data[0]._id);
      } catch (err) {
        if (err.response?.status === 403) {
          setError('Access denied. This page is only available for teacher accounts.');
        } else if (err.response?.status === 401) {
          setError('Session expired. Please log in again.');
        } else if (err.code === 'ERR_NETWORK' || err.code === 'ECONNREFUSED') {
          setError('Cannot connect to server. Make sure the backend is running on port 5000.');
        } else {
          setError(err.response?.data?.msg || 'Failed to load students. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const currentStudent = students?.find(s => s?._id === selectedStudent) || students?.[0];

  const analyticsOverview = {
    totalStudents: 28,
    activeToday: 24,
    averageScore: 79,
    completionRate: 87,
    engagementTime: 47,
    improvementRate: 12
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: 'LayoutDashboard' },
    { id: 'performance', name: 'Performance', icon: 'TrendingUp' },
    { id: 'engagement', name: 'Engagement', icon: 'Zap' },
    { id: 'achievements', name: 'Achievements', icon: 'Award' },
    { id: 'comparison', name: 'Comparison', icon: 'BarChart3' },
    { id: 'recommendations', name: 'AI Insights', icon: 'Brain' }
  ];

  const handleLogout = () => {
    navigate('/student-login');
  };

  const handleExportReport = () => {
    // Mock export functionality
    console.log('Exporting analytics report for:', currentStudent?.name);
  };

  const handleSendAlert = () => {
    // Mock alert functionality
    console.log('Sending intervention alert for:', currentStudent?.name);
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-surface rounded-lg border border-border p-4 text-center">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg mx-auto mb-2">
            <Icon name="Users" size={20} color="var(--color-primary)" />
          </div>
          <div className="text-xl font-heading font-bold text-foreground">
            {analyticsOverview?.totalStudents}
          </div>
          <div className="text-xs text-text-secondary">Total Students</div>
        </div>

        <div className="bg-surface rounded-lg border border-border p-4 text-center">
          <div className="flex items-center justify-center w-10 h-10 bg-success/10 rounded-lg mx-auto mb-2">
            <Icon name="UserCheck" size={20} color="var(--color-success)" />
          </div>
          <div className="text-xl font-heading font-bold text-foreground">
            {analyticsOverview?.activeToday}
          </div>
          <div className="text-xs text-text-secondary">Active Today</div>
        </div>

        <div className="bg-surface rounded-lg border border-border p-4 text-center">
          <div className="flex items-center justify-center w-10 h-10 bg-accent/10 rounded-lg mx-auto mb-2">
            <Icon name="Target" size={20} color="var(--color-accent)" />
          </div>
          <div className="text-xl font-heading font-bold text-foreground">
            {analyticsOverview?.averageScore}%
          </div>
          <div className="text-xs text-text-secondary">Avg Score</div>
        </div>

        <div className="bg-surface rounded-lg border border-border p-4 text-center">
          <div className="flex items-center justify-center w-10 h-10 bg-secondary/10 rounded-lg mx-auto mb-2">
            <Icon name="CheckCircle" size={20} color="var(--color-secondary)" />
          </div>
          <div className="text-xl font-heading font-bold text-foreground">
            {analyticsOverview?.completionRate}%
          </div>
          <div className="text-xs text-text-secondary">Completion</div>
        </div>

        <div className="bg-surface rounded-lg border border-border p-4 text-center">
          <div className="flex items-center justify-center w-10 h-10 bg-warning/10 rounded-lg mx-auto mb-2">
            <Icon name="Clock" size={20} color="var(--color-warning)" />
          </div>
          <div className="text-xl font-heading font-bold text-foreground">
            {analyticsOverview?.engagementTime}m
          </div>
          <div className="text-xs text-text-secondary">Avg Session</div>
        </div>

        <div className="bg-surface rounded-lg border border-border p-4 text-center">
          <div className="flex items-center justify-center w-10 h-10 bg-error/10 rounded-lg mx-auto mb-2">
            <Icon name="TrendingUp" size={20} color="var(--color-error)" />
          </div>
          <div className="text-xl font-heading font-bold text-foreground">
            +{analyticsOverview?.improvementRate}%
          </div>
          <div className="text-xs text-text-secondary">Improvement</div>
        </div>
      </div>

      {/* Main Analytics Components */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <PerformanceChart
          studentData={currentStudent}
          selectedSubject={selectedSubject}
          onSubjectChange={setSelectedSubject}
        />
        <EngagementMetrics studentData={currentStudent} />
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'performance':
        return (
          <PerformanceChart
            studentData={currentStudent}
            selectedSubject={selectedSubject}
            onSubjectChange={setSelectedSubject}
          />
        );
      case 'engagement':
        return <EngagementMetrics studentData={currentStudent} />;
      case 'achievements':
        return <AchievementTimeline studentData={currentStudent} />;
      case 'comparison':
        return <ComparativeAnalysis studentData={currentStudent} />;
      case 'recommendations':
        return <RecommendationEngine studentData={currentStudent} />;
      default:
        return renderOverviewTab();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-text-secondary">Loading student data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md p-8">
          <Icon name="AlertCircle" size={48} color="var(--color-error)" style={{ margin: '0 auto' }} />
          <h2 className="text-xl font-heading font-bold text-foreground">Access Denied</h2>
          <p className="text-text-secondary">{error}</p>
          <Button onClick={() => navigate('/student-login')} variant="primary">Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        userRole="teacher"
        isAuthenticated={true}
        onLogout={handleLogout}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/student-login')}
                iconName="ArrowLeft"
                iconSize={20}
              >
                <span className="sr-only">Back to dashboard</span>
              </Button>
              <div>
                <h1 className="text-2xl font-heading font-bold text-foreground">
                  Student Analytics
                </h1>
                <p className="text-sm text-text-secondary">
                  Comprehensive performance insights and learning analytics
                </p>
              </div>
            </div>

            {/* Offline Indicator */}
            {isOffline && (
              <div className="flex items-center space-x-2 mt-2 px-3 py-2 bg-warning/10 border border-warning/20 rounded-lg">
                <Icon name="WifiOff" size={16} color="var(--color-warning)" />
                <span className="text-sm text-warning">
                  Offline mode - Data last synced {lastSyncTime?.toLocaleTimeString()}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <Button
              variant="outline"
              onClick={handleExportReport}
              iconName="Download"
              iconPosition="left"
              iconSize={16}
            >
              Export Report
            </Button>
            <Button
              variant="outline"
              onClick={handleSendAlert}
              iconName="Bell"
              iconPosition="left"
              iconSize={16}
            >
              Send Alert
            </Button>
          </div>
        </div>

        {/* Student Selector */}
        <div className="bg-surface rounded-lg border border-border p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={currentStudent?.avatar}
                alt={currentStudent?.name}
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = '/assets/images/no_image.png';
                }}
              />
              <div>
                <h2 className="text-lg font-heading font-semibold text-foreground">
                  {currentStudent?.name}
                </h2>
                <p className="text-sm text-text-secondary">
                  {currentStudent?.grade} • Overall Score: {currentStudent?.overallScore}% • Play Time: {Math.floor((currentStudent?.dailyPlayTime || 0) / 60)}m / 60m
                </p>
              </div>
              <div className="flex items-center space-x-1">
                <Icon
                  name={currentStudent?.trend === 'up' ? 'TrendingUp' : 'Minus'}
                  size={16}
                  color={currentStudent?.trend === 'up' ? 'var(--color-success)' : 'var(--color-text-secondary)'}
                />
                <span className="text-sm text-text-secondary">
                  Last active: {currentStudent?.lastActive ? new Date(currentStudent.lastActive).toLocaleTimeString() : 'N/A'}
                </span>
              </div>
            </div>

            <div className="mt-4 sm:mt-0">
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e?.target?.value)}
                className="px-4 py-2 border border-border rounded-lg bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {students?.map(student => (
                  <option key={student?._id} value={student?._id}>
                    {student?.name} - Grade {student?.grade}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-surface rounded-lg border border-border mb-6">
          <div className="flex overflow-x-auto">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-body font-medium whitespace-nowrap transition-all duration-200 border-b-2 ${activeTab === tab?.id
                  ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-text-secondary hover:text-foreground hover:bg-muted/50'
                  }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

export default StudentAnalytics;