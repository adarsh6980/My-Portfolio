import { afterNextRender, Component, DestroyRef, ElementRef, inject, ViewChild } from '@angular/core';

const CHARSET = '01</>{}[]();=+-*&|!?#$%';

@Component({
  selector: 'app-matrix-rain',
  template: `<canvas #canvas></canvas>`,
  styles: [`:host{position:fixed;inset:0;z-index:-3;pointer-events:none;opacity:.25}canvas{display:block;width:100%;height:100%}`],
})
export class MatrixRain {
  @ViewChild('canvas', { static: true }) private readonly canvasRef!: ElementRef<HTMLCanvasElement>;
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const canvas = this.canvasRef.nativeElement;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const fontSize = 16;
      let columns = 0;
      let drops: number[] = [];

      const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        columns = Math.floor(canvas.width / fontSize);
        drops = Array.from({ length: columns }, () => Math.random() * -100);
      };
      resize();
      window.addEventListener('resize', resize);

      const draw = () => {
        ctx.fillStyle = 'rgba(18, 23, 44, 0.08)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = `${fontSize}px "IBM Plex Mono", monospace`;
        for (let i = 0; i < columns; i++) {
          const char = CHARSET[Math.floor(Math.random() * CHARSET.length)];
          ctx.fillStyle = Math.random() > 0.85 ? '#4fe8ff' : 'rgba(91, 127, 255, 0.7)';
          ctx.fillText(char, i * fontSize, drops[i] * fontSize);
          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
          drops[i]++;
        }
      };

      const interval = window.setInterval(draw, 55);
      this.destroyRef.onDestroy(() => {
        window.clearInterval(interval);
        window.removeEventListener('resize', resize);
      });
    });
  }
}
