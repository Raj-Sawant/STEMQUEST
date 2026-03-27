import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const HTMLTagGame = ({ onGameComplete, onProgressUpdate, difficulty = 1 }) => {
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [cards, setCards] = useState([]);
    const [targets, setTargets] = useState([]);
    const [feedback, setFeedback] = useState(null);
    const [hint, setHint] = useState(null);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isGameOver, setIsGameOver] = useState(false);

    const tagPool = [
        { id: 't1', tag: '<h1>', desc: 'Main Heading', hint: 'The most important title on the page!' },
        { id: 't2', tag: '<p>', desc: 'Paragraph', hint: 'Used for blocks of regular text.' },
        { id: 't3', tag: '<a>', desc: 'Hyperlink/Link', hint: 'Anchor tag that connects to other pages.' },
        { id: 't4', tag: '<img>', desc: 'Image/Picture', hint: 'Displays visual content with a source URL.' },
        { id: 't5', tag: '<ul>', desc: 'Unordered List', hint: 'A list with bullet points.' },
        { id: 't6', tag: '<li>', desc: 'List Item', hint: 'Each entry inside a list.' },
        { id: 't7', tag: '<button>', desc: 'Interactive Button', hint: 'Something users click to trigger actions.' },
        { id: 't8', tag: '<input>', desc: 'Entry Field', hint: 'Where users type in information.' },
        { id: 't9', tag: '<nav>', desc: 'Navigation Bar', hint: 'Contains the main links for the site.' },
        { id: 't10', tag: '<footer>', desc: 'Page Bottom', hint: 'Information at the very end of a page.' },
        { id: 't11', tag: '<style>', desc: 'CSS Styling', hint: 'Where you write rules to make things pretty.' },
        { id: 't12', tag: '<script>', desc: 'JavaScript Code', hint: 'Adds logic and interactivity to the site.' },
        { id: 't13', tag: '<form>', desc: 'User Form', hint: 'A container for inputs and buttons.' },
        { id: 't14', tag: '<header>', desc: 'Page Top', hint: 'The introductory section of a page.' },
        { id: 't15', tag: '<table', desc: 'Data Table', hint: 'Organizes data into rows and columns.' },
    ];

    const initGame = () => {
        const count = Math.min(3 + Math.floor(level / 2), 8);
        const shuffledTags = [...tagPool].sort(() => 0.5 - Math.random()).slice(0, count);
        setCards(shuffledTags.map(t => ({ ...t, x: 0, y: 0 })));
        setTargets(shuffledTags.map(t => ({ id: t.id, desc: t.desc })).sort(() => 0.5 - Math.random()));
        setTimeLeft(Math.max(20, 60 - (level * 3)));
        setIsGameOver(false);
    };

    useEffect(() => { initGame(); }, [level]);

    useEffect(() => {
        if (timeLeft > 0 && !isGameOver) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0) setIsGameOver(true);
    }, [timeLeft, isGameOver]);

    const handleMatch = (cardId, targetId) => {
        if (cardId === targetId) {
            setScore(s => s + 100);
            setCards(prev => prev.filter(c => c.id !== cardId));
            setTargets(prev => prev.filter(t => t.id !== targetId));
            setFeedback({ type: 'success', text: 'Boom! Correct.' });
            onProgressUpdate?.(15);

            if (cards.length === 1) {
                if (level < 10) {
                    setTimeout(() => setLevel(l => l + 1), 1000);
                } else {
                    setIsGameOver(true);
                    onGameComplete?.();
                }
            }
        } else {
            setScore(s => Math.max(0, s - 25));
            setFeedback({ type: 'error', text: 'Not quite! Try another.' });
        }
        setTimeout(() => setFeedback(null), 1000);
    };

    return (
        <div className="w-full h-full bg-slate-950/80 rounded-[2rem] p-10 flex flex-col border border-blue-500/30 shadow-2xl relative overflow-hidden font-mono text-white backdrop-blur-md">
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

            <div className="flex justify-between items-center z-10 mb-8">
                <div>
                    <h2 className="text-4xl font-black text-blue-400 italic tracking-tighter game-text-shadow">SCRIPT_TAG_ENCODER</h2>
                    <p className="text-blue-500/60 font-black text-xs cyber-text tracking-[0.2em]">MISSION: LEVEL_{level} • DECODE SIGNATURES</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/50 shadow-inner text-center min-w-[120px]">
                        <div className="text-[10px] cyber-text text-slate-500 mb-1">TOTAL_XP</div>
                        <div className="text-2xl font-black text-blue-400 game-text-shadow">{score}</div>
                    </div>
                    <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/50 shadow-inner text-center min-w-[120px]">
                        <div className="text-[10px] cyber-text text-slate-500 mb-1">TIME_LIMIT</div>
                        <div className={`text-2xl font-black game-text-shadow ${timeLeft < 10 ? 'text-rose-500 animate-pulse' : 'text-emerald-400'}`}>{timeLeft}s</div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {feedback && (
                    <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}
                        className={`absolute top-32 left-1/2 -translate-x-1/2 z-50 px-8 py-3 rounded-2xl font-black text-white shadow-xl ${feedback.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                        {feedback.text}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex-1 grid grid-cols-2 gap-12 relative z-10">
                <div className="bg-slate-900/40 rounded-3xl p-6 border-2 border-dashed border-blue-500/20 flex flex-wrap content-center gap-6 justify-center">
                    {cards.map(card => (
                        <motion.div key={card.id} drag dragSnapToOrigin
                            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            className="bg-indigo-600 text-white p-6 rounded-2xl font-mono text-2xl font-black shadow-[0_8px_0_0_#4338ca] cursor-grab active:cursor-grabbing border-2 border-indigo-400 game-text-shadow">
                            {card.tag}
                        </motion.div>
                    ))}
                </div>

                <div className="flex flex-col justify-center gap-4">
                    {targets.map(target => (
                        <div key={target.id} onClick={() => { if (cards.length > 0) handleMatch(cards[0].id, target.id) }}
                            className="bg-slate-900/60 p-5 rounded-2xl border-2 border-slate-700 text-slate-300 font-black text-center hover:border-blue-400 hover:text-blue-400 transition-all cursor-pointer shadow-lg cyber-text">
                            {target.desc}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8 flex justify-between items-center relative z-10">
                <Button variant="outline" onClick={() => setHint(cards[0]?.hint)} className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10">
                    {hint ? <span className="cyber-text">DECRYPT_HINT: {hint}</span> : 'DECRYPT_HINT'}
                </Button>
                <div className="text-slate-500 font-bold text-xs cyber-text tracking-[.4em]">ENCODER_PROTOCOL_V2.1</div>
            </div>

            {isGameOver && (
                <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-8 z-[100]">
                    <div className="console-panel p-16 text-center shadow-2xl border-t-8 border-t-emerald-500 max-w-xl">
                        <div className="flex items-center justify-center space-x-4 mb-6">
                            <div className="h-[2px] w-20 bg-gradient-to-r from-transparent to-emerald-500" />
                            <span className="text-[10px] cyber-text text-emerald-500 animate-pulse tracking-[0.5em]">DECRYPTION_SUCCESSFUL</span>
                            <div className="h-[2px] w-20 bg-gradient-to-l from-transparent to-emerald-500" />
                        </div>
                        <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                            <Icon name="CheckCircle" size={60} className="text-emerald-500 animate-pulse" />
                        </div>
                        <h2 className="text-6xl font-black text-white mb-2 italic tracking-tighter game-text-shadow">MISSION_COMPLETE</h2>
                        <p className="text-xl text-slate-400 mb-10 font-bold cyber-text">YOU_DECODED <span className="text-emerald-400">{score / 100}</span>_TAG_SIGNATURES</p>

                        <div className="grid grid-cols-2 gap-4 mb-10">
                            <div className="p-3 bg-slate-900/50 rounded-xl border border-emerald-500/20">
                                <span className="block text-[8px] cyber-text text-slate-500 mb-1">SKILL_POINTS</span>
                                <span className="block text-xl font-black text-white">+{score}_XP</span>
                            </div>
                            <div className="p-3 bg-slate-900/50 rounded-xl border border-emerald-500/20">
                                <span className="block text-[8px] cyber-text text-slate-500 mb-1">ENCRYPTION_RANK</span>
                                <span className="block text-xl font-black text-white text-emerald-400">ELITE</span>
                            </div>
                        </div>

                        <Button onClick={() => setLevel(1)} size="lg" className="w-full bg-blue-600 hover:bg-blue-500 text-white cyber-text h-16 text-xl shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                            RESTART_DECRYPTION_PROTOCOL
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HTMLTagGame;
