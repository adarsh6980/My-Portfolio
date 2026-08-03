import { ChangeDetectionStrategy, Component, ElementRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { PortfolioApiService } from '../../core/services/portfolio-api.service';

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.scss',
})
export class ContactForm {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(PortfolioApiService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly submitting = signal(false);
  readonly status = signal<{ kind: 'idle' | 'success' | 'error'; message: string }>({ kind: 'idle', message: '' });
  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    subject: ['', [Validators.required, Validators.maxLength(160)]],
    message: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(4000)]],
    website: [''],
  });

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      queueMicrotask(() => this.host.nativeElement.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    if (this.submitting()) return;

    this.submitting.set(true);
    this.status.set({ kind: 'idle', message: '' });
    this.api
      .submitContact(this.form.getRawValue())
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (result) => {
          this.status.set({ kind: 'success', message: result.message });
          this.form.reset();
        },
        error: () => this.status.set({ kind: 'error', message: 'The message could not be sent. Keep your details and try again in a moment.' }),
      });
  }
}
