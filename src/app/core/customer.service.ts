import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  accountId?: string;
  notes?: string;
}

@Injectable({ providedIn: 'root' })
export class CustomerService {
  constructor(private http: HttpClient) {}

  getByPhone(phone: string, apiBaseUrl: string): Observable<Customer | null> {
    return this.http.get<Customer | null>(`${apiBaseUrl}/api/customers/by-phone`, { 
      params: { number: phone } 
    }).pipe(
      catchError(error => {
        console.error('Помилка отримання даних клієнта:', error);
        return of(null);
      })
    );
  }

  // Test data for demonstration (if backend is not ready)
  getMockCustomer(phone: string): Customer | null {
    const mockData: Customer[] = [
      {
        id: '1',
        name: 'Dublin Tech Solutions Ltd',
        phone: '+353851234567',
        email: 'contact@dublintech.ie',
        accountId: 'ACC-001',
        notes: 'VIP client, priority support required'
      },
      {
        id: '2', 
        name: 'Liam O\'Connor',
        phone: '+353861234567',
        email: 'liam.oconnor@gmail.com',
        notes: 'Regular customer since 2020'
      },
      {
        id: '3',
        name: 'Aoife Murphy',
        phone: '+353871234567',
        email: 'aoife.murphy@example.ie',
        accountId: 'ACC-002',
        notes: 'New client from Cork'
      }
    ];

    return mockData.find(c => c.phone === phone) || null;
  }
}