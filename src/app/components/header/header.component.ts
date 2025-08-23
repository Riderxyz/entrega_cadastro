import { config } from './../../service/config';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToolbarModule } from 'primeng/toolbar';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { AuthService } from 'src/app/service/auth.service';
import { CentralRxJsService } from 'src/app/service/centralRXJS.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ToolbarModule, AvatarModule, ButtonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
avatarUrl = '';
avatarName = '';

private readonly authSrv: AuthService = inject(AuthService);
private readonly centralRxJsSrv: CentralRxJsService = inject(CentralRxJsService);
  constructor() {

  }


  ngOnInit(): void {
    this.avatarName = this.authSrv.localUserData.displayName!;
    this.avatarUrl = this.authSrv.localUserData.photoURL!;

    console.log(this.avatarUrl);
  }




  toggleSideMenu() {
this.centralRxJsSrv.sendData(
  {
    key: config.senderKeys.sidebar
  }
)
  }
}
