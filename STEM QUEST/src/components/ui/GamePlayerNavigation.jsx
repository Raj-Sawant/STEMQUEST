import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const GamePlayerNavigation = ({ 
  gameName = "Current Game",
  onPause,
  onSave,
  onExit,
  isPaused = false,
  isSaving = false,
  showMinimal = false 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleExit = () => {
    if (onExit) {
      onExit();
    } else {
      navigate('/game-library');
    }
  };

  const handlePause = () => {
    if (onPause) {
      onPause();
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (showMinimal) {
    return (
      <div className="fixed top-4 right-4 z-150">
        <div className="relative">
          <Button
            variant="secondary"
            size="icon"
            onClick={toggleMenu}
            className="bg-surface/90 backdrop-blur-sm shadow-modal"
            iconName="MoreVertical"
            iconSize={18}
          >
            <span className="sr-only">Game menu</span>
          </Button>

          {isMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-surface rounded-lg shadow-modal border border-border animate-fade-in">
              <div className="p-2 space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePause}
                  iconName={isPaused ? 'Play' : 'Pause'}
                  iconPosition="left"
                  className="w-full justify-start"
                >
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  loading={isSaving}
                  iconName="Save"
                  iconPosition="left"
                  className="w-full justify-start"
                >
                  Save Progress
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExit}
                  iconName="ArrowLeft"
                  iconPosition="left"
                  className="w-full justify-start"
                >
                  Exit Game
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-surface/95 backdrop-blur-sm border-b border-border z-150">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Game Info */}
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleExit}
            iconName="ArrowLeft"
            iconSize={20}
            className="hover-scale"
          >
            <span className="sr-only">Exit game</span>
          </Button>
          <div className="flex items-center space-x-2">
            <Icon name="Gamepad2" size={18} color="var(--color-primary)" />
            <span className="text-sm font-body font-medium text-foreground truncate max-w-48">
              {gameName}
            </span>
          </div>
        </div>

        {/* Game Controls */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePause}
            iconName={isPaused ? 'Play' : 'Pause'}
            iconPosition="left"
            iconSize={16}
            className="hidden sm:flex"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            loading={isSaving}
            iconName="Save"
            iconPosition="left"
            iconSize={16}
          >
            <span className="hidden sm:inline">Save</span>
            <span className="sr-only sm:hidden">Save progress</span>
          </Button>

          {/* Mobile Menu */}
          <div className="sm:hidden relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              iconName="MoreVertical"
              iconSize={18}
            >
              <span className="sr-only">More options</span>
            </Button>

            {isMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-40 bg-surface rounded-lg shadow-modal border border-border animate-fade-in">
                <div className="p-2 space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      handlePause();
                      setIsMenuOpen(false);
                    }}
                    iconName={isPaused ? 'Play' : 'Pause'}
                    iconPosition="left"
                    className="w-full justify-start"
                  >
                    {isPaused ? 'Resume' : 'Pause'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePlayerNavigation;