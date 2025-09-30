import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { TwilioService } from './twilio.service';

describe('TwilioService', () => {
  let service: TwilioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(TwilioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle demo mode initialization', async () => {
    // In demo mode, init should throw an error but not crash
    await expectAsync(service.init('test-user', 'https://localhost:5001')).toBeRejected();
  });
});
