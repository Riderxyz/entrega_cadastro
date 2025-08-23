import { Component, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { Message } from 'primeng/api';
import { ToastService } from 'src/app/service/toast.service';
@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  standalone: true,
  imports: [ToastModule],
  providers: [MessageService],
})
export class ToastComponent implements OnInit {
  msgs: Message[] = [];
  subscription: Subscription = new Subscription();
  private readonly toastSrv = inject(ToastService);
  private readonly msgSrv = inject(MessageService);
  constructor() {}

  ngOnInit(): void {
    this.subscribeToNotifications();
  }

  subscribeToNotifications() {
    this.subscription = this.toastSrv.notificationChange.subscribe(
      (notification) => {
        this.msgs.length = 0;
        this.msgSrv.add(notification);
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
