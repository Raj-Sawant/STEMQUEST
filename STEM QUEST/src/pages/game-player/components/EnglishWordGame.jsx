import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LEVELS = [
    {
        level: 1, title: 'Animals', words: [
            { word: 'CAT', hint: '🐱 A furry pet that meows', scrambled: ['T', 'A', 'C'] },
            { word: 'DOG', hint: '🐶 Man\'s best friend', scrambled: ['G', 'O', 'D'] },
            { word: 'COW', hint: '🐄 Gives us milk', scrambled: ['W', 'C', 'O'] },
            { word: 'HEN', hint: '🐔 Lays eggs', scrambled: ['N', 'E', 'H'] },
            { word: 'FOX', hint: '🦊 A clever animal', scrambled: ['X', 'F', 'O'] },
        ]
    },
    {
        level: 2, title: 'Fruits', words: [
            { word: 'MANGO', hint: '🥭 King of fruits', scrambled: ['G', 'O', 'M', 'N', 'A'] },
            { word: 'APPLE', hint: '🍎 Red or green fruit', scrambled: ['P', 'A', 'L', 'E', 'P'] },
            { word: 'GRAPE', hint: '🍇 Grows in bunches', scrambled: ['E', 'G', 'P', 'A', 'R'] },
            { word: 'GUAVA', hint: '🍈 Pink inside fruit', scrambled: ['A', 'G', 'V', 'U', 'A'] },
            { word: 'LEMON', hint: '🍋 Sour yellow fruit', scrambled: ['N', 'L', 'O', 'E', 'M'] },
        ]
    },
    {
        level: 3, title: 'Action Words', words: [
            { word: 'JUMP', hint: '⬆️ Leap into the air', scrambled: ['M', 'J', 'P', 'U'] },
            { word: 'SWIM', hint: '🏊 Move in water', scrambled: ['M', 'S', 'I', 'W'] },
            { word: 'SING', hint: '🎵 Make music with voice', scrambled: ['N', 'G', 'I', 'S'] },
            { word: 'READ', hint: '📖 Look at letters and understand', scrambled: ['D', 'E', 'A', 'R'] },
            { word: 'DRAW', hint: '✏️ Make pictures', scrambled: ['W', 'D', 'A', 'R'] },
        ]
    }
];

const EnglishWordGame = ({ onGameComplete, onProgressUpdate }) => {
    const [levelIdx, setLevelIdx] = useState(0);
    const [wordIdx, setWordIdx] = useState(0);
    const [placed, setPlaced] = useState([]);
    const [bubbles, setBubbles] = useState([]);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [gameComplete, setGameComplete] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);

    const currentLevel = LEVELS[levelIdx];
    const currentWord = currentLevel?.words[wordIdx];

    const initBubbles = (word) => {
        const letters = [...word.scrambled];
        for (let i = letters.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [letters[i], letters[j]] = [letters[j], letters[i]];
        }
        setBubbles(letters.map((l, i) => ({
            id: i,
            letter: l,
            popped: false,
        })));
        setPlaced([]);
        setTimeLeft(30);
    };

    useEffect(() => {
        if (currentWord) initBubbles(currentWord);
    }, [wordIdx, levelIdx]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    clearInterval(timer);
                    handleWrong();
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [wordIdx, levelIdx]);

    const handleBubbleClick = (bubble) => {
        if (bubble.popped || feedback) return;

        const newPlaced = [...placed, bubble.letter];
        setPlaced(newPlaced);
        setBubbles(prev => prev.map(b => b.id === bubble.id ? { ...b, popped: true } : b));

        const targetWord = currentWord.word;
        if (newPlaced.length === targetWord.length) {
            if (newPlaced.join('') === targetWord) {
                handleCorrect(newPlaced.length);
            } else {
                handleWrong();
            }
        }
    };

    const handleCorrect = (len) => {
        const pts = 100 + timeLeft * 5;
        setScore(s => s + pts);
        setFeedback('correct');
        onProgressUpdate?.(10);
        setTimeout(() => {
            setFeedback(null);
            if (wordIdx + 1 < currentLevel.words.length) {
                setWordIdx(w => w + 1);
            } else if (levelIdx + 1 < LEVELS.length) {
                setLevelIdx(l => l + 1);
                setWordIdx(0);
            } else {
                setGameComplete(true);
                onGameComplete?.();
            }
        }, 1500);
    };

    const handleWrong = () => {
        setFeedback('wrong');
        setTimeout(() => {
            setFeedback(null);
            initBubbles(currentWord);
        }, 1500);
    };

    const handleRemoveLetter = (idx) => {
        if (feedback) return;
        const removedLetter = placed[idx];
        setPlaced(prev => prev.filter((_, i) => i !== idx));
        setBubbles(prev => {
            const poppedIdx = prev.findIndex(b => b.popped && b.letter === removedLetter);
            if (poppedIdx === -1) return prev;
            return prev.map((b, i) => i === poppedIdx ? { ...b, popped: false } : b);
        });
    };

    if (gameComplete) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-[#0f172a] rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 z-0" />
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="z-10 text-center glass-panel p-12 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl"
                >
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="text-8xl mb-6"
                    >
                        🏆
                    </motion.div>
                    <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">WORD MASTER!</h2>
                    <p className="text-xl text-slate-300 mb-8">You've completed all spelling challenges.</p>
                    <div className="text-4xl font-bold text-yellow-400 mb-10">Final Score: {score}</div>
                    <button onClick={() => { setLevelIdx(0); setWordIdx(0); setScore(0); setGameComplete(false); }}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-10 py-4 rounded-full font-bold text-xl shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all hover:scale-105">
                        Play Again 🔄
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="w-full h-full relative flex flex-col bg-[#0f172a] rounded-2xl overflow-hidden select-none font-sans">

            {/* Dynamic Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 100, ease: "linear" }}
                    className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0%,transparent_50%)]"
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 120, ease: "linear" }}
                    className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_20%_80%,rgba(168,85,247,0.15)_0%,transparent_40%)]"
                />
            </div>

            {/* Header Bar - Glassmorphism */}
            <div className="relative z-10 flex items-center justify-between px-8 py-4 bg-white/5 backdrop-blur-md border-b border-white/10 shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
                        <span className="text-2xl text-white">🔤</span>
                    </div>
                    <div>
                        <div className="text-xs text-blue-300 font-bold tracking-widest uppercase mb-1">English Adventure</div>
                        <div className="text-white font-black text-xl">{currentLevel?.title}</div>
                    </div>
                </div>
                <div className="flex items-center gap-8">
                    <div className="flex flex-col items-end">
                        <span className="text-xs text-slate-400 font-bold uppercase">Timer</span>
                        <span className={`text-2xl font-black ${timeLeft <= 10 ? 'text-red-400' : 'text-emerald-400'}`}>
                            00:{timeLeft.toString().padStart(2, '0')}
                        </span>
                    </div>
                    <div className="w-px h-10 bg-white/10" />
                    <div className="flex flex-col items-end">
                        <span className="text-xs text-slate-400 font-bold uppercase">Score</span>
                        <span className="text-2xl font-black text-yellow-400">{score}</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 relative z-10 flex flex-col items-center justify-center gap-10 p-8">

                {/* Hint Card */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 max-w-lg w-full text-center shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
                    <p className="text-blue-300 text-sm font-bold uppercase tracking-wider mb-2">Hint</p>
                    <p className="text-white font-medium text-2xl">{currentWord?.hint}</p>
                </motion.div>

                {/* Answer Slots */}
                <div className="flex gap-4">
                    <AnimatePresence>
                        {currentWord?.word.split('').map((_, i) => {
                            const letter = placed[i];
                            return (
                                <motion.div
                                    key={`slot-${i}`}
                                    layout
                                    onClick={() => letter && handleRemoveLetter(i)}
                                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl font-black transition-all cursor-pointer shadow-lg
                    ${letter
                                            ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white border border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:from-red-500 hover:to-red-600 hover:border-red-400'
                                            : 'bg-white/5 border-2 border-dashed border-white/20 text-transparent'
                                        }
                    ${feedback === 'correct' && letter ? 'from-green-500 to-green-700 border-green-400 shadow-[0_0_30px_rgba(34,197,94,0.6)]' : ''}
                    ${feedback === 'wrong' && letter ? 'from-red-500 to-red-700 border-red-400' : ''}
                  `}
                                >
                                    {letter || ''}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* Feedback Overlay */}
                <AnimatePresence>
                    {feedback && (
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0, y: -50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 1.5, opacity: 0 }}
                            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 px-10 py-5 rounded-3xl font-black text-4xl text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-2 backdrop-blur-md
                ${feedback === 'correct' ? 'bg-green-500/90 border-green-300' : 'bg-red-500/90 border-red-300'}`}
                        >
                            {feedback === 'correct' ? 'Awesome! ✨' : 'Try Again! 🔄'}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Letter Bubbles */}
                <div className="flex flex-wrap gap-6 justify-center max-w-2xl mt-8">
                    <AnimatePresence>
                        {bubbles.map((bubble) => !bubble.popped && (
                            <motion.button
                                key={bubble.id}
                                layout
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                whileHover={{ scale: 1.1, y: -5 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleBubbleClick(bubble)}
                                className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-3xl font-black text-white bg-gradient-to-br from-purple-500 to-pink-600 shadow-[0_10px_25px_rgba(236,72,153,0.5)] border border-white/20 overflow-hidden group"
                            >
                                {/* Bubble Gloss Effect */}
                                <div className="absolute top-1 left-2 w-6 h-3 bg-white/40 rounded-full rotate-[-45deg] blur-[1px]" />
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-black/20 rounded-full blur-md" />
                                <span className="relative z-10 drop-shadow-md">{bubble.letter}</span>
                            </motion.button>
                        ))}
                    </AnimatePresence>
                </div>

            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-800 relative z-10">
                <motion.div
                    className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${((levelIdx * 5 + wordIdx) / (LEVELS.length * 5)) * 100}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>
        </div>
    );
};

export default EnglishWordGame;
