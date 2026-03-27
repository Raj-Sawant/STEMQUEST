import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const FeaturedSection = ({ featuredGames, onPlay, onDownload }) => {
  if (!featuredGames || featuredGames?.length === 0) {
    return null;
  }

  const mainFeatured = featuredGames?.[0];
  const otherFeatured = featuredGames?.slice(1, 3);

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
    <div className="mb-8">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="Star" size={24} color="var(--color-accent)" />
        <h2 className="text-2xl font-heading font-bold text-foreground">Featured Games</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Featured Game */}
        <div className="lg:col-span-2">
          <div className="relative bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group">
            <div className="relative h-64 lg:h-80 overflow-hidden">
              <Image
                src={mainFeatured?.thumbnail}
                alt={mainFeatured?.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Featured Badge */}
              <div className="absolute top-4 left-4">
                <div className="bg-accent rounded-lg px-3 py-1 flex items-center space-x-1">
                  <Icon name="Star" size={14} color="white" />
                  <span className="text-sm font-caption text-white font-medium">Featured</span>
                </div>
              </div>

              {/* Download Status */}
              <div className="absolute top-4 right-4">
                {mainFeatured?.isDownloaded ? (
                  <div className="bg-success rounded-lg p-2">
                    <Icon name="Download" size={16} color="white" />
                  </div>
                ) : (
                  <div className="bg-surface/90 backdrop-blur-sm rounded-lg p-2">
                    <Icon name="Cloud" size={16} color="var(--color-text-secondary)" />
                  </div>
                )}
              </div>

              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name={getSubjectIcon(mainFeatured?.subject)} size={16} color="white" />
                  <span className="text-sm font-caption text-white/90">{mainFeatured?.subject}</span>
                </div>
                
                <h3 className="text-xl lg:text-2xl font-heading font-bold text-white mb-2">
                  {mainFeatured?.title}
                </h3>
                
                <p className="text-white/90 text-sm mb-4 line-clamp-2">
                  {mainFeatured?.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-white/80 text-sm">
                    <div className="flex items-center space-x-1">
                      <Icon name="Clock" size={14} />
                      <span>{mainFeatured?.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="GraduationCap" size={14} />
                      <span>Grade {mainFeatured?.gradeLevel?.join('-')}</span>
                    </div>
                  </div>

                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onPlay(mainFeatured?.id)}
                    iconName="Play"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Play Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Featured Games */}
        <div className="space-y-4">
          {otherFeatured?.map((game) => (
            <div key={game?.id} className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-all duration-200">
              <div className="flex items-start space-x-3">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={game?.thumbnail}
                    alt={game?.title}
                    className="w-full h-full object-cover"
                  />
                  {game?.isDownloaded && (
                    <div className="absolute -top-1 -right-1 bg-success rounded-full p-1">
                      <Icon name="Download" size={10} color="white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <Icon name={getSubjectIcon(game?.subject)} size={12} color="var(--color-primary)" />
                    <span className="text-xs font-caption text-text-secondary">{game?.subject}</span>
                  </div>
                  
                  <h4 className="text-sm font-heading font-semibold text-foreground mb-1 line-clamp-1">
                    {game?.title}
                  </h4>
                  
                  <p className="text-xs text-text-secondary mb-2 line-clamp-2">
                    {game?.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-text-secondary">
                      <Icon name="Clock" size={10} />
                      <span>{game?.duration}</span>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => onPlay(game?.id)}
                      iconName="Play"
                      iconSize={12}
                    >
                      Play
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedSection;