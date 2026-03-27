import React, { useEffect, useRef } from 'react';

const SciFiBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        // Optimized parameters
        const stars = Array.from({ length: 50 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1.5,
            speed: 0.2 + Math.random() * 0.8
        }));

        const render = () => {
            // Clear with dark blue
            ctx.fillStyle = '#020617';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw Starfield (Low intensity)
            ctx.fillStyle = '#ffffff';
            stars.forEach(star => {
                ctx.globalAlpha = 0.1 + Math.sin(Date.now() * 0.001 + star.x) * 0.2;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();
                star.y += star.speed;
                if (star.y > canvas.height) star.y = 0;
            });

            // Draw Perspective Grid (Simplified)
            const horizon = canvas.height * 0.5;
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 1;

            // Vertical lines
            ctx.globalAlpha = 0.1;
            for (let x = -canvas.width; x <= canvas.width * 2; x += 100) {
                ctx.beginPath();
                ctx.moveTo(x, canvas.height);
                ctx.lineTo(canvas.width / 2 + (x - canvas.width / 2) * 0.1, horizon);
                ctx.stroke();
            }

            // Horizontal lines
            for (let i = 0; i < 10; i++) {
                const y = horizon + (canvas.height - horizon) * Math.pow(i / 10, 2);
                ctx.globalAlpha = 0.02 + (i / 10) * 0.1;
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-[#020617]">
            {/* CSS-based fluid glows (more performant than canvas gradients) */}
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-900/20 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-900/10 blur-[100px] rounded-full" />

            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
            />

            {/* Static Scanline Overlay (Low opacity) */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,3px_100%]" />
        </div>
    );
};

export default SciFiBackground;

