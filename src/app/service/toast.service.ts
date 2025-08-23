import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';
type Severities = 'success' | 'info' | 'warn' | 'error';
interface NotificationChangeInterface {
  severity: Severities;
  summary: string;
  detail: string;
  life: number;
}
@Injectable({
  providedIn: 'root',
})
export class ToastService {
  notificationChange: Subject<NotificationChangeInterface> = new Subject<NotificationChangeInterface>();
  constructor() {}

  /**
   *
   *
   * @param {Severities} severity tipo de toast que pode ser: success, info, warn, error
   * @param {string} summary Titulo do Toast
   * @param {string} detail Subtitulo do Toast
   * @param {number} life Tempo de vida do Toast
   * @memberof ToastService
   */
  notify(severity: Severities, summary: string, detail: string, life: number) {
    this.notificationChange.next({ severity, summary, detail, life });
  }
}
