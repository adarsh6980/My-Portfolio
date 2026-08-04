import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PORTFOLIO_DATA } from './data/portfolio-data';
import { Confidence } from './models/portfolio.models';
import { ContactForm } from './features/contact/contact-form';
import { Footer } from './layout/footer/footer';
import { Header } from './layout/header/header';
import { ArchitectureDiagram } from './shared/architecture-diagram/architecture-diagram';
import { MatrixRain } from './shared/matrix-rain/matrix-rain';
import { ProjectCard } from './shared/project-card/project-card';
import { RevealDirective } from './shared/reveal/reveal.directive';
import { SectionHeading } from './shared/section-heading/section-heading';
import { TiltDirective } from './shared/tilt/tilt.directive';

const CONFIDENCE_TIER: Record<Confidence, number> = {
  'Professional experience': 4,
  'Strong working knowledge': 3,
  'Working knowledge': 2,
  'Currently developing': 1,
};

const RING_CIRCUMFERENCE = 2 * Math.PI * 15;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, SectionHeading, ProjectCard, ArchitectureDiagram, ContactForm, RevealDirective, TiltDirective, MatrixRain],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly data = PORTFOLIO_DATA;
  protected readonly hasSocialPresence =
    this.data.socialLinks.some((link) => !link.placeholder) || !this.data.profile.email.startsWith('[ADD ');
  protected readonly ringCircumference = RING_CIRCUMFERENCE;

  protected confidenceOffset(confidence: Confidence): number {
    return RING_CIRCUMFERENCE * (1 - CONFIDENCE_TIER[confidence] / 4);
  }
}
