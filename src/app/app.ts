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
  // Popup state
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
    // Connect SignalR to receive incoming call events
    this.realTimeService.start(environment.apiBaseUrl);

    // Subscribe to incoming call events via SignalR
    const signalRSub = this.realTimeService.incomingCall$.subscribe(async (payload: IncomingCallPayload | null) => {
      if (payload) {
        await this.handleIncomingCall(payload);
      }
    });

    // Optionally: initialize Twilio Device for web softphone
    try {
      await this.twilioService.init('agent-1', environment.apiBaseUrl);
      
      // Subscribe to incoming call events via Twilio Device
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
      console.warn('Failed to initialize Twilio Device (backend may be unavailable):', error);
    }

    this.subscriptions.push(signalRSub);
  }

  ngOnDestroy() {
    // Unsubscribe and clean up
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.realTimeService.stop();
    this.twilioService.disconnect();
  }

  private async handleIncomingCall(payload: IncomingCallPayload) {
    console.log('Handling incoming call:', payload);
    
    this.fromNumber = payload.fromNumber;
    this.callSid = payload.callSid;
    this.popupVisible = true;
    this.loading = true;
    this.customer = null;

    try {
      // Try to get customer data from API
      this.customerService.getByPhone(payload.fromNumber, environment.apiBaseUrl).subscribe({
        next: (customer) => {
          this.customer = customer;
          this.loading = false;
        },
        error: (error) => {
          console.warn('Failed to fetch customer from API, using test data:', error);
          // Use test data if API is unavailable
          this.customer = this.customerService.getMockCustomer(payload.fromNumber);
          this.loading = false;
        }
      });
    } catch (error) {
      console.error('Error retrieving customer data:', error);
      this.customer = this.customerService.getMockCustomer(payload.fromNumber);
      this.loading = false;
    }
  }

  onAnswerCall() {
    console.log('Answer call:', this.callSid);
    // Add logic here to answer call via Twilio
    this.closePopup();
  }

  onDeclineCall() {
    console.log('Decline call:', this.callSid);
    // Add logic here to decline call via Twilio
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
