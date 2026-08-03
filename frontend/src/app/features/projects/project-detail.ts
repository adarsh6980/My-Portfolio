import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, HostListener, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PORTFOLIO_DATA } from '../../data/portfolio-data';
import { Project } from '../../models/portfolio.models';

@Component({
  selector: 'app-project-detail',
  imports: [RouterLink],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  readonly backLink = viewChild<ElementRef<HTMLAnchorElement>>('backLink');
  readonly project = signal<Project | undefined>(undefined);
  private readonly opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((parameters) => {
      const slug = parameters.get('slug');
      this.project.set(PORTFOLIO_DATA.projects.find((candidate) => candidate.slug === slug));
    });

    afterNextRender(() => {
      const background = document.querySelectorAll<HTMLElement>('app-header, #main-content, app-footer');
      for (const element of background) {
        element.inert = true;
        element.setAttribute('aria-hidden', 'true');
      }
      this.backLink()?.nativeElement.focus();
      this.destroyRef.onDestroy(() => {
        for (const element of background) {
          element.inert = false;
          element.removeAttribute('aria-hidden');
        }
        queueMicrotask(() => this.opener?.focus());
      });
    });
  }

  @HostListener('document:keydown.escape')
  close(): void {
    void this.router.navigate(['/'], { fragment: 'projects' });
  }
}
