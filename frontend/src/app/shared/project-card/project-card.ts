import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project } from '../../models/portfolio.models';
import { RevealDirective, RevealVariant } from '../reveal/reveal.directive';
import { TiltDirective } from '../tilt/tilt.directive';

const VARIANT_BY_COLUMN: readonly RevealVariant[] = ['left', 'fade', 'right'];

@Component({
  selector: 'app-project-card',
  imports: [RouterLink, RevealDirective, TiltDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss',
})
export class ProjectCard {
  readonly project = input.required<Project>();
  readonly revealDelay = input(0);
  readonly variantIndex = input(0);
  protected readonly revealVariant = computed(() => VARIANT_BY_COLUMN[this.variantIndex() % 3]);

  protected isPlaceholder(value: string): boolean {
    return value.startsWith('[ADD ');
  }
}
