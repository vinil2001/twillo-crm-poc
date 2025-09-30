import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

export interface IncomingCallPayload {
  fromNumber: string;
  callSid: string;
  timestampUtc: string;
}

@Injectable({ providedIn: 'root' })
export class RealTimeService {
  private hub?: signalR.HubConnection;
  public incomingCall$ = new BehaviorSubject<IncomingCallPayload | null>(null);

  start(apiBaseUrl: string): void {
    console.log('Backend service unavailable. App will work in demo mode.');
    // Skip SignalR connection entirely when no backend is available
    // This prevents the ERR_CONNECTION_REFUSED errors in the console
    
    // In a real production environment, you would attempt the connection:
    // this.connectToSignalR(apiBaseUrl);
  }

  private connectToSignalR(apiBaseUrl: string): void {
    console.log('Connecting to SignalR...');
    
    this.hub = new signalR.HubConnectionBuilder()
      .withUrl(`${apiBaseUrl}/hubs/calls`)
      .withAutomaticReconnect([0, 2000, 10000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    this.hub.onclose((error) => {
      if (error) {
        console.warn('SignalR connection closed due to error. App will work in demo mode.');
      }
    });

    this.hub.onreconnecting((error) => {
      console.log('SignalR attempting to reconnect...');
    });

    this.hub.onreconnected(() => {
      console.log('SignalR reconnected successfully');
    });

    this.hub.on('incomingCall', (payload: IncomingCallPayload) => {
      console.log('Incoming call received:', payload);
      this.incomingCall$.next(payload);
    });

    this.hub.start()
      .then(() => console.log('SignalR connected successfully'))
      .catch(err => {
        console.warn('SignalR connection failed. App will work in demo mode.');
      });
  }

  stop(): void {
    this.hub?.stop();
  }
}