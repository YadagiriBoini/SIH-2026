import { useEffect, useRef } from 'react';

interface RadarCanvasProps {
  className?: string;
}

export default function RadarCanvas({ className }: RadarCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let angle = 0;

    // Seed deterministic blips (vessels + spill locations)
    const seedBlips = [
      { rx: 0.28, ry: 0.22, danger: true },
      { rx: -0.35, ry: 0.15, danger: false },
      { rx: 0.1, ry: -0.38, danger: false },
      { rx: -0.18, ry: -0.28, danger: false },
      { rx: 0.42, ry: -0.12, danger: false },
      { rx: -0.08, ry: 0.45, danger: true },
    ];

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.44;

      ctx.clearRect(0, 0, w, h);

      // Background fill
      ctx.fillStyle = '#030810';
      ctx.fillRect(0, 0, w, h);

      // Outer glow rings
      [0.9, 0.67, 0.44, 0.22].forEach((frac, i) => {
        const rr = r * frac / 0.9;
        ctx.beginPath();
        ctx.arc(cx, cy, rr, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 212, 255, ${0.08 - i * 0.015})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Cross hairs
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - r, cy); ctx.lineTo(cx + r, cy);
      ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r);
      ctx.stroke();

      // Diagonal cross hairs
      const d = r * 0.707;
      ctx.beginPath();
      ctx.moveTo(cx - d, cy - d); ctx.lineTo(cx + d, cy + d);
      ctx.moveTo(cx + d, cy - d); ctx.lineTo(cx - d, cy + d);
      ctx.stroke();

      // Draw sweep as arc fill
      const SWEEP_WIDTH = Math.PI / 2.5;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, 'rgba(0, 212, 255, 0.18)');
      grad.addColorStop(0.7, 'rgba(0, 212, 255, 0.06)');
      grad.addColorStop(1, 'rgba(0, 212, 255, 0)');

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, angle - SWEEP_WIDTH, angle);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();

      // Leading edge line
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#00D4FF';
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.restore();

      // Blips — fade with age, appear when sweep passes
      seedBlips.forEach((seed) => {
        const bx = cx + seed.rx * r;
        const by = cy + seed.ry * r;
        const blipAngle = Math.atan2(seed.ry, seed.rx);
        const normalizedAngle = ((angle - blipAngle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        const fadeAge = normalizedAngle / (Math.PI * 2);
        const alpha = Math.max(0, 1 - fadeAge * 1.5);

        if (alpha > 0) {
          // Outer glow
          ctx.beginPath();
          ctx.arc(bx, by, seed.danger ? 8 : 5, 0, Math.PI * 2);
          ctx.fillStyle = seed.danger
            ? `rgba(255, 59, 59, ${alpha * 0.2})`
            : `rgba(0, 212, 255, ${alpha * 0.15})`;
          ctx.fill();

          // Core dot
          ctx.beginPath();
          ctx.arc(bx, by, seed.danger ? 3 : 2, 0, Math.PI * 2);
          ctx.fillStyle = seed.danger
            ? `rgba(255, 59, 59, ${alpha})`
            : `rgba(0, 212, 255, ${alpha})`;
          ctx.shadowColor = seed.danger ? '#FF3B3B' : '#00D4FF';
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // Center dot
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#00D4FF';
      ctx.shadowColor = '#00D4FF';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      angle += 0.012;
      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-label="Radar sweep visualization showing vessel tracking"
      role="img"
      style={{ width: '100%', height: '100%' }}
    />
  );
}

// Polyfill for createConicalGradient check
declare global {
  interface CanvasRenderingContext2D {
    createConicalGradient?: (x: number, y: number, startAngle: number) => CanvasGradient;
  }
}
