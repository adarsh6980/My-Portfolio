"use client";

import { useEffect, useRef } from "react";

const CHARSET = "01</>{}[]();=+-*&|!?#$%";

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const fontSize = 16;
    let columns = 0;
    let drops: number[] = [];
    let speedBoost = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = Array.from({ length: columns }, () => Math.random() * -100);
    };
    resize();
    window.addEventListener("resize", resize);

    let lastScrollY = window.scrollY;
    const onScroll = () => {
      const delta = Math.abs(window.scrollY - lastScrollY);
      lastScrollY = window.scrollY;
      speedBoost = Math.min(speedBoost + delta * 0.05, 6);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const draw = () => {
      ctx.fillStyle = "rgba(11, 11, 13, 0.09)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px "IBM Plex Mono", monospace`;
      for (let i = 0; i < columns; i++) {
        const char = CHARSET[Math.floor(Math.random() * CHARSET.length)];
        ctx.fillStyle = Math.random() > 0.88 ? "#f4f4f5" : "rgba(161, 161, 170, 0.65)";
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 1 + speedBoost;
      }
      speedBoost = Math.max(speedBoost * 0.9 - 0.02, 0);
    };

    const interval = window.setInterval(draw, 55);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[-3] block h-full w-full opacity-[0.22]"
    />
  );
}
