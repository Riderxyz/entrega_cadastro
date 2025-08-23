import { Component, inject } from '@angular/core';
import { CentralRxJsService } from './service/centralRXJS.service';
import { AuthService } from './service/auth.service';
// Import the animation function from its module
import { expandOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [expandOnEnterAnimation({
    delay: 500,
    duration: 1000
  })]
})
export class AppComponent {
  title = 'entrega-dashboard';
  isMenuOpen = false
  private readonly centralRxJsSrv: CentralRxJsService = inject(CentralRxJsService);
  readonly AuthSrv: AuthService = inject(AuthService);
  constructor() {
this.centralRxJsSrv.dataToReceive.subscribe((res) => {
  console.log(res);
  this.isMenuOpen = !this.isMenuOpen;
})
  }
}
