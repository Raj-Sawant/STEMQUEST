import React from 'react';
import Icon from '../../../components/AppIcon';

const AchievementBadge = ({ achievement }) => {
  const getBadgeColor = (type) => {
    const colors = {
      'gold': 'bg-gradient-to-br from-yellow-400 to-yellow-600',
      'silver': 'bg-gradient-to-br from-gray-300 to-gray-500',
      'bronze': 'bg-gradient-to-br from-orange-400 to-orange-600',
      'platinum': 'bg-gradient-to-br from-purple-400 to-purple-600'
    };
    return colors?.[type] || 'bg-gradient-to-br from-blue-400 to-blue-600';
  };

  const getIconName = (category) => {
    const icons = {
      'streak': 'Flame',
      'completion': 'CheckCircle',
      'speed': 'Zap',
      'accuracy': 'Target',
      'collaboration': 'Users',
      'exploration': 'Compass'
    };
    return icons?.[category] || 'Award';
  };

  return (
    <div className={`relative group cursor-pointer ${achievement?.isUnlocked ? '' : 'opacity-40 grayscale'}`}>
      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center border-2 ${achievement?.isUnlocked ? 'border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)] bg-slate-900/80 animate-pulse' : 'border-slate-800 bg-slate-950'} transition-all duration-300 group-hover:scale-110 group-hover:border-blue-300`}>
        <div className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 ${achievement?.isUnlocked ? 'border-blue-400' : 'border-slate-700'}`} />
        <div className={`absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 ${achievement?.isUnlocked ? 'border-blue-400' : 'border-slate-700'}`} />

        <Icon
          name={getIconName(achievement?.category)}
          size={32}
          className={achievement?.isUnlocked ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'text-slate-700'}
        />

        {!achievement?.isUnlocked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon name="Lock" size={16} className="text-slate-800" />
          </div>
        )}
      </div>

      {/* Badge Info Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20 translate-y-2 group-hover:translate-y-0">
        <div className="console-panel p-4 min-w-56 border-t-2 border-t-blue-500 shadow-2xl">
          <div className="flex items-center space-x-2 mb-2">
            <div className={`w-1.5 h-1.5 rounded-full ${achievement?.isUnlocked ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></div>
            <span className="text-[10px] cyber-text text-slate-500">{achievement?.isUnlocked ? 'DATA_UNLOCKED' : 'ENCRYPTED_NODE'}</span>
          </div>
          <h4 className="font-black text-white text-base mb-1 italic game-text-shadow">
            {achievement?.title?.toUpperCase()}
          </h4>
          <p className="text-[10px] cyber-text text-slate-400 mb-3 leading-relaxed">
            {achievement?.description?.toUpperCase()}
          </p>
          {achievement?.isUnlocked ? (
            <div className="text-[10px] cyber-text text-emerald-400 border-t border-slate-800 pt-2">
              ACQUIRED: {achievement?.unlockedDate?.toUpperCase()}
            </div>
          ) : (
            <div className="text-[10px] cyber-text text-slate-500 border-t border-slate-800 pt-2">
              REQUIREMENT: {achievement?.criteria?.toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementBadge;