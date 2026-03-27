import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const GameCard = ({ game, onPlay, onDownload, onRemove }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await onDownload(game?.id);
    } finally {
      setIsDownloading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-success bg-success/10';
      case 'medium': return 'text-warning bg-warning/10';
      case 'hard': return 'text-error bg-error/10';
      default: return 'text-text-secondary bg-muted';
    }
  };

  const getSubjectIcon = (subject) => {
    const icons = {
      'Math': 'Calculator',
      'Science': 'Atom',
      'Technology': 'Laptop',
      'Engineering': 'Cog'
    };
    return icons?.[subject] || 'BookOpen';
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
      {/* Game Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={game?.thumbnail}
          alt={game?.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Overlay Icons */}
        <div className="absolute top-3 left-3 flex items-center space-x-2">
          <div className="bg-surface/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center space-x-1">
            <Icon name={getSubjectIcon(game?.subject)} size={14} color="var(--color-primary)" />
            <span className="text-xs font-caption text-foreground">{game?.subject}</span>
          </div>
        </div>

        <div className="absolute top-3 right-3">
          {game?.isDownloaded ? (
            <div className="bg-success/90 backdrop-blur-sm rounded-lg p-2">
              <Icon name="Download" size={16} color="white" />
            </div>
          ) : (
            <div className="bg-surface/90 backdrop-blur-sm rounded-lg p-2">
              <Icon name="Cloud" size={16} color="var(--color-text-secondary)" />
            </div>
          )}
        </div>

        {/* Featured Badge */}
        {game?.isFeatured && (
          <div className="absolute bottom-3 left-3">
            <div className="bg-accent/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center space-x-1">
              <Icon name="Star" size={12} color="white" />
              <span className="text-xs font-caption text-white">Featured</span>
            </div>
          </div>
        )}
      </div>
      {/* Game Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-heading font-semibold text-foreground line-clamp-2 flex-1">
            {game?.title}
          </h3>
        </div>

        <p className="text-sm text-text-secondary mb-3 line-clamp-2">
          {game?.description}
        </p>

        {/* Game Metadata */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`px-2 py-1 rounded-md text-xs font-caption ${getDifficultyColor(game?.difficulty)}`}>
              {game?.difficulty}
            </div>
            <div className="flex items-center space-x-1 text-text-secondary">
              <Icon name="Clock" size={14} />
              <span className="text-xs font-caption">{game?.duration}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-text-secondary">
            <Icon name="Users" size={14} />
            <span className="text-xs font-caption">{game?.playCount}+ plays</span>
          </div>
        </div>

        {/* Grade Level */}
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="GraduationCap" size={14} color="var(--color-text-secondary)" />
          <span className="text-sm font-body text-text-secondary">
            Grade {game?.gradeLevel?.join('-')}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => onPlay(game?.id)}
            iconName="Play"
            iconPosition="left"
            iconSize={16}
            className="flex-1"
          >
            Play Now
          </Button>

          {game?.isDownloaded ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRemove(game?.id)}
              iconName="Trash2"
              iconSize={16}
            >
              <span className="sr-only">Remove download</span>
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              loading={isDownloading}
              iconName="Download"
              iconSize={16}
            >
              <span className="sr-only">Download for offline</span>
            </Button>
          )}
        </div>

        {/* Storage Info for Downloaded Games */}
        {game?.isDownloaded && (
          <div className="mt-2 flex items-center space-x-1 text-xs text-text-secondary">
            <Icon name="HardDrive" size={12} />
            <span>{game?.fileSize}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameCard;