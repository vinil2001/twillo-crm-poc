import { TestBed } from '@angular/core/testing';

import { Twilio } from './twilio';

describe('Twilio', () => {
  let service: Twilio;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Twilio);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
