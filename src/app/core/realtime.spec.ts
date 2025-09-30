import { TestBed } from '@angular/core/testing';
import { RealTimeService } from './realtime.service';

describe('RealTimeService', () => {
  let service: RealTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RealTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle demo mode', () => {
    // In demo mode, start() should not throw errors
    expect(() => service.start('https://localhost:5001')).not.toThrow();
  });
});
