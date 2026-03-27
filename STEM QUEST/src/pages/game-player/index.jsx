import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import GamePlayerNavigation from '../../components/ui/GamePlayerNavigation';
import GameViewport from './components/GameViewport';
import ProgressTracker from './components/ProgressTracker';
import GameControls from './components/GameControls';
import AchievementNotification, { AchievementQueue } from './components/AchievementNotification';
import HintSystem from './components/HintSystem';
import OfflineIndicator from './components/OfflineIndicator';
import SciFiBackground from '../../components/ui/SciFiBackground';
import axios from 'axios';

const GamePlayer = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const gameId = searchParams?.get('id') || 'physics-simulation';

  // Game State
  const [gameData, setGameData] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [levelProgress, setLevelProgress] = useState(0);
  const [overallProgress, setOverallProgress] = useState(15);
  const [isSaving, setIsSaving] = useState(false);

  // UI State
  const [showHints, setShowHints] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [achievements, setAchievements] = useState([]);
  const [pendingAchievements, setPendingAchievements] = useState([]);

  // Offline State
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [syncStatus, setSyncStatus] = useState('synced');
  const [pendingActions, setPendingActions] = useState(0);

  // Mock game data (registry)
  const mockGames = {
    'physics-simulation': {
      id: 'physics-simulation',
      title: 'Rocket Science: Orbital Dodge',
      type: 'physics-simulation',
      subject: 'Science',
      grade: 6,
      totalLevels: 8,
      description: 'Dodge asteroids and answer science questions to keep your rocket flying!'
    },
    'html-tag-matcher': {
      id: 'html-tag-matcher',
      title: 'HTML Tag Matcher',
      type: 'html-tag-matcher',
      subject: 'Technology',
      grade: 4,
      totalLevels: 10,
      description: 'Drag and drop HTML tags to their correct descriptions.'
    },
    'stem-circuits': {
      id: 'stem-circuits',
      title: 'STEM Circuits: Logic Quest',
      type: 'stem-circuits',
      subject: 'Engineering',
      grade: 5,
      totalLevels: 3,
      description: 'Connect switches and logic gates to power up your machines.'
    },
    'dragon-math-1': {
      id: 'dragon-math-1',
      title: 'Dragon Math Quest',
      type: 'dragon-math',
      subject: 'Mathematics',
      grade: 5,
      totalLevels: 5,
      description: 'Battle skeletons by solving math problems!'
    },
    'english-word-adventure': {
      id: 'english-word-adventure',
      title: 'English Word Adventure',
      type: 'english-word',
      subject: 'Language',
      grade: 2,
      totalLevels: 4,
      description: 'Pop bubbles and learn new English words!'
    },
    'hindi-akshar-quest': {
      id: 'hindi-akshar-quest',
      title: 'Hindi Akshar Quest',
      type: 'hindi-akshar',
      subject: 'Language',
      grade: 1,
      totalLevels: 3,
      description: 'Catch falling Hindi letters to score points!'
    }
  };

  // Mock hints data
  const mockHints = [
    {
      id: 'hint-1',
      type: 'concept',
      title: 'Understanding Projectile Motion',
      content: `Projectile motion occurs when an object is launched into the air and moves under the influence of gravity alone. The path forms a parabola.`,
      visual: {
        type: 'formula',
        content: 'y = x·tan(θ) - (g·x²)/(2·v₀²·cos²(θ))',
        explanation: 'This is the trajectory equation for projectile motion'
      },
      difficulty: 2,
      relatedConcepts: ['Gravity', 'Velocity', 'Angle']
    },
    {
      id: 'hint-2',
      type: 'method',
      title: 'Optimizing Launch Angle',
      content: `For maximum range on level ground, the optimal launch angle is 45 degrees. However, this changes with different target heights.`,
      visual: {
        type: 'steps',
        steps: [
          'Set the launch angle to 45 degrees',
          'Adjust velocity based on distance to target',
          'Account for air resistance if applicable',
          'Fine-tune based on target elevation'
        ]
      },
      difficulty: 3,
      relatedConcepts: ['Optimization', 'Trigonometry']
    },
    {
      id: 'hint-3',
      type: 'example',
      title: 'Real-world Applications',
      content: `Projectile motion principles are used in sports (basketball shots), military (artillery), and space exploration (satellite launches).`,
      difficulty: 1,
      relatedConcepts: ['Applications', 'Physics in Daily Life']
    }
  ];

  // Mock achievements data
  const mockAchievementTemplates = [
    {
      id: 'first-hit',
      title: 'Bullseye!',
      description: 'Hit your first target successfully',
      type: 'bronze',
      category: 'accuracy',
      rewards: { points: 50, badge: true }
    },
    {
      id: 'speed-demon',
      title: 'Speed Demon',
      description: 'Complete a level in under 2 minutes',
      type: 'silver',
      category: 'speed',
      rewards: { points: 100, badge: true }
    },
    {
      id: 'perfectionist',
      title: 'Perfectionist',
      description: 'Complete a level without using any hints',
      type: 'gold',
      category: 'mastery',
      rewards: { points: 200, badge: true, unlock: 'Advanced Levels' }
    }
  ];

  // Play Limit State
  const [playTime, setPlayTime] = useState(0);
  const [dailyLimitReached, setDailyLimitReached] = useState(false);
  const PLAY_LIMIT = 60 * 60; // 1 hour in seconds

  // Initialize game data and sync with backend
  useEffect(() => {
    const fetchProgress = async () => {
      // Find game by ID
      const game = mockGames?.[gameId] ||
        mockGames?.[Object.keys(mockGames).find(k => k.includes(gameId))] ||
        mockGames?.['physics-simulation'];
      setGameData(game);

      const userStr = localStorage.getItem('stemquest_user');
      const token = localStorage.getItem('stemquest_token');

      if (userStr && token) {
        try {
          // Check daily limit
          const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/auth/me`, {
            headers: { 'x-auth-token': token }
          });
          if (res.data.dailyPlayTime >= PLAY_LIMIT) {
            setDailyLimitReached(true);
          }
          setPlayTime(res.data.dailyPlayTime || 0);
        } catch (err) {
          console.error('Failed to sync progress:', err);
        }
      }
    };
    fetchProgress();
  }, [gameId]);

  // Track active play time
  useEffect(() => {
    if (isPaused || dailyLimitReached) return;
    const timer = setInterval(() => {
      setPlayTime(t => {
        const newTime = t + 1;
        if (newTime >= PLAY_LIMIT) setDailyLimitReached(true);
        return newTime;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaused, dailyLimitReached]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/progress`, {
        gameId,
        score: levelProgress * 10, // Example score
        progress: overallProgress,
        playTime: 10 // Added 10 seconds of play time for this session
      }, {
        headers: { 'x-auth-token': localStorage.getItem('stemquest_token') }
      });
      setIsSaving(false);
    } catch (err) {
      console.error('Failed to save progress');
      setIsSaving(false);
    }
  };

  if (dailyLimitReached) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-12 text-center max-w-lg border-8 border-indigo-600 shadow-2xl animate-in">
          <div className="bg-amber-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="Clock" size={48} className="text-amber-600" />
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-4">BRAIN BREAK TIME!</h2>
          <p className="text-slate-600 mb-8 font-medium">You've reached your daily STEM Quest limit. Great job today! Time to rest your eyes and come back tomorrow for more adventures.</p>
          <Button onClick={() => navigate('/student-dashboard')} size="lg" fullWidth>GO TO DASHBOARD</Button>
        </div>
      </div>
    );
  }

  const handlePause = () => setIsPaused(true);
  const handleResume = () => setIsPaused(false);

  const handleExit = () => {
    // Auto-save before exit
    handleSave()?.then(() => {
      navigate('/game-library');
    });
  };

  const handleHint = () => {
    if (hintsRemaining > 0) {
      setShowHints(true);
      setHintsRemaining(prev => prev - 1);
    }
  };

  const handleHintUsed = (hint) => {
    console.log('Hint used:', hint);
  };

  const handleHintClose = () => {
    setShowHints(false);
  };

  const handleSettings = (type) => {
    console.log('Settings requested:', type);
    // Handle different settings types
  };

  const handleProgressUpdate = (progress) => {
    setLevelProgress(prev => Math.min(prev + progress, 100));

    // Check for achievements
    if (progress > 0) {
      checkForAchievements(progress);
    }
  };

  const handleLevelComplete = () => {
    if (currentLevel < gameData?.totalLevels) {
      setCurrentLevel(prev => prev + 1);
      setLevelProgress(0);
      setOverallProgress(prev => Math.min(prev + (100 / gameData?.totalLevels), 100));
      setHintsRemaining(3); // Reset hints for new level

      // Award level completion achievement
      const achievement = {
        ...mockAchievementTemplates?.[0],
        id: `level-${currentLevel}-complete`,
        title: `Level ${currentLevel} Complete!`,
        description: `Successfully completed level ${currentLevel}`
      };

      setPendingAchievements(prev => [...prev, achievement]);
    }
  };

  const checkForAchievements = (progress) => {
    // Simulate achievement checking logic
    if (Math.random() > 0.8) { // 20% chance for demo
      const randomAchievement = mockAchievementTemplates?.[Math.floor(Math.random() * mockAchievementTemplates?.length)];

      setPendingAchievements(prev => [...prev, {
        ...randomAchievement,
        timestamp: new Date()?.toISOString()
      }]);
    }
  };

  const handleAchievementClose = (achievement) => {
    setPendingAchievements(prev =>
      prev?.filter(a => a?.id !== achievement?.id)
    );
    setAchievements(prev => [...prev, achievement]);
  };

  const handleRetrySync = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('synced');
      setPendingActions(0);
    }, 2000);
  };

  if (!gameData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading game...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent relative">
      <SciFiBackground />
      {/* Navigation */}
      <GamePlayerNavigation
        gameName={gameData?.title}
        onPause={handlePause}
        onSave={handleSave}
        onExit={handleExit}
        isPaused={isPaused}
        isSaving={isSaving}
        showMinimal={false}
      />
      {/* Main Game Area */}
      <div className="pt-14 p-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-120px)]">
          {/* Game Viewport - Main Area */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <GameViewport
              gameData={gameData}
              onGameComplete={handleLevelComplete}
              onProgressUpdate={handleProgressUpdate}
              isPaused={isPaused}
              currentLevel={currentLevel}
              totalLevels={gameData?.totalLevels}
            />
          </div>

          {/* Sidebar - Progress & Controls */}
          <div className="lg:col-span-1 order-1 lg:order-2 space-y-4">
            {/* Progress Tracker */}
            <ProgressTracker
              currentLevel={currentLevel}
              totalLevels={gameData?.totalLevels}
              levelProgress={levelProgress}
              overallProgress={overallProgress}
              achievements={achievements}
              onLevelComplete={handleLevelComplete}
            />

            {/* Game Controls */}
            <GameControls
              isPaused={isPaused}
              onPause={handlePause}
              onResume={handleResume}
              onHint={handleHint}
              onSettings={handleSettings}
              onExit={handleExit}
              hintsRemaining={hintsRemaining}
              canUseHint={hintsRemaining > 0}
              isOffline={isOffline}
            />
          </div>
        </div>
      </div>
      {/* Hint System */}
      <HintSystem
        hints={mockHints}
        currentHintIndex={currentHintIndex}
        onHintUsed={handleHintUsed}
        onHintClose={handleHintClose}
        isVisible={showHints}
        gameContext={gameData}
      />
      {/* Achievement Notifications */}
      <AchievementQueue
        achievements={pendingAchievements}
        onAchievementClose={handleAchievementClose}
      />
      {/* Offline Indicator */}
      <OfflineIndicator
        isOffline={isOffline}
        syncStatus={syncStatus}
        pendingActions={pendingActions}
        onRetrySync={handleRetrySync}
      />
    </div>
  );
};

export default GamePlayer;