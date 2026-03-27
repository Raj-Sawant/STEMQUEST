import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';

const DragonMathGame = ({ onGameComplete, onScoreUpdate }) => {
  const gameRef = useRef(null);
  const phaserGameRef = useRef(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [skeletonHealth, setSkeletonHealth] = useState(2);
  const [maxSkeletonHealth, setMaxSkeletonHealth] = useState(2);
  const [currentWave, setCurrentWave] = useState(1);
  const [gameScore, setGameScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(10);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showWaveCleared, setShowWaveCleared] = useState(false);

  // Enhanced Math question generator for advanced students
  const generateQuestion = () => {
    const types = ['arithmetic', 'algebra', 'powers', 'roots'];
    const type = types[Math.floor(Math.random() * (currentWave > 3 ? 4 : 2))]; // Gradually introduce complex types
    let num1, num2, num3, x, answer, question;

    switch (type) {
      case 'arithmetic':
        const ops = ['+', '-', '*'];
        const op = ops[Math.floor(Math.random() * (currentWave > 2 ? 3 : 2))];
        if (op === '+') {
          num1 = Math.floor(Math.random() * 100) + 1;
          num2 = Math.floor(Math.random() * 100) + 1;
          answer = num1 + num2;
          question = `${num1} + ${num2} = ?`;
        } else if (op === '-') {
          num1 = Math.floor(Math.random() * 100) + 50;
          num2 = Math.floor(Math.random() * num1) + 1;
          answer = num1 - num2;
          question = `${num1} - ${num2} = ?`;
        } else {
          num1 = Math.floor(Math.random() * 15) + 2;
          num2 = Math.floor(Math.random() * 12) + 2;
          answer = num1 * num2;
          question = `${num1} × ${num2} = ?`;
        }
        break;

      case 'algebra':
        // Linear equation: ax + b = c
        const a = Math.floor(Math.random() * 5) + 2;
        x = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 20) + 1;
        const c = a * x + b;
        answer = x;
        question = `Solve for x: ${a}x + ${b} = ${c}`;
        break;

      case 'powers':
        num1 = Math.floor(Math.random() * 10) + 2;
        num2 = Math.floor(Math.random() * 2) + 2; // squared or cubed
        answer = Math.pow(num1, num2);
        question = `What is ${num1} to the power of ${num2}?`;
        break;

      case 'roots':
        answer = Math.floor(Math.random() * 15) + 2;
        num1 = answer * answer;
        question = `√${num1} = ?`;
        break;

      default:
        num1 = 5; num2 = 5; answer = 10;
        question = "5 + 5 = ?";
    }

    return { question, answer };
  };

  useEffect(() => {
    if (gameRef.current && !phaserGameRef.current) {
      // Enhanced Phaser Game Configuration
      const config = {
        type: Phaser.AUTO,
        scale: {
          mode: Phaser.Scale.FIT,
          parent: gameRef.current,
          width: 800,
          height: 600,
          autoCenter: Phaser.Scale.CENTER_BOTH
        },
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 0 }
          }
        },
        scene: {
          preload: preload,
          create: create,
          update: update
        }
      };

      let dragon, skeleton, dragonEye1, dragonEye2, skeletonEye1, skeletonEye2;
      let gameScene;
      let currentHealth = 2;
      let maxHealth = 2;
      let waveNumber = 1;
      let gameStarted = false;

      function preload() {
        gameScene = this;

        // Create intimidating angry dragon sprite
        const dragonGraphics = this.add.graphics();

        // Dragon main body - darker, more menacing colors
        dragonGraphics.fillStyle(0x1C5F3F); // Dark forest green body
        dragonGraphics.fillEllipse(55, 45, 75, 45);

        // Dragon muscular chest - armored appearance
        dragonGraphics.fillStyle(0x8B4513); // Dark brown armored chest
        dragonGraphics.fillRect(40, 42, 35, 20);
        dragonGraphics.fillStyle(0xA0522D); // Lighter brown highlights
        dragonGraphics.fillRect(42, 44, 31, 16);

        // Dragon head - angular and fierce
        dragonGraphics.fillStyle(0x0F4C2A); // Very dark green head
        dragonGraphics.fillEllipse(85, 30, 40, 32);

        // Dragon fierce snout with snarling mouth
        dragonGraphics.fillStyle(0x1C5F3F);
        dragonGraphics.fillEllipse(100, 32, 25, 18);

        // Snarling mouth opening
        dragonGraphics.fillStyle(0x000000);
        dragonGraphics.fillEllipse(105, 35, 15, 8);

        // Sharp teeth
        dragonGraphics.fillStyle(0xFFFFFF);
        for (let i = 0; i < 4; i++) {
          dragonGraphics.fillTriangle(100 + i * 3, 33, 101 + i * 3, 30, 102 + i * 3, 33);
          dragonGraphics.fillTriangle(100 + i * 3, 37, 101 + i * 3, 40, 102 + i * 3, 37);
        }

        // Aggressive neck armor plating
        dragonGraphics.fillStyle(0x2F4F4F); // Dark gray armor
        for (let i = 0; i < 5; i++) {
          dragonGraphics.fillRect(68 + i * 3, 36 - i * 2, 10, 8);
        }

        // Menacing battle-scarred wings - back wing
        dragonGraphics.fillStyle(0x003D3D); // Very dark teal wing membrane
        dragonGraphics.beginPath();
        dragonGraphics.moveTo(40, 20);
        dragonGraphics.lineTo(15, 5);
        dragonGraphics.lineTo(0, 20);
        dragonGraphics.lineTo(5, 50);
        dragonGraphics.lineTo(20, 55);
        dragonGraphics.lineTo(40, 45);
        dragonGraphics.closePath();
        dragonGraphics.fill();

        // Wing bone structure - thicker, more intimidating
        dragonGraphics.lineStyle(3, 0x1A1A1A); // Almost black bones
        dragonGraphics.beginPath();
        dragonGraphics.moveTo(40, 20);
        dragonGraphics.lineTo(15, 5);
        dragonGraphics.moveTo(40, 28);
        dragonGraphics.lineTo(10, 20);
        dragonGraphics.moveTo(40, 36);
        dragonGraphics.lineTo(15, 45);
        dragonGraphics.strokePath();

        // Wing tears and battle damage
        dragonGraphics.fillStyle(0x000000);
        dragonGraphics.fillEllipse(25, 15, 4, 8);
        dragonGraphics.fillEllipse(18, 35, 3, 6);

        // Front wing - darker and more battle-worn
        dragonGraphics.fillStyle(0x2F6B6B); // Dark teal wing membrane
        dragonGraphics.beginPath();
        dragonGraphics.moveTo(45, 18);
        dragonGraphics.lineTo(25, 2);
        dragonGraphics.lineTo(5, 12);
        dragonGraphics.lineTo(3, 38);
        dragonGraphics.lineTo(18, 60);
        dragonGraphics.lineTo(35, 52);
        dragonGraphics.lineTo(45, 38);
        dragonGraphics.closePath();
        dragonGraphics.fill();

        // Front wing bone structure - thicker and more prominent
        dragonGraphics.lineStyle(3, 0x1A1A1A);
        dragonGraphics.beginPath();
        dragonGraphics.moveTo(45, 18);
        dragonGraphics.lineTo(25, 2);
        dragonGraphics.moveTo(45, 25);
        dragonGraphics.lineTo(15, 12);
        dragonGraphics.moveTo(45, 32);
        dragonGraphics.lineTo(10, 35);
        dragonGraphics.moveTo(45, 38);
        dragonGraphics.lineTo(20, 52);
        dragonGraphics.strokePath();

        // More wing battle damage
        dragonGraphics.fillStyle(0x000000);
        dragonGraphics.fillEllipse(30, 25, 3, 5);
        dragonGraphics.fillEllipse(22, 40, 4, 7);

        // Massive intimidating horns
        dragonGraphics.fillStyle(0x2F2F2F); // Dark gray horns
        dragonGraphics.fillTriangle(80, 15, 84, 2, 88, 15);
        dragonGraphics.fillTriangle(90, 15, 94, 2, 98, 15);

        // Horn highlights to show sharpness
        dragonGraphics.fillStyle(0x696969);
        dragonGraphics.fillTriangle(81, 14, 83, 8, 85, 14);
        dragonGraphics.fillTriangle(91, 14, 93, 8, 95, 14);

        // Massive intimidating spikes along neck and back
        dragonGraphics.fillStyle(0x1A1A1A); // Almost black spikes
        for (let i = 0; i < 6; i++) {
          const x = 70 - i * 7;
          const y = 22 + i * 3;
          // Larger, more menacing spikes
          dragonGraphics.fillTriangle(x - 4, y + 8, x, y - 5, x + 4, y + 8);
          // Sharp spike tips
          dragonGraphics.fillStyle(0x696969);
          dragonGraphics.fillTriangle(x - 2, y + 6, x, y - 3, x + 2, y + 6);
          dragonGraphics.fillStyle(0x1A1A1A);
        }

        // Powerful muscular tail - thicker and more threatening
        dragonGraphics.fillStyle(0x1C5F3F);
        dragonGraphics.fillEllipse(25, 55, 30, 18);
        dragonGraphics.fillEllipse(15, 62, 25, 15);
        dragonGraphics.fillEllipse(8, 68, 18, 12);

        // Deadly tail spikes - larger and sharper
        dragonGraphics.fillStyle(0x1A1A1A);
        dragonGraphics.fillTriangle(18, 50, 22, 42, 26, 50);
        dragonGraphics.fillTriangle(12, 58, 16, 50, 20, 58);
        dragonGraphics.fillTriangle(6, 65, 10, 57, 14, 65);

        // Spike highlights
        dragonGraphics.fillStyle(0x696969);
        dragonGraphics.fillTriangle(20, 49, 22, 45, 24, 49);
        dragonGraphics.fillTriangle(14, 57, 16, 53, 18, 57);
        dragonGraphics.fillTriangle(8, 64, 10, 60, 12, 64);

        // Massive razor-sharp claws
        dragonGraphics.fillStyle(0x2F2F2F); // Dark gray claws
        dragonGraphics.fillEllipse(45, 65, 18, 12);
        dragonGraphics.fillEllipse(65, 65, 18, 12);

        // Intimidating claw talons
        dragonGraphics.fillStyle(0x1A1A1A);
        for (let i = 0; i < 4; i++) {
          // Left foot claws
          dragonGraphics.fillTriangle(42 + i * 3, 67, 43 + i * 3, 74, 44 + i * 3, 67);
          // Right foot claws
          dragonGraphics.fillTriangle(62 + i * 3, 67, 63 + i * 3, 74, 64 + i * 3, 67);
        }

        // Claw highlights for sharpness
        dragonGraphics.fillStyle(0x696969);
        for (let i = 0; i < 4; i++) {
          dragonGraphics.fillTriangle(42 + i * 3, 68, 43 + i * 3, 71, 43.5 + i * 3, 68);
          dragonGraphics.fillTriangle(62 + i * 3, 68, 63 + i * 3, 71, 63.5 + i * 3, 68);
        }

        // Flaring nostrils with smoke
        dragonGraphics.fillStyle(0x000000);
        dragonGraphics.fillEllipse(105, 29, 3, 4);
        dragonGraphics.fillEllipse(109, 31, 2, 3);

        // Battle scars on body
        dragonGraphics.lineStyle(2, 0x1A1A1A, 0.6);
        dragonGraphics.beginPath();
        dragonGraphics.moveTo(35, 40);
        dragonGraphics.lineTo(45, 45);
        dragonGraphics.moveTo(55, 35);
        dragonGraphics.lineTo(65, 42);
        dragonGraphics.moveTo(48, 52);
        dragonGraphics.lineTo(58, 48);
        dragonGraphics.strokePath();

        // Intimidating scale armor pattern
        dragonGraphics.lineStyle(1, 0x0F4C2A, 0.8);
        for (let x = 35; x < 75; x += 5) {
          for (let y = 35; y < 60; y += 4) {
            dragonGraphics.strokeRect(x, y, 3, 3);
          }
        }

        dragonGraphics.generateTexture('dragon', 120, 80);
        dragonGraphics.destroy();

        // Create detailed skeleton sprite
        const skeletonGraphics = this.add.graphics();
        // Skeleton head (skull)
        skeletonGraphics.fillStyle(0xf0f0f0);
        skeletonGraphics.fillCircle(30, 20, 15);
        // Skeleton body (ribcage)
        skeletonGraphics.fillRect(25, 30, 10, 30);
        // Skeleton arms
        skeletonGraphics.fillRect(15, 35, 15, 4);
        skeletonGraphics.fillRect(40, 35, 15, 4);
        // Skeleton legs
        skeletonGraphics.fillRect(27, 60, 3, 25);
        skeletonGraphics.fillRect(33, 60, 3, 25);
        // Skeleton ribs
        skeletonGraphics.lineStyle(2, 0xf0f0f0);
        skeletonGraphics.beginPath();
        skeletonGraphics.moveTo(25, 35);
        skeletonGraphics.lineTo(35, 35);
        skeletonGraphics.moveTo(25, 40);
        skeletonGraphics.lineTo(35, 40);
        skeletonGraphics.moveTo(25, 45);
        skeletonGraphics.lineTo(35, 45);
        skeletonGraphics.strokePath();
        skeletonGraphics.generateTexture('skeleton', 60, 100);
        skeletonGraphics.destroy();
      }

      function create() {
        // Create background with gradient effect
        const bg = gameScene.add.graphics();
        bg.fillGradientStyle(0x1e3c72, 0x1e3c72, 0x2a5298, 0x2a5298, 1);
        bg.fillRect(0, 0, 800, 600);

        // Add clouds for atmosphere
        gameScene.add.ellipse(150, 100, 80, 40, 0xffffff, 0.3);
        gameScene.add.ellipse(350, 80, 100, 50, 0xffffff, 0.2);
        gameScene.add.ellipse(600, 120, 90, 45, 0xffffff, 0.25);

        // Add ground with texture
        gameScene.add.rectangle(400, 550, 800, 100, 0x4a4a4a);
        gameScene.add.rectangle(400, 540, 800, 20, 0x5a5a5a);

        // Create dragon
        dragon = gameScene.add.image(150, 450, 'dragon');

        // Create skeleton
        skeleton = gameScene.add.image(650, 450, 'skeleton');

        // Add menacing dragon eyes - fierce and intimidating
        dragonEye1 = gameScene.add.circle(dragon.x + 38, dragon.y - 22, 4, 0xff0000); // Bright red glow
        dragonEye2 = gameScene.add.circle(dragon.x + 45, dragon.y - 20, 4, 0xff0000);

        // Add eye pupils for more intensity
        const dragonPupil1 = gameScene.add.circle(dragon.x + 38, dragon.y - 22, 2, 0x000000);
        const dragonPupil2 = gameScene.add.circle(dragon.x + 45, dragon.y - 20, 2, 0x000000);

        dragonEye1.setAlpha(1.0);
        dragonEye2.setAlpha(1.0);
        dragonPupil1.setAlpha(0.8);
        dragonPupil2.setAlpha(0.8);

        // Add subtle flame breath particle effect
        const breathParticles = gameScene.add.particles(dragon.x + 50, dragon.y - 8, 'skeleton', {
          scale: { start: 0.05, end: 0 },
          speed: { min: 10, max: 25 },
          lifespan: 400,
          tint: [0xff6600, 0xff9900, 0xffcc00, 0xff4400],
          frequency: 300,
          quantity: 1,
          alpha: { start: 0.7, end: 0 }
        });

        // Add skeleton glowing red eyes
        skeletonEye1 = gameScene.add.circle(skeleton.x - 8, skeleton.y - 30, 3, 0xff0000);
        skeletonEye2 = gameScene.add.circle(skeleton.x + 8, skeleton.y - 30, 3, 0xff0000);

        // Intense eye glow animation for angry dragon
        gameScene.tweens.add({
          targets: [dragonEye1, dragonEye2],
          alpha: 0.7,
          scaleX: 1.3,
          scaleY: 1.3,
          duration: 800,
          yoyo: true,
          repeat: -1,
          ease: 'Power2.easeInOut'
        });

        // Skeleton eye animation (separate from dragon)
        gameScene.tweens.add({
          targets: [skeletonEye1, skeletonEye2],
          alpha: 0.3,
          duration: 1000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });

        // Aggressive dragon hovering - more pronounced
        gameScene.tweens.add({
          targets: [dragon, dragonEye1, dragonEye2, dragonPupil1, dragonPupil2],
          y: '+=20',
          duration: 1500,
          yoyo: true,
          repeat: -1,
          ease: 'Power1.easeInOut'
        });

        // Intimidating wing flapping - faster and more aggressive
        gameScene.tweens.add({
          targets: dragon,
          scaleY: 1.15,
          scaleX: 1.05,
          duration: 200,
          yoyo: true,
          repeat: -1,
          ease: 'Power2'
        });

        // Dragon head tilt for menacing look
        gameScene.tweens.add({
          targets: dragon,
          angle: 3,
          duration: 2500,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });

        // Skeleton idle sway animation
        gameScene.tweens.add({
          targets: [skeleton, skeletonEye1, skeletonEye2],
          x: '+=10',
          duration: 3000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });

        // Skeleton menacing animation
        gameScene.tweens.add({
          targets: skeleton,
          angle: 2,
          duration: 4000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });

        // Start countdown
        startCountdown();
      }

      function startCountdown() {
        let count = 3;

        const countdownInterval = setInterval(() => {
          const countdownElement = gameScene.add.text(400, 300, count > 0 ? count : 'GO!', {
            fontSize: '72px',
            fill: '#ff6b35',
            fontStyle: 'bold'
          }).setOrigin(0.5);

          // Fade out countdown text
          gameScene.tweens.add({
            targets: countdownElement,
            alpha: 0,
            duration: 800,
            onComplete: () => countdownElement.destroy()
          });

          if (count === 0) {
            clearInterval(countdownInterval);
            gameStarted = true;
            showMathQuestion();
          }
          count--;
        }, 1000);
      }

      function showMathQuestion() {
        if (gameStarted) {
          const question = generateQuestion();
          setCurrentQuestion(question);
          setShowQuestion(true);
          // Timer will be started by React useEffect when showQuestion becomes true
        }
      }

      function dragonAttack() {
        if (!dragon || !skeleton) return;

        // Dragon breathing animation
        gameScene.tweens.add({
          targets: dragon,
          scaleX: 1.2,
          duration: 200,
          yoyo: true,
          ease: 'Power2'
        });

        // Enhanced fireball attack from dragon's mouth
        const startX = dragon.x + 55; // Adjusted for new sprite mouth position
        const startY = dragon.y - 8;

        // Create enhanced fireball with multiple layers
        const fireball = gameScene.add.circle(startX, startY, 15, 0xff4400);
        const fireballGlow = gameScene.add.circle(startX, startY, 25, 0xff9900, 0.4);
        const fireballCore = gameScene.add.circle(startX, startY, 10, 0xffff00, 0.9);
        const fireballOuter = gameScene.add.circle(startX, startY, 30, 0xff6600, 0.2);

        // Enhanced fireball spinning animation
        gameScene.tweens.add({
          targets: [fireball, fireballGlow, fireballCore, fireballOuter],
          angle: 360,
          duration: 600,
          repeat: -1
        });

        // Pulsing effect for more dramatic appearance
        gameScene.tweens.add({
          targets: [fireballGlow, fireballOuter],
          scaleX: 1.2,
          scaleY: 1.2,
          duration: 200,
          yoyo: true,
          repeat: -1
        });

        // Fireball travel animation
        gameScene.tweens.add({
          targets: [fireball, fireballGlow, fireballCore, fireballOuter],
          x: skeleton.x - 30,
          y: skeleton.y,
          duration: 800,
          ease: 'Power2',
          onComplete: () => {
            // Multiple explosion effects
            const explosion1 = gameScene.add.circle(skeleton.x, skeleton.y, 25, 0xff0000, 0.8);
            const explosion2 = gameScene.add.circle(skeleton.x, skeleton.y, 35, 0xff6600, 0.6);
            const explosion3 = gameScene.add.circle(skeleton.x, skeleton.y, 45, 0xff9900, 0.4);

            // Screen shake effect
            gameScene.cameras.main.shake(200, 0.01);

            // Explosion animation
            gameScene.tweens.add({
              targets: [explosion1, explosion2, explosion3],
              scaleX: 2.5,
              scaleY: 2.5,
              alpha: 0,
              duration: 400,
              ease: 'Power2',
              onComplete: () => {
                explosion1.destroy();
                explosion2.destroy();
                explosion3.destroy();
              }
            });

            fireball.destroy();
            fireballGlow.destroy();
            fireballCore.destroy();
            fireballOuter.destroy();
            damageSkeleton();
          }
        });
      }

      function damageSkeleton() {
        currentHealth--;
        setSkeletonHealth(currentHealth);

        // Skeleton damage animation
        if (skeleton) {
          gameScene.tweens.add({
            targets: skeleton,
            x: skeleton.x + 20,
            duration: 100,
            yoyo: true,
            repeat: 2
          });
        }

        if (currentHealth <= 0) {
          // Skeleton defeated - spawn new one with more health
          waveNumber++;
          maxHealth = waveNumber + 1; // Each wave adds 1 more health
          currentHealth = maxHealth;

          setCurrentWave(waveNumber);
          setMaxSkeletonHealth(maxHealth);
          setSkeletonHealth(currentHealth);

          // Award bonus points for defeating skeleton
          const defeatBonus = (waveNumber - 1) * 200;
          setGameScore(prev => prev + defeatBonus);
          if (onScoreUpdate) {
            onScoreUpdate(defeatBonus);
          }

          // Skeleton death animation
          gameScene.tweens.add({
            targets: [skeleton, skeletonEye1, skeletonEye2],
            alpha: 0,
            scaleX: 0.5,
            scaleY: 0.5,
            duration: 500,
            onComplete: () => {
              // Show Wave Cleared React Overlay
              setShowWaveCleared(true);

              // Auto-hide after 2.5 seconds and spawn new skeleton
              setTimeout(() => {
                setShowWaveCleared(false);
                spawnNewSkeleton();
              }, 2500);
            }
          });
        } else {
          // Continue with next question
          setTimeout(() => {
            showMathQuestion();
          }, 1500);
        }
      }

      function spawnNewSkeleton() {
        // Remove old skeleton and eyes
        if (skeleton) skeleton.destroy();
        if (skeletonEye1) skeletonEye1.destroy();
        if (skeletonEye2) skeletonEye2.destroy();

        // Create new skeleton with enhanced appearance for higher waves
        skeleton = gameScene.add.image(650, 450, 'skeleton');

        // Make skeleton more menacing based on wave number
        const intensity = Math.min(waveNumber * 0.15, 0.8);
        const tintColor = Phaser.Display.Color.Interpolate.ColorWithColor(
          { r: 240, g: 240, b: 240 }, // Original white
          { r: 80, g: 0, b: 0 }, // Dark red for higher waves (more menacing)
          1,
          intensity
        );
        skeleton.setTint(Phaser.Display.Color.GetColor(tintColor.r, tintColor.g, tintColor.b));

        // Progressive size increase - skeleton gets 15% larger each wave
        const scale = 1 + (waveNumber - 1) * 0.15;
        skeleton.setScale(scale);

        // Adjust position slightly for larger skeletons to keep them grounded
        const yOffset = (scale - 1) * 25;
        skeleton.y = 450 - yOffset;

        // Add skeleton glowing red eyes (more intense for higher waves)
        const eyeColor = waveNumber > 3 ? 0xff0000 : 0xff4444;
        const eyeSize = 3 + (scale - 1) * 2; // Eyes get bigger with skeleton size
        const eyeOffsetY = 30 * scale; // Adjust eye position based on skeleton scale
        skeletonEye1 = gameScene.add.circle(skeleton.x - 8 * scale, skeleton.y - eyeOffsetY, eyeSize, eyeColor);
        skeletonEye2 = gameScene.add.circle(skeleton.x + 8 * scale, skeleton.y - eyeOffsetY, eyeSize, eyeColor);

        // Eye glow animation (more aggressive for higher waves)
        gameScene.tweens.add({
          targets: [skeletonEye1, skeletonEye2],
          alpha: 0.3,
          duration: 1000 - (waveNumber * 100), // Faster blinking for higher waves
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });

        // Skeleton idle sway animation
        gameScene.tweens.add({
          targets: [skeleton, skeletonEye1, skeletonEye2],
          x: '+=10',
          duration: 3000 - (waveNumber * 200), // Faster movement for higher waves
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });

        // Skeleton menacing animation
        gameScene.tweens.add({
          targets: skeleton,
          angle: 2 + (waveNumber * 0.5), // More menacing angle for higher waves
          duration: 4000 - (waveNumber * 300),
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });

        // Show new wave announcement
        const newWaveText = gameScene.add.text(400, 200, `Wave ${waveNumber}\nSkeleton HP: ${maxHealth}`, {
          fontSize: '36px',
          fill: '#ff6b35',
          fontStyle: 'bold',
          align: 'center'
        }).setOrigin(0.5);

        // Fade out announcement and continue game
        gameScene.tweens.add({
          targets: newWaveText,
          alpha: 0,
          duration: 3000,
          onComplete: () => {
            newWaveText.destroy();
            setTimeout(() => {
              showMathQuestion();
            }, 500);
          }
        });
      }

      function update() {
        // Game loop updates - animations are handled by tweens
      }

      // Expose functions globally for React component
      window.dragonAttack = dragonAttack;
      window.dragonShowQuestion = showMathQuestion;
      window.startQuestionTimer = () => {
        setTimeRemaining(10);
        setIsTimerActive(true);
      };

      phaserGameRef.current = new Phaser.Game(config);

      // Ensure the Phaser canvas fills the parent container to avoid right-side gaps
      try {
        const canvas = phaserGameRef.current.canvas || (phaserGameRef.current && phaserGameRef.current.game && phaserGameRef.current.game.canvas);
        if (canvas) {
          canvas.style.width = '100%';
          canvas.style.height = '100%';
          canvas.style.display = 'block';
        }
      } catch (e) {
        // ignore styling errors
      }
    }

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
        window.dragonAttack = null;
        window.dragonShowQuestion = null;
        window.startQuestionTimer = null;
      }
    };
  }, []);

  // Timer countdown effect
  useEffect(() => {
    let timer;
    if (isTimerActive && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isTimerActive) {
      // Time's up - exit the game
      setIsTimerActive(false);
      setShowQuestion(false);
      if (onGameComplete) {
        setTimeout(() => {
          onGameComplete(false);
        }, 500);
      }
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerActive, timeRemaining, onGameComplete]);

  // Start timer when question becomes visible
  useEffect(() => {
    if (showQuestion && currentQuestion) {
      setTimeRemaining(10);
      setIsTimerActive(true);
    }
  }, [showQuestion, currentQuestion]);

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    if (currentQuestion && userAnswer.trim()) {
      const isCorrect = parseInt(userAnswer) === currentQuestion.answer;

      if (isCorrect) {
        // Correct answer - dragon attacks!
        if (window.dragonAttack) {
          window.dragonAttack();
        }
        setShowQuestion(false);
        setUserAnswer('');
        const points = 100 + (currentWave - 1) * 25; // Bonus points for higher waves
        setGameScore(prev => prev + points);
        if (onScoreUpdate) {
          onScoreUpdate(points);
        }
      } else {
        // Wrong answer - show feedback and try again
        setTimeout(() => {
          alert(`Incorrect! The answer is ${currentQuestion.answer}. Try the next question!`);
          setShowQuestion(false);
          setUserAnswer('');
          setTimeout(() => {
            if (window.dragonShowQuestion) {
              window.dragonShowQuestion();
            }
          }, 1000);
        }, 100);
      }
    }
  };

  return (
    <div className="relative w-full h-full bg-gray-900">
      {/* Game Canvas */}
      <div ref={gameRef} className="w-full h-full overflow-hidden" />

      {/* Health Display */}
      <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md text-white p-4 rounded-xl border border-blue-500/30">
        <div className="text-center">
          <h3 className="text-[10px] cyber-text text-slate-400 mb-1">TARGET_ENTITY</h3>
          <h4 className="font-black text-lg mb-1 italic game-text-shadow">WAVE_{currentWave}_SKELETON</h4>
          <div className="bg-gray-700/50 rounded-full h-3 w-32 mb-2 overflow-hidden border border-slate-600">
            <div
              className="bg-gradient-to-r from-rose-500 to-red-600 h-full transition-all duration-300 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
              style={{ width: `${(skeletonHealth / maxSkeletonHealth) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs font-bold game-text-shadow">{skeletonHealth} / {maxSkeletonHealth} HP</p>
        </div>
      </div>

      {/* Score Display */}
      <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white p-4 rounded-xl border border-blue-500/30">
        <div className="text-center">
          <h3 className="text-[10px] cyber-text text-slate-400 mb-1">MISSION_SCORE</h3>
          <p className="text-3xl font-black text-blue-400 game-text-shadow italic">{gameScore}</p>
        </div>
      </div>

      {/* Math Question Overlay */}
      {showQuestion && currentQuestion && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm z-50">
          <div className="console-panel p-10 text-center max-w-md relative border-t-4 border-t-blue-500">
            <h2 className="text-sm cyber-text text-blue-400 mb-4 animate-pulse">Incoming Math Challenge</h2>
            <p className="text-5xl font-black mb-8 text-white game-text-shadow italic tracking-tighter">
              {currentQuestion.question}
            </p>
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <div className={`relative w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-300 ${timeRemaining <= 3 ? 'bg-red-500 text-white scale-110 animate-pulse shadow-lg shadow-red-500/50' :
                timeRemaining <= 5 ? 'bg-orange-500 text-white scale-105 shadow-lg shadow-orange-500/50' :
                  'bg-green-500 text-white shadow-lg shadow-green-500/50'
                }`}>
                {/* Circular progress indicator */}
                <svg className="absolute inset-0 w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeOpacity="0.2"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - timeRemaining / 10)}`}
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>
                <span className="relative z-10">{timeRemaining}</span>
              </div>
            </div>

            <form onSubmit={handleAnswerSubmit} className="space-y-6">
              <div className="relative">
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="INPUT_VALUE_HERE"
                  className="w-full px-4 py-5 text-4xl font-black rounded-xl bg-slate-950/50 text-blue-400 border-2 border-blue-500/50 focus:border-blue-400 focus:outline-none text-center cyber-text shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                  autoFocus
                />
                <div className="absolute top-0 right-3 text-[10px] cyber-text text-blue-500/50 p-2">INT_ONLY</div>
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all duration-200 transform hover:scale-[1.02] border-b-4 border-blue-800 shadow-lg cyber-text tracking-widest"
              >
                DEPLOY_DRAGON_STRIKE
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Wave Cleared Overlay */}
      {showWaveCleared && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 backdrop-blur-md z-[100] animate-in fade-in duration-500">
          <div className="console-panel p-12 text-center border-t-8 border-t-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
            <div className="text-[10px] cyber-text text-emerald-500 mb-4 tracking-[0.6em] animate-pulse">MISSION_SUCCESS</div>
            <h2 className="text-6xl font-black text-white mb-2 italic tracking-tighter game-text-shadow">WAVE_{currentWave - 1}_NEUTRALIZED</h2>
            <p className="text-emerald-400 font-bold cyber-text text-xl mb-8 tracking-widest">THREAT_LEVEL_UPGRADED</p>

            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <span className="block text-[8px] cyber-text text-slate-500 mb-1">XP_GAINED</span>
                <span className="text-3xl font-black text-white">+{(currentWave - 1) * 200}_PTS</span>
              </div>
              <div className="w-[1px] h-12 bg-slate-800" />
              <div className="text-center">
                <span className="block text-[8px] cyber-text text-slate-500 mb-1">STRIKE_ACCURACY</span>
                <span className="text-3xl font-black text-white">100%</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DragonMathGame;
