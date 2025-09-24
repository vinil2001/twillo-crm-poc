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
    // Оновити час дзвінка при показі попапа
    if (this.visible) {
      this.callTime = new Date();
    }
  }

  ngOnChanges() {
    // Оновити час дзвінка при зміні видимості
    if (this.visible) {
      this.callTime = new Date();
    }
  }

  close(): void {
    this.visible = false;
    this.closeClicked.emit();
  }

  answerCall(): void {
    console.log('Відповісти на дзвінок:', this.callSid);
    this.answerClicked.emit();
  }

  declineCall(): void {
    console.log('Відхилити дзвінок:', this.callSid);
    this.declineClicked.emit();
  }
}