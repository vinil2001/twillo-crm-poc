import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CallPopupComponent } from './features/call-popup/call-popup.component';
import { RealTimeService, IncomingCallPayload } from './core/realtime.service';
import { CustomerService, Customer } from './core/customer.service';
import { TwilioService } from './core/twilio.service';
import { environment } from '../environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CallPopupComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {
  // Стан попапа
  popupVisible = false;
  fromNumber = '';
  customer: Customer | null = null;
  loading = false;
  callSid = '';

  private subscriptions: Subscription[] = [];

  constructor(
    private realTimeService: RealTimeService,
    private customerService: CustomerService,
    private twilioService: TwilioService
  ) {}

  async ngOnInit() {
    // Підключити SignalR для отримання подій про вхідні дзвінки
    this.realTimeService.start(environment.apiBaseUrl);

    // Підписатися на події вхідних дзвінків через SignalR
    const signalRSub = this.realTimeService.incomingCall$.subscribe(async (payload: IncomingCallPayload | null) => {
      if (payload) {
        await this.handleIncomingCall(payload);
      }
    });

    // Опційно: ініціалізувати Twilio Device для веб-софтфону
    try {
      await this.twilioService.init('agent-1', environment.apiBaseUrl);
      
      // Підписатися на події вхідних дзвінків через Twilio Device
      const twilioSub = this.twilioService.incoming$.subscribe(async (callData) => {
        if (callData) {
          await this.handleIncomingCall({
            fromNumber: callData.from,
            callSid: callData.callSid,
            timestampUtc: new Date().toISOString()
          });
        }
      });
      
      this.subscriptions.push(twilioSub);
    } catch (error) {
      console.warn('Twilio Device не вдалося ініціалізувати (можливо, бекенд недоступний):', error);
    }

    this.subscriptions.push(signalRSub);
  }

  ngOnDestroy() {
    // Відключити всі підписки
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.realTimeService.stop();
    this.twilioService.disconnect();
  }

  private async handleIncomingCall(payload: IncomingCallPayload) {
    console.log('Обробка вхідного дзвінка:', payload);
    
    this.fromNumber = payload.fromNumber;
    this.callSid = payload.callSid;
    this.popupVisible = true;
    this.loading = true;
    this.customer = null;

    try {
      // Спробувати отримати дані клієнта з API
      this.customerService.getByPhone(payload.fromNumber, environment.apiBaseUrl).subscribe({
        next: (customer) => {
          this.customer = customer;
          this.loading = false;
        },
        error: (error) => {
          console.warn('Не вдалося отримати дані клієнта з API, використовуємо тестові дані:', error);
          // Використати тестові дані якщо API недоступний
          this.customer = this.customerService.getMockCustomer(payload.fromNumber);
          this.loading = false;
        }
      });
    } catch (error) {
      console.error('Помилка при отриманні даних клієнта:', error);
      this.customer = this.customerService.getMockCustomer(payload.fromNumber);
      this.loading = false;
    }
  }

  onAnswerCall() {
    console.log('Відповісти на дзвінок:', this.callSid);
    // Тут можна додати логіку для відповіді на дзвінок через Twilio
    this.closePopup();
  }

  onDeclineCall() {
    console.log('Відхилити дзвінок:', this.callSid);
    // Тут можна додати логіку для відхилення дзвінка через Twilio
    this.closePopup();
  }

  closePopup() {
    this.popupVisible = false;
    this.customer = null;
    this.fromNumber = '';
    this.callSid = '';
    this.loading = false;
  }

  // Test function for popup demonstration
  testPopup() {
    this.handleIncomingCall({
      fromNumber: '+353851234567',
      callSid: 'test-call-sid-123',
      timestampUtc: new Date().toISOString()
    });
  }
}
