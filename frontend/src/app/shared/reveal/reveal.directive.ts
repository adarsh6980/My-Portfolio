import { afterNextRender, Directive, DestroyRef, ElementRef, inject, input, numberAttribute } from '@angular/core';

export type RevealVariant = 'fade' | 'scan' | 'left' | 'right';

const CLASS_BY_VARIANT: Record<RevealVariant, string> = {
  fade: 'reveal',
  scan: 'reveal-scan',
  left: 'reveal-left',
  right: 'reveal-right',
};

@Directive({
  selector: '[appReveal]',
})
export class RevealDirective {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);
  readonly appRevealDelay = input(0, { alias: 'appReveal', transform: numberAttribute });
  readonly appRevealVariant = input<RevealVariant>('fade');

  constructor() {
    afterNextRender(() => {
      const node = this.el.nativeElement;
      const baseClass = CLASS_BY_VARIANT[this.appRevealVariant()];
      node.classList.add(baseClass);
      node.style.transitionDelay = `${this.appRevealDelay()}ms`;

      if (typeof IntersectionObserver === 'undefined') {
        node.classList.add(`${baseClass}-visible`);
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              node.classList.add(`${baseClass}-visible`);
              observer.unobserve(node);
            }
          }
        },
        { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
      );
      observer.observe(node);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
