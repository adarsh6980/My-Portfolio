import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[appTilt]',
})
export class TiltDirective {
  private readonly el = inject(ElementRef<HTMLElement>);

  @HostListener('pointermove', ['$event'])
  onPointerMove(event: PointerEvent): void {
    if (event.pointerType !== 'mouse') return;
    const rect = this.el.nativeElement.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const style = this.el.nativeElement.style;
    style.setProperty('--tilt-x', `${(0.5 - y) * 8}deg`);
    style.setProperty('--tilt-y', `${(x - 0.5) * 10}deg`);
    style.setProperty('--glare-x', `${x * 100}%`);
    style.setProperty('--glare-y', `${y * 100}%`);
  }

  @HostListener('pointerleave')
  onPointerLeave(): void {
    const style = this.el.nativeElement.style;
    style.setProperty('--tilt-x', '0deg');
    style.setProperty('--tilt-y', '0deg');
  }
}
