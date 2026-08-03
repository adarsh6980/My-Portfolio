import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../config/app-config';

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  website: string;
}

export interface ContactResult {
  id: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class PortfolioApiService {
  private readonly http = inject(HttpClient);

  submitContact(payload: ContactPayload): Observable<ContactResult> {
    return this.http.post<ContactResult>(`${APP_CONFIG.apiUrl}/api/contact`, payload);
  }
}
