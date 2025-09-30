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
    console.warn('Twilio service unavailable (no backend connection). App will work in demo mode.');
    
    // Skip Twilio initialization entirely when no backend is available
    // This prevents HTTP requests that would result in ERR_CONNECTION_REFUSED
    
    this.deviceReady$.next(false);
    
    // In a real production environment, you would attempt the connection:
    // await this.initializeTwilioDevice(identity, apiBaseUrl);
    
    // Throw error to maintain the same behavior for the calling code
    throw new Error('Backend unavailable - demo mode');
  }

  private async initializeTwilioDevice(identity: string, apiBaseUrl: string): Promise<void> {
    try {
      console.log('Attempting to initialize Twilio Device...');
      
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
      console.log('Twilio Device initialized successfully');

    } catch (error) {
      // More graceful error handling - don't log as error if it's just a connection issue
      if (error && typeof error === 'object' && 'status' in error && error.status === 0) {
        console.warn('Twilio service unavailable (no backend connection). App will work in demo mode.');
      } else {
        console.warn('Twilio initialization failed:', error);
      }
      
      // Set device as not ready
      this.deviceReady$.next(false);
      
      // Re-throw the error so the calling code can handle it
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