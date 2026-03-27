import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/ui/Header';
import WelcomeCard from './components/WelcomeCard';
import RecentGamesCard from './components/RecentGamesCard';
import SubjectQuickAccess from './components/SubjectQuickAccess';
import AchievementShowcase from './components/AchievementShowcase';
import ProgressOverview from './components/ProgressOverview';
import OfflineStatus from './components/OfflineStatus';
import SciFiBackground from '../../components/ui/SciFiBackground';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [studentData, setStudentData] = useState({
    name: "EXPLORER",
    grade: "N/A",
    currentStreak: 0,
    totalPoints: 0,
    level: 1,
    avatar: null
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('stemquest_token');
      if (token) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/auth/me`, {
            headers: { 'x-auth-token': token }
          });
          const user = response.data;
          setStudentData({
            name: user.username,
            grade: user.grade || 8,
            currentStreak: 7, // Hardcoded for now until streak logic is added to backend
            totalPoints: user.dailyPlayTime * 10, // Example points calculation
            level: Math.floor(user.dailyPlayTime / 3600) + 1, // Level based on play time (1 hour = +1 level)
            avatar: user.avatar
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  // Mock recent games data
  const recentGames = [
    {
      id: 'dragon-math-1',
      title: "Dragon Math Quest",
      subject: "Math",
      difficulty: "Easy",
      progress: 75,
      lastPlayed: "2025-01-09",
      thumbnail: '/cyberpunk_dragon_math_card_1769871591049.png'
    },
    {
      id: 'stem-circuits',
      title: "STEM Circuits: Logic Quest",
      subject: "Engineering",
      difficulty: "Medium",
      progress: 45,
      lastPlayed: "2025-01-08",
      thumbnail: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop'
    },
    {
      id: 'html-tag-matcher',
      title: "HTML Tag Matcher",
      subject: "Technology",
      difficulty: "Easy",
      progress: 90,
      lastPlayed: "2025-01-07",
      thumbnail: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=300&fit=crop'
    },
    {
      id: 4,
      title: "Physics Simulation",
      subject: "Science",
      difficulty: "Medium",
      progress: 60,
      lastPlayed: "2025-01-06",
      thumbnail: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=300&fit=crop'
    }
  ];

  // Mock subjects data
  const subjects = [
    {
      name: "Math",
      gameCount: 24,
      progress: 68
    },
    {
      name: "Science",
      gameCount: 18,
      progress: 52
    },
    {
      name: "Technology",
      gameCount: 15,
      progress: 73
    },
    {
      name: "Engineering",
      gameCount: 12,
      progress: 41
    }
  ];

  // Mock achievements data
  const achievements = {
    totalBadges: 15,
    completedChallenges: 8,
    currentLevel: 12
  };

  const recentBadges = [
    {
      id: 1,
      name: "Math Master",
      type: "mastery",
      rarity: "rare",
      description: "Complete 10 math games with 90% accuracy",
      earnedAt: "2025-01-08"
    },
    {
      id: 2,
      name: "Week Warrior",
      type: "streak",
      rarity: "common",
      description: "Maintain a 7-day learning streak",
      earnedAt: "2025-01-07"
    },
    {
      id: 3,
      name: "Explorer",
      type: "exploration",
      rarity: "epic",
      description: "Try games from all 4 STEM subjects",
      earnedAt: "2025-01-05"
    },
    {
      id: 4,
      name: "Quick Learner",
      type: "completion",
      rarity: "rare",
      description: "Complete a game in under 30 minutes",
      earnedAt: "2025-01-04"
    }
  ];

  // Mock progress data
  const progressData = [
    {
      name: "Math",
      progress: 68,
      completedLessons: 17,
      totalLessons: 25,
      timeSpent: 12.5
    },
    {
      name: "Science",
      progress: 52,
      completedLessons: 13,
      totalLessons: 25,
      timeSpent: 8.2
    },
    {
      name: "Technology",
      progress: 73,
      completedLessons: 11,
      totalLessons: 15,
      timeSpent: 9.8
    },
    {
      name: "Engineering",
      progress: 41,
      completedLessons: 5,
      totalLessons: 12,
      timeSpent: 6.1
    }
  ];

  const weeklyGoal = {
    target: 10,
    completed: 7.2
  };

  // Mock offline content data
  const cachedContent = {
    games: 8,
    size: "245 MB"
  };

  const syncStatus = {
    progress: 100,
    lastSync: new Date()
  };

  useEffect(() => {
    const userData = localStorage.getItem('stemquest_user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setStudentData({
          name: user.username || "RAJ SAWANT",
          grade: user.grade || 8,
          currentStreak: 12,
          totalPoints: 21450,
          level: user.level || 12
        });
      } catch (e) {
        console.error("Error parsing user data");
      }
    }

    // Check for saved language preference
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const handleLogout = () => {
    try {
      // Clear any stored authentication data
      localStorage.removeItem('authToken');
      localStorage.removeItem('studentData');
      localStorage.removeItem('stemquest_user');
      localStorage.removeItem('stemquest_language');

      // Clear any session storage as well
      sessionStorage.clear();

      // Force immediate navigation without delay
      navigate('/student-login', { replace: true });

      // Reload the page to ensure clean state
      window.location?.reload();
    } catch (error) {
      console.error('Logout error:', error);
      // Force navigation and reload even if cleanup fails
      window.location.href = '/student-login';
    }
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
        {/* Welcome Section */}
        <div className="mb-8">
          <WelcomeCard
            studentName={studentData?.name}
            currentStreak={studentData?.currentStreak}
            totalPoints={studentData?.totalPoints}
            level={studentData?.level}
            grade={studentData?.grade}
            avatar={studentData?.avatar}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Recent Games & Subjects */}
          <div className="lg:col-span-2 space-y-6">
            <RecentGamesCard recentGames={recentGames} />
            <SubjectQuickAccess subjects={subjects} />
          </div>

          {/* Right Column - Progress & Achievements */}
          <div className="space-y-6">
            <ProgressOverview
              progressData={progressData}
              weeklyGoal={weeklyGoal}
            />
            <OfflineStatus
              cachedContent={cachedContent}
              syncStatus={syncStatus}
            />
          </div>
        </div>

        {/* Bottom Section - Achievements */}
        <div className="mb-6">
          <AchievementShowcase
            achievements={achievements}
            recentBadges={recentBadges}
          />
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;