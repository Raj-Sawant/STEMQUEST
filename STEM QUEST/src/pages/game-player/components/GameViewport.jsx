import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import DragonMathGame from './DragonMathGame';
import HTMLTagGame from './HTMLTagGame';
import STEMCircuitsGame from './STEMCircuitsGame';
import EnglishWordGame from './EnglishWordGame';
import HindiAksharGame from './HindiAksharGame';

const GameViewport = ({
  gameData,
  onGameComplete,
  onProgressUpdate,
  isPaused,
  currentLevel,
  totalLevels
}) => {
  const [gameState, setGameState] = useState({
    score: 0,
    lives: 3,
    timeElapsed: 0,
    isLoading: true
  });

  const [isGameOver, setIsGameOver] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [hintActive, setHintActive] = useState(false);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const pressedKeysRef = useRef({});
  const gameObjectsRef = useRef({
    player: { x: 60, y: 150, w: 40, h: 25, speed: 4 },
    asteroids: [],
    particles: [],
    bullets: [],
    dragon: { x: 100, y: 200, w: 60, h: 40, health: 100, attackCooldown: 0 },
    monster: { x: 400, y: 200, w: 50, h: 60, health: 100, attackCooldown: 0, phase: 1, lastAttack: 0, type: 'goblin' }
  });
  const lastSpawnRef = useRef(0);
  const lastTimeRef = useRef(0);
  const difficultyRef = useRef(1);
  const timeSinceQuizRef = useRef(0);
  const starLayersRef = useRef([
    { speed: 20, points: [] },
    { speed: 50, points: [] },
    { speed: 90, points: [] }
  ]);
  const countdownRef = useRef(3);
  const isStartingRef = useRef(true);
  const shakeRef = useRef({ t: 0, mag: 0 });
  const audioRef = useRef({ ctx: null });
  const spriteRef = useRef({ rocket: null, asteroid: null });
  const statsRef = useRef({ quizzesShown: 0, quizzesCorrect: 0, duration: 0, bestScore: Number(localStorage.getItem('sq_best') || 0) });

  // Grade-based questions (1-6+)
  const gradeQuestions = {
    1: [
      { q: 'What is 1 + 1?', options: ['1', '2', '3', '4'], a: 1, hint: 'Count your fingers!' },
      { q: 'Which is a planet?', options: ['Sun', 'Moon', 'Earth', 'Star'], a: 2, hint: 'We live on it.' }
    ],
    3: [
      { q: 'What is the boiling point of water?', options: ['0°C', '50°C', '100°C', '200°C'], a: 2, hint: 'It is a very hot round number.' },
      { q: 'What part of plant is underground?', options: ['Leaf', 'Stem', 'Flower', 'Root'], a: 3, hint: 'They drink water from soil.' }
    ],
    6: [
      { q: 'What is the velocity of light?', options: ['300,000 km/s', '3,000 km/s', '150,000 km/s', 'None'], a: 0, hint: 'Very, very fast.' },
      { q: 'Which organ pumps blood?', options: ['Brain', 'Lungs', 'Heart', 'Stomach'], a: 2, hint: 'It beats in your chest.' },
      { q: 'What is the pH of pure water?', options: ['0', '7', '14', '1'], a: 1, hint: 'It is neutral.' },
      { q: 'Which subatomic particle has a negative charge?', options: ['Proton', 'Neutron', 'Electron', 'Nucleus'], a: 2, hint: 'It orbits the nucleus.' },
      { q: 'What is the power house of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Cytoplasm'], a: 2, hint: 'Common biology meme!' },
      { q: 'Force = Mass x ?', options: ['Velocity', 'Acceleration', 'Gravity', 'Distance'], a: 1, hint: 'Newton\'s Second Law.' }
    ]
  };

  useEffect(() => {
    // Simulate game loading
    const loadTimer = setTimeout(() => {
      setGameState(prev => ({ ...prev, isLoading: false }));
    }, 800);
    return () => clearTimeout(loadTimer);
  }, [gameData]);

  useEffect(() => {
    if (!isPaused && !gameState?.isLoading) {
      const timer = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeElapsed: prev?.timeElapsed + 1
        }));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isPaused, gameState?.isLoading]);

  // Keyboard setup
  useEffect(() => {
    const handleKeyDown = (e) => {
      pressedKeysRef.current[e.key.toLowerCase()] = true;
      if ((e.key === 'r' || e.key === 'R') && isGameOver) restartGame();
    };
    const handleKeyUp = (e) => {
      delete pressedKeysRef.current[e.key.toLowerCase()];
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isGameOver]);

  // Resize canvas
  useEffect(() => {
    if (gameState?.isLoading) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    const resize = () => {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      starLayersRef.current.forEach((layer, idx) => {
        const count = Math.floor((canvas.width * canvas.height) / (10000 * (idx + 1)));
        layer.points = new Array(count).fill(0).map(() => ({ x: Math.random() * canvas.width, y: Math.random() * canvas.height }));
      });
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    return () => ro.disconnect();
  }, [gameState?.isLoading]);

  // Game Loop
  useEffect(() => {
    if (gameState?.isLoading || isPaused || isGameOver || showQuiz) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const step = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const dt = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;
      update(dt, canvas);
      draw(ctx, canvas);
      animationRef.current = requestAnimationFrame(step);
    };
    animationRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isPaused, isGameOver, gameState?.isLoading, showQuiz]);

  const update = (dt, canvas) => {
    if (isStartingRef.current) {
      countdownRef.current -= dt;
      if (countdownRef.current <= 0) {
        isStartingRef.current = false;
        playTone(660, 0.08);
      }
      return;
    }

    if (gameData?.type === 'dragon-monsters') {
      // updateDragonMonsters placeholder or logic
      return;
    }

    const { player, asteroids, particles } = gameObjectsRef.current;
    const moveX = (pressedKeysRef.current['arrowright'] || pressedKeysRef.current['d'] ? 1 : 0) - (pressedKeysRef.current['arrowleft'] || pressedKeysRef.current['a'] ? 1 : 0);
    const moveY = (pressedKeysRef.current['arrowdown'] || pressedKeysRef.current['s'] ? 1 : 0) - (pressedKeysRef.current['arrowup'] || pressedKeysRef.current['w'] ? 1 : 0);

    player.x += moveX * player.speed * 60 * dt;
    player.y += moveY * player.speed * 60 * dt;
    player.x = Math.max(0, Math.min(canvas.width - player.w, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.h, player.y));

    // Asteroid Spawning (Difficulty increases with time)
    lastSpawnRef.current += dt;
    difficultyRef.current = 1 + (gameState.timeElapsed / 30); // Harder every 30s
    const spawnInterval = Math.max(0.2, 1.2 - (difficultyRef.current * 0.15));

    if (lastSpawnRef.current > spawnInterval) {
      lastSpawnRef.current = 0;
      const size = 20 + Math.random() * 40;
      asteroids.push({
        x: canvas.width + size,
        y: Math.random() * (canvas.height - size),
        r: size,
        vx: -(100 + difficultyRef.current * 50),
      });
    }

    // Update asteroids
    for (let i = asteroids.length - 1; i >= 0; i--) {
      const a = asteroids[i];
      a.x += a.vx * dt;
      if (a.x < -a.r) asteroids.splice(i, 1);

      // Collision with player
      if (Math.hypot(a.x - (player.x + player.w / 2), a.y - (player.y + player.h / 2)) < a.r / 1.5 + 10) {
        setIsGameOver(true);
        shakeRef.current = { t: 0.5, mag: 15 };
        playTone(100, 0.3);
      }
    }

    // Update particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
      if (p.life <= 0) particles.splice(i, 1);
    }

    timeSinceQuizRef.current += dt;
    if (timeSinceQuizRef.current > 20) {
      timeSinceQuizRef.current = 0;
      triggerQuiz();
    }
  };

  const draw = (ctx, canvas) => {
    let ox = 0, oy = 0;
    if (shakeRef.current.t > 0) {
      shakeRef.current.t -= 0.016;
      const m = shakeRef.current.mag * (shakeRef.current.t / 0.5);
      ox = (Math.random() - 0.5) * m;
      oy = (Math.random() - 0.5) * m;
    }
    ctx.setTransform(1, 0, 0, 1, ox, oy);
    ctx.clearRect(-ox, -oy, canvas.width + Math.abs(ox), canvas.height + Math.abs(oy));

    // Background
    const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bg.addColorStop(0, '#020617'); bg.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Stars
    starLayersRef.current.forEach((layer) => {
      ctx.fillStyle = '#ffffff33';
      layer.points.forEach((p) => {
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2); ctx.fill();
        p.x -= (layer.speed * 0.016);
        if (p.x < 0) { p.x = canvas.width; p.y = Math.random() * canvas.height; }
      });
    });

    const { player, asteroids } = gameObjectsRef.current;

    // Player Rocket
    ctx.save();
    ctx.shadowBlur = 15; ctx.shadowColor = '#60a5fa';
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.moveTo(player.x, player.y + player.h / 2);
    ctx.lineTo(player.x + player.w, player.y + player.h / 2 - 10);
    ctx.lineTo(player.x + player.w + 10, player.y + player.h / 2);
    ctx.lineTo(player.x + player.w, player.y + player.h / 2 + 10);
    ctx.closePath(); ctx.fill();
    // Engine Flame
    ctx.fillStyle = '#f97316';
    const flw = 10 + Math.random() * 15;
    ctx.beginPath(); ctx.moveTo(player.x, player.y + player.h / 2 - 5); ctx.lineTo(player.x - flw, player.y + player.h / 2); ctx.lineTo(player.x, player.y + player.h / 2 + 5); ctx.fill();
    ctx.restore();

    // Asteroids
    asteroids.forEach(a => {
      ctx.fillStyle = '#475569';
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r / 2, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2; ctx.stroke();
    });

    // HUD
    ctx.font = 'bold 20px Inter, sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText(`SCORE: ${Math.floor(gameState.score + gameState.timeElapsed * 10)}`, 20, 40);
  };

  const triggerQuiz = () => {
    const grade = gameData?.grade > 6 ? 6 : (gameData?.grade || 1);
    const questions = gradeQuestions[grade] || gradeQuestions[1];
    const q = questions[Math.floor(Math.random() * questions.length)];
    setCurrentQuestion(q);
    setShowQuiz(true);
    setHintActive(false);
  };

  const restartGame = () => {
    setIsGameOver(false);
    setGameState({ score: 0, timeElapsed: 0, isLoading: false });
    gameObjectsRef.current.asteroids = [];
    isStartingRef.current = true;
    countdownRef.current = 3;
    timeSinceQuizRef.current = 0;
  };

  const playTone = (freq, dur) => {
    try {
      const ctx = audioRef.current.ctx || new (window.AudioContext || window.webkitAudioContext)();
      audioRef.current.ctx = ctx;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.connect(g); g.connect(ctx.destination);
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0.1, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + dur);
      osc.start(); osc.stop(ctx.currentTime + dur);
    } catch (e) { }
  };

  const gameType = gameData?.type?.toLowerCase();

  if (gameType === 'html-tag-matcher') {
    return <HTMLTagGame onGameComplete={onGameComplete} onProgressUpdate={onProgressUpdate} difficulty={gameData.grade} />;
  }
  if (gameType === 'stem-circuits') {
    return <STEMCircuitsGame onGameComplete={onGameComplete} onProgressUpdate={onProgressUpdate} />;
  }
  if (gameType === 'dragon-math') {
    return <DragonMathGame onGameComplete={onGameComplete} onScoreUpdate={onProgressUpdate} />;
  }
  if (gameType === 'english-word') {
    return <EnglishWordGame onGameComplete={onGameComplete} onProgressUpdate={onProgressUpdate} />;
  }
  if (gameType === 'hindi-akshar') {
    return <HindiAksharGame onGameComplete={onGameComplete} onProgressUpdate={onProgressUpdate} />;
  }

  return (
    <div className="w-full h-full rounded-2xl relative overflow-hidden border-4 border-slate-700 bg-slate-900 shadow-2xl">
      <canvas ref={canvasRef} className="w-full h-full block" />

      {showQuiz && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/90 backdrop-blur-md z-40">
          <div className="bg-slate-800 p-8 rounded-3xl border-4 border-blue-500 max-w-md w-full text-center">
            <h3 className="text-2xl font-bold text-blue-400 mb-6">{currentQuestion?.q}</h3>
            <div className="grid grid-cols-1 gap-4">
              {currentQuestion?.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (i === currentQuestion.a) {
                      setGameState(s => ({ ...s, score: s.score + 100 }));
                      setShowQuiz(false);
                    } else {
                      setIsGameOver(true);
                      setShowQuiz(false);
                    }
                  }}
                  className="bg-slate-700 hover:bg-blue-600 p-4 rounded-xl font-bold transition-colors text-white"
                >
                  {opt}
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => setHintActive(true)}
                className="text-yellow-400 text-sm font-bold flex items-center"
              >
                <Icon name="Lightbulb" size={16} className="mr-1" /> Help?
              </button>
              {hintActive && <p className="text-yellow-200 text-sm animate-bounce">{currentQuestion?.hint}</p>}
            </div>
          </div>
        </div>
      )}

      {isGameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50">
          <div className="text-center">
            <h2 className="text-6xl font-black text-red-500 mb-4 tracking-tighter">GAME OVER</h2>
            <div className="text-2xl text-white mb-8">Score: {Math.floor(gameState.score + gameState.timeElapsed * 10)}</div>
            <Button onClick={restartGame} variant="primary">RETRY MISSION</Button>
          </div>
        </div>
      )}

      {isStartingRef.current && !gameState.isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-30 pointer-events-none">
          <div className="text-9xl font-black text-white italic animate-ping">
            {Math.ceil(countdownRef.current)}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameViewport;