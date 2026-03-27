import React from 'react';
import Icon from '../../../components/AppIcon';

const WelcomeCard = ({ studentName, currentStreak, totalPoints, level = 12, grade = 8, avatar }) => {
  const getGreeting = () => {
    const hour = new Date()?.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getRank = (lvl) => {
    if (lvl < 5) return 'CADET';
    if (lvl < 10) return 'EXPLORER';
    if (lvl < 20) return 'COMMANDER';
    return 'ELITE_FORCE';
  };

  return (
    <div className="console-panel p-8 text-white relative h-full overflow-hidden">
      {/* Decorative scanline or grid in background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />

      <div className="absolute top-0 right-0 p-4 opacity-5">
        <Icon name="Cpu" size={160} />
      </div>

      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between relative z-10 gap-8">
        <div className="flex-1 w-full">
          <div className="flex items-center space-x-2 mb-3">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></span>
            <span className="text-[10px] cyber-text text-emerald-400">SESSION_ACTIVE</span>
          </div>

          <div className="mb-6">
            <h1 className="text-5xl font-black mb-1 italic tracking-tighter leading-none">
              {getGreeting()?.toUpperCase()}, <span className="text-blue-400">{studentName?.toUpperCase()}</span>
            </h1>
            <div className="flex items-center space-x-4 mt-2">
              <span className="px-3 py-1 bg-blue-600/20 border border-blue-500/40 rounded-full text-[10px] cyber-text text-blue-400">
                RANK: {getRank(level)}
              </span>
              <span className="px-3 py-1 bg-indigo-600/20 border border-indigo-500/40 rounded-full text-[10px] cyber-text text-indigo-400">
                LEVEL: {level}
              </span>
              <span className="px-3 py-1 bg-slate-800/40 border border-slate-700/40 rounded-full text-[10px] cyber-text text-slate-400">
                GRADE: {grade}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4 p-4 bg-slate-900/40 rounded-2xl border border-blue-500/10 hover:border-blue-500/30 transition-colors">
              <div className="w-12 h-12 bg-rose-500/20 rounded-xl flex items-center justify-center border border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                <Icon name="Flame" size={24} className="text-rose-500" />
              </div>
              <div>
                <p className="text-[8px] cyber-text text-slate-500 mb-0.5">STREAK</p>
                <p className="text-xl font-black text-rose-500 leading-tight">{currentStreak} DAYS</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-slate-900/40 rounded-2xl border border-blue-500/10 hover:border-blue-500/30 transition-colors">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <Icon name="Zap" size={24} className="text-blue-500" />
              </div>
              <div>
                <p className="text-[8px] cyber-text text-slate-500 mb-0.5">CORE_XP_POWER</p>
                <p className="text-xl font-black text-blue-500 leading-tight">{totalPoints?.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="mt-8">

          </div>
        </div>

        <div className="hidden lg:flex flex-col items-center">
          <div className="relative">
            <div className="w-40 h-40 bg-blue-500/5 rounded-full flex items-center justify-center border-2 border-dashed border-blue-500/20 animate-[spin_20s_linear_infinite]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-900 p-1 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center overflow-hidden border border-blue-400/30">
                  {avatar ? (
                    <img src={avatar} alt={studentName} className="w-full h-full object-cover" />
                  ) : (
                    <Icon name="User" size={80} className="text-blue-500 opacity-80" />
                  )}
                </div>
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-14 h-14 bg-slate-950 rounded-xl border border-emerald-500/40 flex items-center justify-center shadow-lg transform -rotate-12 group hover:rotate-0 transition-all">
              <Icon name="ShieldCheck" size={28} className="text-emerald-500 animate-pulse" />
            </div>
          </div>
          <p className="mt-6 text-[10px] cyber-text text-slate-500 text-center uppercase">BIO_SIG_MATCHED</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;