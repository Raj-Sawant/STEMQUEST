import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GameControls = ({ 
  isPaused, 
  onPause, 
  onResume, 
  onHint, 
  onSettings, 
  onExit,
  hintsRemaining = 3,
  canUseHint = true,
  isOffline = false 
}) => {
  const [showHintConfirm, setShowHintConfirm] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const handlePauseToggle = () => {
    if (isPaused) {
      onResume?.();
    } else {
      onPause?.();
    }
  };

  const handleHintRequest = () => {
    if (canUseHint && hintsRemaining > 0) {
      setShowHintConfirm(true);
    }
  };

  const confirmHint = () => {
    onHint?.();
    setShowHintConfirm(false);
  };

  const handleExitRequest = () => {
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
    onExit?.();
    setShowExitConfirm(false);
  };

  return (
    <>
      <div className="bg-surface rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Game Controls</h3>
          {isOffline && (
            <div className="flex items-center space-x-1 text-warning text-xs">
              <Icon name="WifiOff" size={12} />
              <span>Offline</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Pause/Resume Button */}
          <Button
            variant={isPaused ? "primary" : "outline"}
            onClick={handlePauseToggle}
            iconName={isPaused ? "Play" : "Pause"}
            iconPosition="left"
            className="w-full"
          >
            {isPaused ? "Resume" : "Pause"}
          </Button>

          {/* Hint Button */}
          <Button
            variant="outline"
            onClick={handleHintRequest}
            disabled={!canUseHint || hintsRemaining === 0}
            iconName="Lightbulb"
            iconPosition="left"
            className="w-full"
          >
            Hint ({hintsRemaining})
          </Button>

          {/* Settings Button */}
          <Button
            variant="ghost"
            onClick={onSettings}
            iconName="Settings"
            iconPosition="left"
            className="w-full"
          >
            Settings
          </Button>

          {/* Exit Button */}
          <Button
            variant="ghost"
            onClick={handleExitRequest}
            iconName="LogOut"
            iconPosition="left"
            className="w-full"
          >
            Exit Game
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Quick Actions</span>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onSettings?.('audio')}
                iconName="Volume2"
                iconSize={16}
              >
                <span className="sr-only">Audio settings</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onSettings?.('fullscreen')}
                iconName="Maximize"
                iconSize={16}
              >
                <span className="sr-only">Fullscreen</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hint Confirmation Modal */}
      {showHintConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-200 p-4">
          <div className="bg-surface rounded-lg p-6 max-w-sm w-full animate-scale-in">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name="Lightbulb" size={24} color="var(--color-accent)" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Use a Hint?</h3>
              <p className="text-text-secondary text-sm">
                This will use one of your {hintsRemaining} remaining hints for this level.
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowHintConfirm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={confirmHint}
                className="flex-1"
              >
                Use Hint
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-200 p-4">
          <div className="bg-surface rounded-lg p-6 max-w-sm w-full animate-scale-in">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name="AlertTriangle" size={24} color="var(--color-warning)" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Exit Game?</h3>
              <p className="text-text-secondary text-sm">
                Your progress will be saved automatically. You can continue from where you left off.
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowExitConfirm(false)}
                className="flex-1"
              >
                Stay
              </Button>
              <Button
                variant="warning"
                onClick={confirmExit}
                className="flex-1"
              >
                Exit
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GameControls;