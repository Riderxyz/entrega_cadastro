import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
private readonly authSrv: AuthService = inject(AuthService)
  constructor() { }

  sair() {
    console.log('2323qqqq');

this.authSrv.logout().subscribe()
  }
}
