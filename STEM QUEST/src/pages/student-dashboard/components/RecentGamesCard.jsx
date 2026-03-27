import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentGamesCard = ({ recentGames }) => {
  const getSubjectIcon = (subject) => {
    const icons = {
      'Math': 'Calculator',
      'Science': 'Atom',
      'Technology': 'Laptop',
      'Engineering': 'Cog'
    };
    return icons?.[subject] || 'BookOpen';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Easy': 'text-success bg-success/10',
      'Medium': 'text-warning bg-warning/10',
      'Hard': 'text-error bg-error/10'
    };
    return colors?.[difficulty] || 'text-text-secondary bg-muted';
  };

  return (
    <div className="console-panel p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-white italic tracking-tighter game-text-shadow">
          RESUME_MISSION
        </h2>
        <Link to="/game-library">
          <Button variant="ghost" size="sm" className="text-blue-400 cyber-text hover:text-blue-300">
            VIEW_ALL_PROTOCOLS
          </Button>
        </Link>
      </div>
      <div className="space-y-4">
        {recentGames?.map((game) => (
          <div
            key={game?.id}
            className="group flex items-center space-x-4 p-3 bg-slate-900/40 rounded-xl border border-blue-500/10 hover:border-blue-500/40 hover:bg-slate-900/60 transition-all cursor-pointer overflow-hidden"
          >
            <div className="relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-slate-800 group-hover:border-blue-500/50 transition-colors">
              <img
                src={game?.thumbnail}
                alt={game?.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay group-hover:bg-transparent transition-colors" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-black text-white truncate text-sm tracking-wide uppercase italic">
                {game?.title}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-[9px] cyber-text text-slate-500">{game?.subject?.toUpperCase()}</span>
                <span className="text-slate-700">•</span>
                <span className={`text-[8px] cyber-text ${getDifficultyColor(game?.difficulty)?.split(' ')?.[0]}`}>
                  {game?.difficulty?.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] cyber-text text-blue-400">{game?.progress}%</p>
                <div className="w-16 h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                    style={{ width: `${game?.progress}%` }}
                  />
                </div>
              </div>

              <Link to={`/game-player?id=${game?.id}`}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-600/20 border border-blue-500/40 text-blue-400 hover:bg-blue-600 hover:text-white transition-all shadow-lg group-hover:shadow-blue-500/20">
                  <Icon name="Play" size={16} />
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentGamesCard;