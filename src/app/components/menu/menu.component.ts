import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AuthService } from 'src/app/service/auth.service';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import { CentralRxJsService } from 'src/app/service/centralRXJS.service';
import { config } from 'src/app/service/config';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, AppRoutingModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  private readonly authSrv: AuthService = inject(AuthService);
  private readonly router: Router = inject(Router);
  private readonly centralRxJsSrv: CentralRxJsService = inject(CentralRxJsService)
    readonly menuBtnArr = [
    { label: 'Dashboard', url: '/dashboard' },
    { label: 'Entregas', url: '/entregasList' },
    /*   { label: 'Usuários', url: '/usuarios' }, */
  ];
  constructor() {}

  sair() {
    console.log('2323qqqq');

    this.authSrv.logout().subscribe({
      next: () => {
        window.location.reload();
      },
    });
  }

  goTo(route: string) {
     this.centralRxJsSrv.sendData({
      key: config.senderKeys.sidebar,
    });
this.router.navigateByUrl(route)
  }
}
