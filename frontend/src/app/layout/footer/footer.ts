import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SocialLink } from '../../models/portfolio.models';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<footer><div><strong>{{ name() }}</strong><p>Designed and built with Angular, .NET and Microsoft Azure.</p></div><div class="footer-links">@for (link of links(); track link.label) { @if (link.placeholder) { <span>{{ link.label }} · placeholder</span> } @else { <a [href]="link.url" target="_blank" rel="noopener noreferrer">{{ link.label }}</a> } } @if (email().startsWith('[ADD ')) { <span>Email · placeholder</span> } @else { <a [href]="'mailto:' + email()">Email</a> }</div><p>© {{ year }} {{ name() }}</p></footer>`,
  styles: [`footer{display:grid;grid-template-columns:1fr auto;gap:1.5rem;padding:2rem clamp(1rem,3vw,2rem);border-top:1px solid var(--hairline);color:var(--muted)}strong{color:var(--ink)}p{margin:.35rem 0 0}.footer-links{display:flex;gap:1rem;font:600 .7rem var(--mono)}.footer-links a{color:var(--accent);text-underline-offset:.25rem}footer>p{grid-column:1/-1;font-size:.75rem}@media(max-width:600px){footer{grid-template-columns:1fr}.footer-links{flex-wrap:wrap}}`],
})
export class Footer {
  readonly name = input.required<string>();
  readonly links = input.required<readonly SocialLink[]>();
  readonly email = input.required<string>();
  readonly year = new Date().getFullYear();
}
