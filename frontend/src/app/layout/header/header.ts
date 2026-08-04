import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, HostListener, inject, input, signal, viewChild } from '@angular/core';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly destroyRef = inject(DestroyRef);
  readonly navigation = input.required<readonly { label: string; target: string }[]>();
  readonly name = input.required<string>();
  readonly resumePath = input.required<string>();
  readonly socialLinks = input.required<readonly { label: string; url: string; placeholder: boolean }[]>();
  readonly menuButton = viewChild<ElementRef<HTMLButtonElement>>('menuButton');
  readonly menuOpen = signal(false);
  readonly activeTarget = signal('home');

  constructor() {
    afterNextRender(() => {
      if (typeof IntersectionObserver === 'undefined') return;

      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];
          if (visible) this.activeTarget.set(visible.target.id);
        },
        { rootMargin: '-25% 0px -60% 0px', threshold: [0, 0.15, 0.4] },
      );

      for (const item of this.navigation()) {
        const section = document.getElementById(item.target);
        if (section) observer.observe(section);
      }
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  toggleMenu(): void {
    this.menuOpen.update((value) => !value);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  select(target: string): void {
    this.activeTarget.set(target);
    this.closeMenu();
  }

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    if (!this.menuOpen()) return;
    this.closeMenu();
    this.menuButton()?.nativeElement.focus();
  }
}
