import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter(routes)],
    }).compileComponents();
  });

  it('presents the supplied professional profile and complete navigation', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('Adarsh Ramakrishna');
    expect(compiled.textContent).toContain('Full-Stack Software Developer');
    expect(compiled.textContent).toContain('3+ years');
    expect(compiled.querySelectorAll('main section').length).toBeGreaterThanOrEqual(8);
    expect(compiled.querySelector('[href="#projects"]')).toBeTruthy();
    expect(compiled.querySelector('[href="#contact"]')).toBeTruthy();
    expect(compiled.querySelector('[href*="resume"]')).toBeTruthy();
  });

  it('exposes all three engineering case studies without invented links', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('AI-Assisted Code Documentation Platform');
    expect(compiled.textContent).toContain('Full-Stack Job Application Tracker');
    expect(compiled.textContent).toContain('Cloud-Based Project Management Application');
    expect(compiled.textContent).toContain('Parsing heterogeneous source structures');
    expect(compiled.textContent).toContain('Codebase upload or connection');
    expect(compiled.textContent).toContain('[ADD GITHUB URL]');
    expect(compiled.textContent).toContain('[ADD LIVE DEMO URL]');
  });

  it('uses evidence-based skill confidence labels instead of percentages', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Professional experience');
    expect(compiled.textContent).toContain('Strong working knowledge');
    expect(compiled.textContent).not.toMatch(/\b\d{1,3}%\b/);
  });

  it('opens the mobile navigation with an accessible expanded state', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const button = fixture.nativeElement.querySelector('.menu-toggle') as HTMLButtonElement;

    expect(button.getAttribute('aria-expanded')).toBe('false');
    button.click();
    fixture.detectChanges();
    expect(button.getAttribute('aria-expanded')).toBe('true');
  });

  it('marks the selected navigation section as the current location', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const projectsLink = fixture.nativeElement.querySelector('nav a[href="#projects"]') as HTMLAnchorElement;

    projectsLink.click();
    fixture.detectChanges();

    expect(projectsLink.getAttribute('aria-current')).toBe('location');
    expect(projectsLink.classList.contains('is-active')).toBe(true);
  });

  it('shows the real full-stack request lifecycle', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('[data-architecture="angular"]')).toBeTruthy();
    expect(compiled.querySelector('[data-architecture="api"]')).toBeTruthy();
    expect(compiled.querySelector('[data-architecture="ef-core"]')).toBeTruthy();
    expect(compiled.querySelector('[data-architecture="azure-sql"]')).toBeTruthy();
    expect(compiled.textContent).toContain('GitHub Actions');
    expect(compiled.textContent).toContain('Application Insights');
  });

  it('lazy-loads a project case study route and handles an unknown slug', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/projects/job-application-tracker');
    await fixture.whenStable();
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector('.case-study-page')?.textContent).toContain('Full-Stack Job Application Tracker');

    await router.navigateByUrl('/projects/unknown-project');
    await fixture.whenStable();
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector('.case-study-page')?.textContent).toContain('Project not found');
  });

  it('validates and submits the contact form through the backend API', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const form = root.querySelector('form') as HTMLFormElement;

    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    expect(root.textContent).toContain('Enter your name');
    expect(root.textContent).toContain('Enter a valid email address');

    const setValue = (selector: string, value: string) => {
      const input = root.querySelector(selector) as HTMLInputElement | HTMLTextAreaElement;
      input.value = value;
      input.dispatchEvent(new Event('input'));
    };
    setValue('#contact-name', 'Ada Recruiter');
    setValue('#contact-email', 'ada@example.com');
    setValue('#contact-subject', 'Junior developer role');
    setValue('#contact-message', 'Would you be available for a technical interview next week?');
    fixture.detectChanges();
    form.dispatchEvent(new Event('submit'));

    const http = TestBed.inject(HttpTestingController);
    const request = http.expectOne('http://localhost:5050/api/contact');
    expect(request.request.method).toBe('POST');
    request.flush({ id: '01JTEST', message: 'Message received.' });
    await fixture.whenStable();
    fixture.detectChanges();
    expect(root.textContent).toContain('Message received.');
    http.verify();
  });
});
