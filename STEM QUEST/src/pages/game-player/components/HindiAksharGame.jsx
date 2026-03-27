import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LEVELS = [
    {
        level: 1, title: 'Swar Match (Vowels)', gridSize: 'grid-cols-4',
        pairs: [
            { id: 1, hindi: 'अ', eng: 'Anar (Pomegranate)', type: 'swar' },
            { id: 2, hindi: 'आ', eng: 'Aam (Mango)', type: 'swar' },
            { id: 3, hindi: 'इ', eng: 'Imli (Tamarind)', type: 'swar' },
            { id: 4, hindi: 'ई', eng: 'Eekh (Sugarcane)', type: 'swar' },
        ]
    },
    {
        level: 2, title: 'Vyanjan Match (Consonants)', gridSize: 'grid-cols-4',
        pairs: [
            { id: 5, hindi: 'क', eng: 'Kabootar (Pigeon)', type: 'vyanjan' },
            { id: 6, hindi: 'ख', eng: 'Khargosh (Rabbit)', type: 'vyanjan' },
            { id: 7, hindi: 'ग', eng: 'Gamla (Pot)', type: 'vyanjan' },
            { id: 8, hindi: 'घ', eng: 'Ghar (House)', type: 'vyanjan' },
            { id: 9, hindi: 'च', eng: 'Chammach (Spoon)', type: 'vyanjan' },
            { id: 10, hindi: 'छ', eng: 'Chhatri (Umbrella)', type: 'vyanjan' },
        ]
    },
    {
        level: 3, title: 'Mixed Challenge', gridSize: 'grid-cols-4 sm:grid-cols-4 lg:grid-cols-4',
        pairs: [
            { id: 11, hindi: 'ट', eng: 'Tamatar (Tomato)', type: 'vyanjan' },
            { id: 12, hindi: 'ठ', eng: 'Thathera (Tinker)', type: 'vyanjan' },
            { id: 13, hindi: 'ड', eng: 'Damru (Drum)', type: 'vyanjan' },
            { id: 14, hindi: 'ढ', eng: 'Dholak (Drum)', type: 'vyanjan' },
            { id: 15, hindi: 'त', eng: 'Tarbooz (Watermelon)', type: 'vyanjan' },
            { id: 16, hindi: 'थ', eng: 'Thermos (Flask)', type: 'vyanjan' },
            { id: 17, hindi: 'द', eng: 'Dawaat (Inkpot)', type: 'vyanjan' },
            { id: 18, hindi: 'ध', eng: 'Dhanush (Bow)', type: 'vyanjan' },
        ]
    }
];

