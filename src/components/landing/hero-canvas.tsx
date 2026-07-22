"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient hero backdrop.
 *
 * A slow drift of soft particles in the brand's purple and green, joined by
 * faint lines when they pass near each other. Deliberately low-contrast so it
 * sits behind headline text without hurting readability, and light-themed to
 * keep the warm, non-technical feel the UMKM audience needs.
 *
 * Non-interactive (pointer-events none), capped device-pixel-ratio, and fully
 * disabled under prefers-reduced-motion.
 */
export function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const colors = ["124, 58, 237", "14, 143, 98"]; // brand purple, green (rgb)
    let width = 0;
    let height = 0;
    let raf = 0;

    type P = { x: number; y: number; vx: number; vy: number; r: number; c: string };
    let particles: P[] = [];

    function seed() {
      // Density scales with area but stays modest for performance on phones.
      const count = Math.min(52, Math.round((width * height) / 26000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.8 + 1.1,
        c: colors[Math.floor(Math.random() * colors.length)],
      }));
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function frame() {
      ctx!.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${p.c}, 0.5)`;
        ctx!.fill();
      }

      // Constellation links between nearby particles.
      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i];
          const b = particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 120) {
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.strokeStyle = `rgba(${a.c}, ${0.14 * (1 - dist / 120)})`;
            ctx!.lineWidth = 1;
            ctx!.stroke();
          }
        }
      }

      raf = requestAnimationFrame(frame);
    }

    resize();
    frame();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="hero-canvas" aria-hidden="true" />;
}
