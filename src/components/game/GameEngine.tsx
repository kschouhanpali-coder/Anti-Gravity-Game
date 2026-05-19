'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/gameStore';
import { useAuthStore } from '@/store/authStore';
import { UserService, UserRow } from '@/services/userService';

interface GameEngineProps {
  userProfile: UserRow;
}

export default function GameEngine({ userProfile }: GameEngineProps) {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerFlipRef = useRef<() => void>(null);
  const { score, gravityDir, setScore, setGravityDir, resetGame } = useGameStore();
  const { fetchProfile } = useAuthStore();
  const [gameOver, setGameOver] = useState(false);
  const [saving, setSaving] = useState(false);
  const [gameKey, setGameKey] = useState(0);

  const profileRef = useRef(userProfile);
  useEffect(() => {
    profileRef.current = userProfile;
  }, [userProfile]);

  const handleReinitialize = () => {
    try {
      if (typeof document !== 'undefined' && document.activeElement) {
        (document.activeElement as HTMLElement).blur();
      }
    } catch (e) {
      console.warn('Failed to blur active element', e);
    }
    
    try {
      setGameOver(false);
      setGameKey((prev) => prev + 1);
    } catch (err) {
      console.error('State reinitialization failed, falling back to page reload', err);
      window.location.reload();
    }
  };

  useEffect(() => {
    resetGame();
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    const initTime = performance.now();

    // Constants
    const GRAVITY = 1800;
    const BASE_SPEED = 320;
    const MAX_FALL = 900;
    const FLIP_COOLDOWN = 300;

    // Game state
    const player = {
      x: 100,
      y: canvas.height / 2,
      vx: 0,
      vy: 0,
      width: 32,
      height: 32,
      color: '#00F0FF',
      isGrounded: false,
      rotation: 0
    };

    let localGravityDir = 1;
    let lastFlipTime = 0;
    let cameraX = 0;
    let localScore = 0;
    let gameIsOver = false;
    let localSpeed = BASE_SPEED;
    let localGameStarted = false;

    // Platforms (procedural endless)
    const platforms: {x: number, y: number, w: number, h: number, type: 'normal'|'gravity'}[] = [];
    
    // Initial resize to get correct dimensions before creating objects
    const resizeCanvas = () => {
      if (containerRef.current && canvas) {
        canvas.width = containerRef.current.clientWidth;
        canvas.height = Math.min(window.innerHeight * 0.7, 600);
      }
    };
    resizeCanvas();

    platforms.push(
      { x: 0, y: canvas.height - 40, w: 2000, h: 40, type: 'normal' },
      { x: 0, y: 0, w: 2000, h: 40, type: 'normal' }
    );
    
    // Coins
    const coins: {x: number, y: number, collected: boolean}[] = [];

    const flipGravity = () => {
      if (gameIsOver) return;
      if (!localGameStarted) {
        // Prevent accidental starting within 600ms of loading/resetting
        if (performance.now() - initTime < 600) return;
        localGameStarted = true;
        return;
      }
      const now = performance.now();
      if (now - lastFlipTime > FLIP_COOLDOWN) {
        localGravityDir *= -1;
        setGravityDir(localGravityDir);
        lastFlipTime = now;
        player.vy = 0; // Reset velocity on flip for snappier feeling
      }
    };

    // Attach to ref for UI button
    triggerFlipRef.current = flipGravity;

    const handleInput = (e: KeyboardEvent | TouchEvent | MouseEvent) => {
      if (gameIsOver) return;
      if (e.type === 'keydown' && (e as KeyboardEvent).repeat) return; // Prevent repeated key hold events from executing
      
      let isFlipAction = false;
      if (e.type === 'keydown' && ((e as KeyboardEvent).code === 'Space' || (e as KeyboardEvent).code === 'ArrowUp')) {
        isFlipAction = true;
        e.preventDefault(); // Prevent spacebar scrolling page
      } else if (e.type === 'touchstart') {
        // Only trigger flip if they tap the canvas, to avoid triggering when pressing the UI button
        if ((e.target as HTMLElement).tagName === 'CANVAS') {
          isFlipAction = true;
          e.preventDefault(); // Prevent scrolling
        }
      } else if (e.type === 'mousedown') {
        // Support desktop mouse click start/flip
        if ((e.target as HTMLElement).tagName === 'CANVAS') {
          isFlipAction = true;
        }
      }

      if (isFlipAction) {
        flipGravity();
      }
    };

    window.addEventListener('keydown', handleInput);
    window.addEventListener('touchstart', handleInput, { passive: false });
    window.addEventListener('mousedown', handleInput);

    const generatePlatforms = (startX: number) => {
      let currentX = startX;
      for (let i = 0; i < 5; i++) {
        const w = 200 + Math.random() * 300;
        const h = 40;
        
        // Randomly place floor or ceiling or middle
        const typeRand = Math.random();
        let y = 0;
        if (typeRand < 0.3) {
          y = canvas.height - h; // Floor
        } else if (typeRand < 0.6) {
          y = 0; // Ceiling
        } else {
          y = canvas.height / 2 - h / 2; // Middle
        }

        platforms.push({ x: currentX, y, w, h, type: 'normal' });
        
        // Add coins
        if (Math.random() > 0.3) {
          coins.push({
            x: currentX + w / 2,
            y: y === 0 ? h + 40 : y - 40,
            collected: false
          });
        }
        
        // Gap scales with speed so it remains playable at higher speeds
        const speedMultiplier = localSpeed / BASE_SPEED;
        currentX += w + (100 + Math.random() * 150) * speedMultiplier; 
      }
    };

    generatePlatforms(2000);

    // Particles
    const particles: {x: number, y: number, vx: number, vy: number, life: number, color: string, size: number}[] = [];
    const trail: {x: number, y: number, alpha: number}[] = [];
    let shakeIntensity = 0;

    const spawnParticles = (x: number, y: number, color: string, count: number = 10) => {
      for (let i = 0; i < count; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 400,
          vy: (Math.random() - 0.5) * 400,
          life: 1.0,
          color,
          size: 2 + Math.random() * 4
        });
      }
    };

    const floatingTexts: {x: number, y: number, text: string, life: number}[] = [];

    const gameLoop = (time: number) => {
      if (gameIsOver) return;
      
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Update shake
      if (shakeIntensity > 0) {
        shakeIntensity *= 0.9;
        if (shakeIntensity < 0.1) shakeIntensity = 0;
      }

      const prevSpeed = localSpeed;
      // Dynamic speed curve: more aggressive as score increases
      // Reaches ~2000+ speed at 10,000 score
      const speedBonus = localScore < 5000 
        ? (localScore / 100) * 15 
        : 750 + ((localScore - 5000) / 100) * 25;
      
      const targetSpeed = Math.min(BASE_SPEED + speedBonus, 2200);
      localSpeed += (targetSpeed - localSpeed) * 0.1; 
      
      // Level up flash (more frequent feedback)
      if (Math.floor(localSpeed / 100) > Math.floor(prevSpeed / 100)) {
        shakeIntensity = 10;
        floatingTexts.push({ x: player.x + 300, y: canvas.height / 2, text: 'SPEED UP!', life: 2.0 });
      }

      if (localGameStarted) {
        // Update player
        player.vx = localSpeed;
        player.vy += GRAVITY * localGravityDir * dt;
        if (Math.abs(player.vy) > MAX_FALL) {
          player.vy = Math.sign(player.vy) * MAX_FALL;
        }

        player.x += player.vx * dt;
        player.y += player.vy * dt;

        // Update trail
        trail.push({ x: player.x, y: player.y, alpha: 0.6 });
        if (trail.length > 15) trail.shift();
        trail.forEach(t => t.alpha -= 0.04);
      }

      // Update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt * 2;
        if (p.life <= 0) particles.splice(i, 1);
      }

      // Update floating texts
      for (let i = floatingTexts.length - 1; i >= 0; i--) {
        const t = floatingTexts[i];
        t.y -= 50 * dt;
        t.life -= dt;
        if (t.life <= 0) floatingTexts.splice(i, 1);
      }

      if (localGameStarted) {
        // Update camera
        cameraX = player.x - 100;

        // Generate new chunks
        if (platforms[platforms.length - 1].x < cameraX + canvas.width * 2) {
          generatePlatforms(platforms[platforms.length - 1].x + platforms[platforms.length - 1].w + 100);
        }

        // Collision detection
        const wasGrounded = player.isGrounded;
        player.isGrounded = false;
        for (const p of platforms) {
          if (p.x < player.x + player.width &&
              p.x + p.w > player.x &&
              p.y < player.y + player.height &&
              p.h + p.y > player.y) {
              
            // Better resolution handling for both directions
            const overlapTop = (player.y + player.height) - p.y;
            const overlapBottom = (p.y + p.h) - player.y;
            
            if (localGravityDir === 1) {
              if (player.vy >= 0 && overlapTop < player.height / 2) {
                player.y = p.y - player.height;
                player.vy = 0;
                player.isGrounded = true;
                if (!wasGrounded) {
                  spawnParticles(player.x + player.width / 2, p.y, player.color, 5);
                  shakeIntensity = 2;
                }
              } else if (player.vy < 0 && overlapBottom < player.height / 2) {
                // Hit ceiling
                player.y = p.y + p.h;
                player.vy = 0;
              }
            } else {
              if (player.vy <= 0 && overlapBottom < player.height / 2) {
                player.y = p.y + p.h;
                player.vy = 0;
                player.isGrounded = true;
                if (!wasGrounded) {
                  spawnParticles(player.x + player.width / 2, p.y + p.h, player.color, 5);
                  shakeIntensity = 2;
                }
              } else if (player.vy > 0 && overlapTop < player.height / 2) {
                // Hit floor while inverted
                player.y = p.y - player.height;
                player.vy = 0;
              }
            }
          }
        }

        // Coin collection
        for (const c of coins) {
          if (!c.collected && 
              Math.abs(c.x - (player.x + player.width/2)) < 30 &&
              Math.abs(c.y - (player.y + player.height/2)) < 30) {
            c.collected = true;
            localScore += 500;
            setScore(localScore);
            spawnParticles(c.x, c.y, '#FFD700', 15);
            floatingTexts.push({ x: c.x, y: c.y, text: '+500', life: 1.0 });
            shakeIntensity = 4;
          }
        }

        // Death bounds
        if (player.y > canvas.height + 100 || player.y + player.height < -100) {
          handleGameOver();
          return;
        }
        
        // Add score based on distance
        if (Math.floor(player.x / 100) > Math.floor((player.x - player.vx * dt) / 100)) {
          localScore += 10;
          setScore(localScore);
        }
      }

      // Rendering
      ctx.fillStyle = '#050510'; // Deeper background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars (parallax)
      for (let i = 0; i < 60; i++) {
        const speed = (i % 3 + 1) * 0.1;
        const sx = ((i * 123 + cameraX * speed) % canvas.width + canvas.width) % canvas.width;
        const sy = (i * 321) % canvas.height;
        const size = i % 3 + 1;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.2 + (i % 5) / 5})`;
        ctx.fillRect(sx, sy, size, size);
      }

      // Apply screen shake
      ctx.save();
      if (shakeIntensity > 0) {
        ctx.translate((Math.random() - 0.5) * shakeIntensity, (Math.random() - 0.5) * shakeIntensity);
      }
      ctx.translate(-cameraX, 0);

      // Draw platforms with gradients
      for (const p of platforms) {
        if (p.x + p.w < cameraX || p.x > cameraX + canvas.width) continue;
        
        const grad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.h);
        grad.addColorStop(0, '#1A1A3A');
        grad.addColorStop(1, '#0D0D1A');
        ctx.fillStyle = grad;
        ctx.fillRect(p.x, p.y, p.w, p.h);
        
        // Neon borders
        ctx.strokeStyle = '#B24BF3';
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';
        ctx.strokeRect(p.x, p.y, p.w, p.h);
        
        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#B24BF3';
        ctx.strokeRect(p.x, p.y, p.w, p.h);
        ctx.shadowBlur = 0;
      }

      // Draw trail
      for (const t of trail) {
        ctx.fillStyle = `rgba(0, 240, 255, ${t.alpha * 0.3})`;
        ctx.fillRect(t.x, t.y, player.width, player.height);
      }

      // Draw coins
      for (const c of coins) {
        if (c.collected || c.x < cameraX || c.x > cameraX + canvas.width) continue;
        
        const pulse = Math.sin(time / 200) * 3;
        const grad = ctx.createRadialGradient(c.x, c.y, 2, c.x, c.y, 10 + pulse);
        grad.addColorStop(0, '#FFF');
        grad.addColorStop(0.4, '#FFD700');
        grad.addColorStop(1, 'transparent');
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(c.x, c.y, 12 + pulse, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw particles
      for (const p of particles) {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
      ctx.globalAlpha = 1.0;

      // Draw floating texts
      ctx.font = 'bold 20px Inter';
      ctx.textAlign = 'center';
      for (const t of floatingTexts) {
        ctx.fillStyle = `rgba(255, 215, 0, ${t.life})`;
        ctx.fillText(t.text, t.x, t.y);
      }

      // Draw player
      ctx.save();
      ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
      
      // Animate rotation based on gravity
      const targetRotation = localGravityDir === 1 ? 0 : Math.PI;
      player.rotation += (targetRotation - player.rotation) * 0.15;
      ctx.rotate(player.rotation);
      
      // Dynamic stretching based on velocity
      const stretch = Math.min(Math.abs(player.vy) / 1000, 0.4);
      const scaleY = 1 + stretch;
      const scaleX = 1 - stretch * 0.5;
      ctx.scale(scaleX, scaleY);

      // Player body gradient
      const pGrad = ctx.createLinearGradient(-player.width/2, -player.height/2, player.width/2, player.height/2);
      pGrad.addColorStop(0, '#00F0FF');
      pGrad.addColorStop(1, '#0072FF');
      ctx.fillStyle = pGrad;
      
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#00F0FF';
      ctx.fillRect(-player.width / 2, -player.height / 2, player.width, player.height);
      
      // Decorative inner square
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.strokeRect(-player.width / 2 + 4, -player.height / 2 + 4, player.width - 8, player.height - 8);

      // Eyes (now more expressive)
      ctx.fillStyle = '#FFF';
      ctx.shadowBlur = 0;
      const eyeSize = 6;
      ctx.fillRect(2, -8, eyeSize, eyeSize);
      ctx.fillRect(14, -8, eyeSize, eyeSize);
      ctx.fillStyle = '#000';
      ctx.fillRect(4, -6, 2, 2);
      ctx.fillRect(16, -6, 2, 2);
      
      ctx.restore();
      ctx.restore();

      // Draw speed lines if fast
      if (localSpeed > 500) {
        ctx.strokeStyle = `rgba(0, 240, 255, ${(localSpeed - 500) / 1200})`;
        ctx.lineWidth = 1;
        for (let i = 0; i < 15; i++) {
          const lx = ((i * 223 - cameraX * 2) % canvas.width + canvas.width) % canvas.width;
          const ly = (i * 137) % canvas.height;
          const len = 30 + (i % 5) * 20;
          ctx.beginPath();
          ctx.moveTo(lx, ly);
          ctx.lineTo(lx + len, ly);
          ctx.stroke();
        }
      }

      // Draw Start Overlay Prompt if not started yet
      if (!localGameStarted) {
        ctx.fillStyle = 'rgba(5, 5, 16, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const pulse = Math.sin(time / 200) * 0.2 + 0.8;
        ctx.font = 'normal 14px "Press Start 2P", monospace';
        ctx.fillStyle = `rgba(0, 240, 255, ${pulse})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('PRESS SPACE OR TAP TO START', canvas.width / 2, canvas.height / 2);
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    const handleGameOver = async () => {
      if (gameIsOver) return;
      gameIsOver = true;
      setGameOver(true);
      setSaving(true);

      // Save score
      try {
        const currentProfile = profileRef.current;
        const newTotalRuns = (currentProfile.totalRuns || 0) + 1;
        const newHighScore = Math.max(localScore, currentProfile.highScore || 0);
        
        await UserService.updateProfile(currentProfile.uid, {
          totalRuns: newTotalRuns,
          highScore: newHighScore
        });
        
        await fetchProfile(currentProfile.uid);
      } catch (err) {
        console.error('Failed to save score', err);
      } finally {
        setSaving(false);
      }
    };

    window.addEventListener('resize', resizeCanvas);

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleInput);
      window.removeEventListener('touchstart', handleInput);
      window.removeEventListener('mousedown', handleInput);
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameKey]);

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center relative p-4" ref={containerRef}>
      <div className="w-full max-w-6xl relative flex flex-col items-center">
        
        {/* HUD */}
        <div className="absolute top-6 left-6 right-6 z-10 flex justify-between items-start font-press-start">
          <div className="flex flex-col gap-2">
            <div className="bg-black/40 backdrop-blur-md border border-white/10 p-3 rounded-lg flex items-center gap-3">
              <span className="text-[10px] text-gray-400">SCORE</span>
              <span className="text-xl text-brand-accent drop-shadow-[0_0_8px_#FFD700]">{score}</span>
            </div>
            <div className="bg-black/40 backdrop-blur-md border border-white/10 p-2 rounded-lg flex items-center gap-3 px-3">
              <span className="text-[8px] text-gray-400">BEST</span>
              <span className="text-xs text-white">{Math.max(score, userProfile.highScore || 0)}</span>
            </div>
          </div>
          
          <div className="bg-black/40 backdrop-blur-md border border-brand-neon-purple/30 p-3 rounded-lg hidden sm:flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full animate-pulse ${gravityDir === 1 ? 'bg-green-400' : 'bg-blue-400'}`}></div>
            <span className="text-[10px] text-white">GRAVITY: {gravityDir === 1 ? 'DOWN' : 'UP'}</span>
          </div>
        </div>

        <canvas 
          ref={canvasRef} 
          className="w-full rounded-2xl shadow-[0_0_50px_rgba(178,75,243,0.2)] border-2 border-brand-neon-purple/30 bg-[#050510] block cursor-pointer touch-none"
        />
        
        {/* Mobile Jump Button */}
        {!gameOver && (
          <button 
            className="md:hidden mt-8 bg-gradient-to-r from-brand-neon-purple to-brand-accent text-white font-press-start py-6 px-12 rounded-2xl active:scale-95 transition-all shadow-[0_10px_20px_rgba(178,75,243,0.4)] w-full max-w-sm text-sm"
            onPointerDown={(e) => {
              e.preventDefault();
              triggerFlipRef.current?.();
            }}
          >
            FLIP GRAVITY
          </button>
        )}

        {/* Game Over Screen */}
        {gameOver && (
          <div className="absolute inset-0 bg-[#050510]/95 flex flex-col items-center justify-center z-[999] pointer-events-auto rounded-2xl backdrop-blur-2xl border-2 border-red-500/30">
            <div className="relative">
              <h2 className="font-press-start text-4xl md:text-6xl text-red-500 mb-2 drop-shadow-[0_0_20px_#ef4444] text-center px-4">DEFEATED</h2>
              <div className="absolute -top-10 -right-10 opacity-20 text-8xl grayscale">👾</div>
            </div>
            
            <div className="flex flex-col items-center gap-2 mb-10">
              <p className="font-press-start text-sm text-gray-400">MISSION DATA RECOVERED</p>
              <p className="font-press-start text-3xl md:text-5xl text-white text-center px-4">
                {score.toLocaleString()} <span className="text-xs text-brand-accent">PTS</span>
              </p>
              {score > (userProfile.highScore || 0) && (
                <div className="bg-yellow-500 text-black px-3 py-1 rounded font-press-start text-[10px] animate-bounce mt-2">
                  NEW RECORD!
                </div>
              )}
            </div>
            
            {saving && (
              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="w-12 h-12 border-4 border-brand-neon-purple border-t-transparent rounded-full animate-spin"></div>
                <p className="font-press-start text-[10px] text-gray-400 animate-pulse">UPLOADING TO NEURAL LINK...</p>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-6 px-4 w-full justify-center max-w-lg z-[1000] relative">
              <button 
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleReinitialize();
                }}
                onTouchStart={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleReinitialize();
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleReinitialize();
                }}
                className="flex-1 font-press-start text-xs bg-white text-black px-8 py-5 rounded-xl hover:bg-brand-neon-purple hover:text-white transition-all duration-300 shadow-xl pointer-events-auto relative z-50 cursor-pointer"
              >
                RE-INITIALIZE
              </button>
              <button 
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  try {
                    router.push('/dashboard');
                  } catch {
                    window.location.href = '/dashboard';
                  }
                }}
                onTouchStart={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  try {
                    router.push('/dashboard');
                  } catch {
                    window.location.href = '/dashboard';
                  }
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  try {
                    router.push('/dashboard');
                  } catch {
                    window.location.href = '/dashboard';
                  }
                }}
                className="flex-1 font-press-start text-xs bg-black/50 text-white px-8 py-5 rounded-xl hover:bg-white/10 transition-all border border-white/10 pointer-events-auto relative z-50 cursor-pointer"
              >
                ABORT
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-8 flex flex-col items-center gap-2">
        <p className="font-inter text-gray-400 text-sm text-center hidden md:block opacity-60">
          COMMAND: <kbd className="bg-white/10 px-2 py-1 rounded text-white border border-white/20 mx-1">SPACE</kbd> TO INVERT GRAVITY
        </p>
      </div>
    </div>
  );
}
