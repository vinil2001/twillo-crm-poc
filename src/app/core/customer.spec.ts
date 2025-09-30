import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { CustomerService } from './customer.service';

describe('CustomerService', () => {
  let service: CustomerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(CustomerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return mock customer data', () => {
    const mockCustomer = service.getMockCustomer('+353851234567');
    expect(mockCustomer).toBeTruthy();
    expect(mockCustomer?.name).toBe('Dublin Tech Solutions Ltd');
  });
});
