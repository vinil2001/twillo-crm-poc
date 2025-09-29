import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Customer } from '../../core/customer.service';

@Component({
  selector: 'app-call-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './call-popup.component.html',
  styleUrls: ['./call-popup.component.scss']
})
export class CallPopupComponent {
  @Input() visible = false;
  @Input() fromNumber = '';
  @Input() customer: Customer | null = null;
  @Input() loading = false;
  @Input() callSid = '';

  @Output() answerClicked = new EventEmitter<void>();
  @Output() declineClicked = new EventEmitter<void>();
  @Output() closeClicked = new EventEmitter<void>();

  callTime = new Date();

  ngOnInit() {
    // Update call time when popup is shown
    if (this.visible) {
      this.callTime = new Date();
    }
  }

  ngOnChanges() {
    // Update call time when visibility changes
    if (this.visible) {
      this.callTime = new Date();
    }
  }

  close(): void {
    this.visible = false;
    this.closeClicked.emit();
  }

  answerCall(): void {
    console.log('Answer call:', this.callSid);
    this.answerClicked.emit();
  }

  declineCall(): void {
    console.log('Decline call:', this.callSid);
    this.declineClicked.emit();
  }
}