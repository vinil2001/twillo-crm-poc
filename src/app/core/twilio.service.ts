import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Device, Call } from '@twilio/voice-sdk';

@Injectable({ providedIn: 'root' })
export class TwilioService {
  private device?: Device;
  public incoming$ = new BehaviorSubject<{ from: string; callSid: string } | null>(null);
  public deviceReady$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  async init(identity: string, apiBaseUrl: string): Promise<void> {
    try {
      // Get token from backend
      const token = await this.http.get(`${apiBaseUrl}/api/twilio/token`, {
        params: { identity },
        responseType: 'text'
      }).toPromise();

      if (!token) {
        throw new Error('Failed to obtain Twilio token');
      }

      // Initialize Twilio Device
      this.device = new Device(token, { 
        logLevel: 'error'
      });

      // Event handlers
      this.device.on('ready', () => {
        console.log('Twilio Device is ready');
        this.deviceReady$.next(true);
      });

      this.device.on('error', (error) => {
        console.error('Twilio Device error:', error);
        this.deviceReady$.next(false);
      });

      this.device.on('incoming', (call: Call) => {
        console.log('Incoming call via Twilio Device:', call);
        const from = call.parameters?.['From'] || '';
        const callSid = call.parameters?.['CallSid'] || '';
        this.incoming$.next({ from, callSid });
      });

      this.device.on('disconnect', () => {
        console.log('Twilio Device disconnected');
        this.deviceReady$.next(false);
      });

      // Register device
      await this.device.register();

    } catch (error) {
      console.error('Twilio initialization error:', error);
      throw error;
    }
  }

  async makeCall(to: string): Promise<Call | null> {
    if (!this.device || !this.deviceReady$.value) {
      console.error('Twilio Device is not ready');
      return null;
    }

    try {
      const call = await this.device.connect({ 
        params: { To: to }
      });
      return call;
    } catch (error) {
      console.error('Error making a call:', error);
      return null;
    }
  }

  disconnect(): void {
    if (this.device) {
      this.device.destroy();
      this.device = undefined;
      this.deviceReady$.next(false);
    }
  }
}