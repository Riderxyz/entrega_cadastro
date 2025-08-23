import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

export interface SenderRXJS {
  key: string;
  data?: any;
}

@Injectable({
  providedIn: 'root' // Garante singleton sem necessidade de providers
})
export class CentralRxJsService {
  private readonly inputStream = new ReplaySubject<SenderRXJS>(1); // Mantém apenas o último valor
  private dasjObj: any;
  constructor() { }

  /** Envia um novo valor para os assinantes */
  sendData(value: SenderRXJS): void {
    this.inputStream.next(value);
  }

  /** Observable para componentes assinarem e receberem os dados */
  get dataToReceive(): Observable<SenderRXJS> {
    return this.inputStream.asObservable();
  }
}
