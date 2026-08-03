import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { ArchitectureStage } from '../../models/portfolio.models';

@Component({
  selector: 'app-architecture-diagram',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './architecture-diagram.html',
  styleUrl: './architecture-diagram.scss',
})
export class ArchitectureDiagram {
  readonly stages = input.required<readonly ArchitectureStage[]>();
  readonly activeStage = signal('angular');
}
