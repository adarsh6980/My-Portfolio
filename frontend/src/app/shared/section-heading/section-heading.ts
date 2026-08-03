import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-section-heading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="section-heading"><p class="eyebrow">{{ eyebrow() }}</p><h2>{{ title() }}</h2><p>{{ description() }}</p></div>`,
})
export class SectionHeading {
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly description = input.required<string>();
}
