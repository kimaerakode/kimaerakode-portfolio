import { useEffect, useRef } from 'react';

type Particle = {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  life: number;
  size: number;
  character: string;
  color: string;
};

type FairyDustCursorProps = {
  color?: string;
  particleSize?: number;
  particleCount?: number;
};

export default function FairyDustCursor({
  color = '#0f0f11a1',
  particleSize = 14,
  particleCount = 1,
}: FairyDustCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

      const context = canvas.getContext('2d');
      


    if (!context) return;

    const particles: Particle[] = [];
    let animationFrame = 0;

 const resize = () => {
  const scale = window.devicePixelRatio || 1;

  canvas.width = window.innerWidth * scale;
  canvas.height = window.innerHeight * scale;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;

  context.setTransform(scale, 0, 0, scale, 0, 0);
 };
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    const addParticles = (x: number, y: number) => {
      for (let index = 0; index < particleCount; index += 1) {
        particles.push({
          x,
          y,
          velocityX: (Math.random() - 0.5) * 0.15,
          velocityY: -Math.random() * 0.15,
          life: 1,
          size: particleSize * (0.7 + Math.random() * 0.5),
          character: ['˙⋆✮⋆˚࿔', ' ✧. ݁⋆ ', '✶ ', '* . ݁⋆ '][Math.floor(Math.random() * 4)],
              color: getComputedStyle(document.body).color || color,
        });
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      addParticles(event.clientX, event.clientY);
    };

    const animate = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index];

        particle.x += particle.velocityX;
        particle.y += particle.velocityY;
        particle.velocityY += 0.0001;
        particle.life -= 0.008;

        if (particle.life <= 0) {
          particles.splice(index, 1);
          continue;
        }

        context.globalAlpha = particle.life;
        context.fillStyle = particle.color;
        context.font = `${particle.size}px sans-serif`;
        context.fillText(particle.character, particle.x, particle.y);
      }

      context.globalAlpha = 1;
      animationFrame = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', handlePointerMove);
    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [color, particleCount, particleSize]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
}