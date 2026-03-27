import React from 'react';
import GameCard from './GameCard';
import Icon from '../../../components/AppIcon';

const GameGrid = ({ games, loading, onPlay, onDownload, onRemove, emptyMessage }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 })?.map((_, index) => (
          <div key={index} className="bg-card rounded-xl border border-border overflow-hidden animate-pulse">
            <div className="h-48 bg-muted" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-full" />
              <div className="h-3 bg-muted rounded w-2/3" />
              <div className="flex space-x-2">
                <div className="h-8 bg-muted rounded flex-1" />
                <div className="h-8 w-8 bg-muted rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (games?.length === 0) {
    return (
      <div className="text-center py-12">
        <Icon name="Search" size={64} color="var(--color-text-secondary)" className="mx-auto mb-4 opacity-50" />
        <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
          {emptyMessage || 'No games found'}
        </h3>
        <p className="text-text-secondary max-w-md mx-auto">
          Try adjusting your filters or search terms to find the games you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {games?.map((game) => (
        <GameCard
          key={game?.id}
          game={game}
          onPlay={onPlay}
          onDownload={onDownload}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default GameGrid;