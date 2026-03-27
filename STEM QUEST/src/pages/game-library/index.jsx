import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import FilterPanel from './components/FilterPanel';
import FeaturedSection from './components/FeaturedSection';
import GameGrid from './components/GameGrid';
import StorageManager from './components/StorageManager';

import Button from '../../components/ui/Button';
import SciFiBackground from '../../components/ui/SciFiBackground';

const GameLibrary = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(true);
  const [showStorageManager, setShowStorageManager] = useState(false);

  // Mock games data
  const mockGames = [
    {
      id: 'html-tag-matcher',
      title: 'HTML Tag Matcher',
      description: 'Drag and drop HTML tags to their correct descriptions. Learn the building blocks of the web!',
      subject: 'Technology',
      gradeLevel: [1, 2, 3, 4, 5, 6],
      difficulty: 'Easy',
      duration: '10 min',
      playCount: 4500,
      thumbnail: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=300&fit=crop',
      isDownloaded: true,
      isFeatured: true,
      fileSize: '15 MB',
      rating: 4.9,
      lastPlayed: new Date('2025-01-12')
    },
    {
      id: 'stem-circuits',
      title: 'STEM Circuits: Logic Quest',
      description: 'Master the flow of energy! Connect switches and logic gates to power up your machines.',
      subject: 'Engineering',
      gradeLevel: [3, 4, 5, 6],
      difficulty: 'Medium',
      duration: '15 min',
      playCount: 3800,
      thumbnail: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop',
      isDownloaded: true,
      isFeatured: true,
      fileSize: '25 MB',
      rating: 4.8,
      lastPlayed: new Date('2025-01-11')
    },
    {
      id: 'physics-simulation',
      title: 'Rocket Science: Orbital Dodge',
      description: 'Dodge asteroids and answer science questions to keep your rocket flying! Mastery of 1-6 grade science required.',
      subject: 'Science',
      gradeLevel: [1, 2, 3, 4, 5, 6],
      difficulty: 'Medium',
      duration: '20 min',
      playCount: 5200,
      thumbnail: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=300&fit=crop',
      isDownloaded: true,
      isFeatured: true,
      fileSize: '40 MB',
      rating: 4.7,
      lastPlayed: new Date('2025-01-10')
    },
    {
      id: 'dragon-math-1',
      title: 'Dragon Math Quest',
      description: 'Command a fierce dragon to battle progressively stronger skeletons by solving math problems! Learn addition and multiplication while defending your kingdom.',
      subject: 'Math',
      gradeLevel: [1, 2, 3, 4, 5, 6],
      difficulty: 'Easy',
      duration: '15 min',
      playCount: 4100,
      thumbnail: '/cyberpunk_dragon_math_card_1769871591049.png',
      isDownloaded: true,
      isFeatured: true,
      fileSize: '30 MB',
      rating: 4.9,
      lastPlayed: new Date('2025-01-09')
    },
    {
      id: 'english-word-adventure',
      title: 'English Word Adventure',
      description: 'Pop colorful bubbles to form English words! The faster you pop, the higher your combo. Learn animals, fruits, and action words.',
      subject: 'Language',
      gradeLevel: [1, 2, 3],
      difficulty: 'Easy',
      duration: '10 min',
      playCount: 3200,
      thumbnail: '/english_logo.png',
      isDownloaded: true,
      isFeatured: true,
      fileSize: '18 MB',
      rating: 4.8,
      lastPlayed: new Date('2025-01-08')
    },
    {
      id: 'hindi-akshar-quest',
      title: 'Hindi Akshar Quest',
      description: 'Move your basket to catch the falling Hindi letters! Learn Swar and Vyanjan while dodging distractors in this fast-paced arcade game.',
      subject: 'Language',
      gradeLevel: [1, 2],
      difficulty: 'Medium',
      duration: '12 min',
      playCount: 2800,
      thumbnail: '/hindi_logo.png',
      isDownloaded: false,
      isFeatured: true,
      fileSize: '22 MB',
      rating: 4.9,
      lastPlayed: new Date('2025-01-07')
    }
  ];

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    subject: 'all',
    gradeLevel: 'all',
    difficulty: [],
    showDownloaded: false,
    showFeatured: false,
    sortBy: 'popularity'
  });

  // Storage data
  const storageData = {
    totalStorage: 2 * 1024 * 1024 * 1024, // 2GB in bytes
    usedStorage: 515 * 1024 * 1024, // 515MB in bytes
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter and sort games
  const filteredGames = useMemo(() => {
    let filtered = [...mockGames];

    // Search filter
    if (filters?.search) {
      const searchTerm = filters?.search?.toLowerCase();
      filtered = filtered?.filter(game =>
        game?.title?.toLowerCase()?.includes(searchTerm) ||
        game?.description?.toLowerCase()?.includes(searchTerm) ||
        game?.subject?.toLowerCase()?.includes(searchTerm)
      );
    }

    // Subject filter
    if (filters?.subject !== 'all') {
      filtered = filtered?.filter(game => game?.subject === filters?.subject);
    }

    // Grade level filter
    if (filters?.gradeLevel !== 'all') {
      const grade = parseInt(filters?.gradeLevel);
      filtered = filtered?.filter(game => game?.gradeLevel?.includes(grade));
    }

    // Difficulty filter
    if (filters?.difficulty?.length > 0) {
      filtered = filtered?.filter(game => filters?.difficulty?.includes(game?.difficulty));
    }

    // Downloaded filter
    if (filters?.showDownloaded) {
      filtered = filtered?.filter(game => game?.isDownloaded);
    }

    // Featured filter
    if (filters?.showFeatured) {
      filtered = filtered?.filter(game => game?.isFeatured);
    }

    // Sort games
    switch (filters?.sortBy) {
      case 'popularity':
        filtered?.sort((a, b) => b?.playCount - a?.playCount);
        break;
      case 'newest':
        filtered?.sort((a, b) => new Date(b.lastPlayed || 0) - new Date(a.lastPlayed || 0));
        break;
      case 'difficulty':
        const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
        filtered?.sort((a, b) => difficultyOrder?.[a?.difficulty] - difficultyOrder?.[b?.difficulty]);
        break;
      case 'duration':
        filtered?.sort((a, b) => parseInt(a?.duration) - parseInt(b?.duration));
        break;
      case 'alphabetical':
        filtered?.sort((a, b) => a?.title?.localeCompare(b?.title));
        break;
      default:
        break;
    }

    return filtered;
  }, [filters]);

  // Get featured games
  const featuredGames = mockGames?.filter(game => game?.isFeatured);

  // Get downloaded games
  const downloadedGames = mockGames?.filter(game => game?.isDownloaded);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      search: '',
      subject: 'all',
      gradeLevel: 'all',
      difficulty: [],
      showDownloaded: false,
      showFeatured: false,
      sortBy: 'popularity'
    });
  };

  // Game actions
  const handlePlayGame = (gameId) => {
    navigate(`/game-player?id=${gameId}`);
  };

  const handleDownloadGame = async (gameId) => {
    // Simulate download process
    console.log(`Downloading game: ${gameId}`);
    // In real app, this would trigger actual download
  };

  const handleRemoveGame = (gameId) => {
    // Simulate game removal
    console.log(`Removing game: ${gameId}`);
    // In real app, this would remove from local storage
  };

  const handleClearAllDownloads = () => {
    // Simulate clearing all downloads
    console.log('Clearing all downloaded games');
    // In real app, this would clear all local storage
  };

  const handleLogout = () => {
    navigate('/student-login');
  };

  return (
    <div className="min-h-screen bg-transparent relative">
      <SciFiBackground />
      <Header
        userRole="student"
        isAuthenticated={true}
        onLogout={handleLogout}
      />
      <main className="container mx-auto px-4 py-6 lg:py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground mb-2">
              Game Library
            </h1>
            <p className="text-text-secondary">
              Discover interactive STEM games designed for your grade level
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={showStorageManager ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowStorageManager(!showStorageManager)}
              iconName="HardDrive"
              iconPosition="left"
              iconSize={16}
              className="hidden lg:flex"
            >
              Storage
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFilterCollapsed(!isFilterCollapsed)}
              iconName="Filter"
              iconPosition="left"
              iconSize={16}
              className="lg:hidden"
            >
              Filters
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Filter Panel */}
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              isCollapsed={isFilterCollapsed}
              onToggleCollapse={() => setIsFilterCollapsed(!isFilterCollapsed)}
            />

            {/* Storage Manager */}
            {(showStorageManager || downloadedGames?.length > 0) && (
              <div className="hidden lg:block">
                <StorageManager
                  downloadedGames={downloadedGames}
                  totalStorage={storageData?.totalStorage}
                  usedStorage={storageData?.usedStorage}
                  onRemoveGame={handleRemoveGame}
                  onClearAll={handleClearAllDownloads}
                />
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Featured Section */}
            {!filters?.search && filters?.subject === 'all' && filters?.gradeLevel === 'all' &&
              filters?.difficulty?.length === 0 && !filters?.showDownloaded && !filters?.showFeatured && (
                <FeaturedSection
                  featuredGames={featuredGames}
                  onPlay={handlePlayGame}
                  onDownload={handleDownloadGame}
                />
              )}

            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-heading font-semibold text-foreground">
                  {filters?.search || filters?.subject !== 'all' || filters?.gradeLevel !== 'all' ||
                    filters?.difficulty?.length > 0 || filters?.showDownloaded || filters?.showFeatured
                    ? 'Search Results' : 'All Games'
                  }
                </h2>
                <p className="text-sm text-text-secondary mt-1">
                  {loading ? 'Loading...' : `${filteredGames?.length} game${filteredGames?.length !== 1 ? 's' : ''} found`}
                </p>
              </div>

              {/* Mobile Storage Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowStorageManager(!showStorageManager)}
                iconName="HardDrive"
                iconSize={16}
                className="lg:hidden"
              >
                <span className="sr-only">Storage manager</span>
              </Button>
            </div>

            {/* Mobile Storage Manager */}
            {showStorageManager && (
              <div className="lg:hidden">
                <StorageManager
                  downloadedGames={downloadedGames}
                  totalStorage={storageData?.totalStorage}
                  usedStorage={storageData?.usedStorage}
                  onRemoveGame={handleRemoveGame}
                  onClearAll={handleClearAllDownloads}
                />
              </div>
            )}

            {/* Games Grid */}
            <GameGrid
              games={filteredGames}
              loading={loading}
              onPlay={handlePlayGame}
              onDownload={handleDownloadGame}
              onRemove={handleRemoveGame}
              emptyMessage={
                filters?.search || filters?.subject !== 'all' || filters?.gradeLevel !== 'all' ||
                  filters?.difficulty?.length > 0 || filters?.showDownloaded || filters?.showFeatured
                  ? 'No games match your current filters' : 'No games available'
              }
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default GameLibrary;