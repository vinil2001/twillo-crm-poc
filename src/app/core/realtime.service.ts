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
    this.hub = new signalR.HubConnectionBuilder()
      .withUrl(`${apiBaseUrl}/hubs/calls`)
      .withAutomaticReconnect()
      .build();

    this.hub.on('incomingCall', (payload: IncomingCallPayload) => {
      console.log('Incoming call received:', payload);
      this.incomingCall$.next(payload);
    });

    this.hub.start()
      .then(() => console.log('SignalR connected'))
      .catch(err => console.error('SignalR connection error:', err));
  }

  stop(): void {
    this.hub?.stop();
  }
}