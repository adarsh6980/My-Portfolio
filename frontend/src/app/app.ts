import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PORTFOLIO_DATA } from './data/portfolio-data';
import { ContactForm } from './features/contact/contact-form';
import { Footer } from './layout/footer/footer';
import { Header } from './layout/header/header';
import { ArchitectureDiagram } from './shared/architecture-diagram/architecture-diagram';
import { ProjectCard } from './shared/project-card/project-card';
import { SectionHeading } from './shared/section-heading/section-heading';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, SectionHeading, ProjectCard, ArchitectureDiagram, ContactForm],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly data = PORTFOLIO_DATA;
}
