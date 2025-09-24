import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallPopup } from './call-popup';

describe('CallPopup', () => {
  let component: CallPopup;
  let fixture: ComponentFixture<CallPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
