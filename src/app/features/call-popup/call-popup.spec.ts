import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CallPopupComponent } from './call-popup.component';

describe('CallPopupComponent', () => {
  let component: CallPopupComponent;
  let fixture: ComponentFixture<CallPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display customer information when provided', () => {
    component.customer = {
      id: '1',
      name: 'Test Customer',
      phone: '+353851234567',
      email: 'test@example.com'
    };
    component.visible = true;
    component.loading = false;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test Customer');
  });
});