const HindiAksharGame = ({ onGameComplete, onProgressUpdate }) => {
    const [levelIdx, setLevelIdx] = useState(0);
    const [cards, setCards] = useState([]);
    const [flippedIndices, setFlippedIndices] = useState([]);
    const [matchedIds, setMatchedIds] = useState([]);
    const [score, setScore] = useState(0);
    const [moves, setMoves] = useState(0);
    const [gameComplete, setGameComplete] = useState(false);
    const [levelComplete, setLevelComplete] = useState(false);

    const currentLevel = LEVELS[levelIdx];

    const initializeLevel = () => {
        const pairs = currentLevel.pairs;
        let deck = [];
        pairs.forEach(pair => {
            // Create two cards for each pair: One for Hindi letter, One for English word
            deck.push({ uniqueId: `hi-${pair.id}`, matchId: pair.id, display: pair.hindi, isHindi: true });
            deck.push({ uniqueId: `en-${pair.id}`, matchId: pair.id, display: pair.eng, isHindi: false });
        });

        // Shuffle deck
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }

        setCards(deck);
        setFlippedIndices([]);
        setMatchedIds([]);
        setMoves(0);
        setLevelComplete(false);
    };

    useEffect(() => {
        initializeLevel();
    }, [levelIdx]);

    useEffect(() => {
        if (flippedIndices.length === 2) {
            setMoves(m => m + 1);
            const [firstIdx, secondIdx] = flippedIndices;
            const firstCard = cards[firstIdx];
            const secondCard = cards[secondIdx];

            if (firstCard.matchId === secondCard.matchId) {
                // Match found!
                setTimeout(() => {
                    setMatchedIds(prev => [...prev, firstCard.matchId]);
                    setFlippedIndices([]);
                    setScore(s => s + 100);
                    onProgressUpdate?.(15);
                }, 600);
            } else {
                // Not a match
                setTimeout(() => {
                    setFlippedIndices([]);
                    setScore(s => Math.max(0, s - 10)); // tiny penalty
                }, 1000);
            }
        }
    }, [flippedIndices]);

    useEffect(() => {
        if (cards.length > 0 && matchedIds.length === currentLevel.pairs.length) {
            // Level complete
            setTimeout(() => {
                setLevelComplete(true);
            }, 1000);
        }
    }, [matchedIds, cards]);

    const handleCardClick = (idx) => {
        if (flippedIndices.length >= 2) return; // Prevent clicking more than 2
        if (flippedIndices.includes(idx)) return; // Prevent double clicking same card
        if (matchedIds.includes(cards[idx].matchId)) return; // Prevent clicking matched cards

        setFlippedIndices(prev => [...prev, idx]);
    };

    const handleNextLevel = () => {
        if (levelIdx + 1 < LEVELS.length) {
            setLevelIdx(l => l + 1);
        } else {
            setGameComplete(true);
            onGameComplete?.();
        }
    };

    const restartGame = () => {
        setLevelIdx(0);
        setScore(0);
        setGameComplete(false);
        initializeLevel();
    };

    if (gameComplete) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-amber-50 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10 z-0" />
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="z-10 text-center bg-white p-12 rounded-3xl border border-amber-200 shadow-2xl relative"
                >
                    <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-8xl mb-6">🪔</motion.div>
                    <h2 className="text-5xl font-black text-amber-600 mb-4">Shabash! (Well Done!)</h2>
                    <p className="text-xl text-amber-800/70 mb-8">You matched all the Hindi Akshars perfectly.</p>
                    <div className="text-4xl font-bold text-amber-500 mb-10">Final Score: {score}</div>
                    <button onClick={restartGame} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-10 py-4 rounded-full font-bold text-xl shadow-lg transition-transform hover:scale-105 active:scale-95">
                        Play Again 🔄
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="w-full h-full relative flex flex-col bg-amber-50 rounded-2xl overflow-hidden select-none font-sans">

            {/* Pattern Background */}
            <div className="absolute inset-0 z-0 overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-5 pointer-events-none" />

            {/* Header Bar */}
            <div className="relative z-10 flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md border-b border-amber-200/50 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="bg-orange-100 text-orange-600 p-3 rounded-2xl border border-orange-200 shadow-inner">
                        <span className="text-3xl font-bold">क</span>
                    </div>
                    <div>
                        <div className="text-xs text-orange-500 font-bold tracking-widest uppercase mb-1">Hindi Memory Match</div>
                        <div className="text-orange-950 font-black text-xl">{currentLevel?.title}</div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center px-4 py-2 bg-orange-50 rounded-xl border border-orange-100">
                        <span className="text-[10px] text-orange-400 font-bold uppercase">Moves</span>
                        <span className="text-xl font-black text-orange-600">{moves}</span>
                    </div>
                    <div className="flex flex-col items-center px-4 py-2 bg-amber-50 rounded-xl border border-amber-100">
                        <span className="text-[10px] text-amber-400 font-bold uppercase">Score</span>
                        <span className="text-xl font-black text-amber-600">{score}</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 relative z-10 flex flex-col items-center justify-center p-6">

                <div className={`grid gap-4 w-full max-w-4xl ${currentLevel.gridSize}`}>
                    <AnimatePresence>
                        {cards.map((card, idx) => {
                            const isFlipped = flippedIndices.includes(idx) || matchedIds.includes(card.matchId);
                            const isMatched = matchedIds.includes(card.matchId);

                            return (
                                <motion.div
                                    key={card.uniqueId}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={!isFlipped ? { scale: 1.05, y: -5 } : {}}
                                    whileTap={!isFlipped ? { scale: 0.95 } : {}}
                                    className="relative aspect-[4/3] w-full cursor-pointer perspective-1000"
                                    onClick={() => handleCardClick(idx)}
                                >
                                    <motion.div
                                        className="w-full h-full relative preserve-3d transition-transform duration-500"
                                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                                    >
                                        {/* Front of Card (Hidden Face) */}
                                        <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg border-2 border-orange-300 flex items-center justify-center overflow-hidden group">
                                            <div className="absolute w-20 h-20 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
                                            <span className="text-4xl text-white/80 font-serif">❓</span>
                                        </div>

                                        {/* Back of Card (Revealed Face) */}
                                        <div className={`absolute inset-0 backface-hidden rotate-y-180 bg-white rounded-2xl shadow-xl border-4 flex items-center justify-center p-2 text-center
                      ${isMatched ? 'border-green-400 bg-green-50/50' : 'border-amber-200'}`}
                                        >
                                            {isMatched && (
                                                <div className="absolute -top-3 -right-3 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm shadow-md z-20">✓</div>
                                            )}

                                            <span className={`${card.isHindi ? 'text-6xl text-orange-600 font-bold' : 'text-2xl text-slate-700 font-medium leading-tight'} flex flex-col justify-center items-center`}>
                                                {card.isHindi ? card.display : (
                                                    <>
                                                        <span className="text-amber-600 font-bold block mb-1">{card.display.split(' ')[0]}</span>
                                                        <span className="text-sm text-slate-500">{card.display.substring(card.display.indexOf(' '))}</span>
                                                    </>
                                                )}
                                            </span>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* Level Complete Overlay */}
                <AnimatePresence>
                    {levelComplete && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                        >
                            <div className="bg-white p-10 rounded-3xl border-4 border-amber-400 shadow-2xl text-center max-w-sm w-full">
                                <div className="text-6xl mb-4">🎊</div>
                                <h3 className="text-3xl font-black text-amber-600 mb-2">Excellent!</h3>
                                <p className="text-slate-500 mb-6">You matched all the cards in {moves} moves!</p>
                                <button
                                    onClick={handleNextLevel}
                                    className="w-full bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white text-xl font-bold py-4 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95"
                                >
                                    Continue ➡️
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 relative z-10 bg-amber-100">
                <motion.div
                    className="h-full bg-orange-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(matchedIds.length / currentLevel.pairs.length) * 100}%` }}
                />
            </div>

        </div>
    );
};

export default HindiAksharGame;
