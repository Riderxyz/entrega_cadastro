import { config } from './../../service/config';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToolbarModule } from 'primeng/toolbar';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { AuthService } from 'src/app/service/auth.service';
import { CentralRxJsService } from 'src/app/service/centralRXJS.service';
import { ThemeService } from 'src/app/service/theme.service';
import { UserInterface, getEmptyUser } from 'src/app/interfaces/user.interface';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,FormsModule, ToolbarModule, AvatarModule, ButtonModule, InputSwitchModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  avatarUrl = '';
  avatarName = '';
  private _userData: UserInterface = getEmptyUser();
  isDarkModeActive = false;
  private readonly authSrv: AuthService = inject(AuthService);
  private readonly centralRxJsSrv: CentralRxJsService =
    inject(CentralRxJsService);
  private readonly themeSrv: ThemeService = inject(ThemeService);
  constructor() {}

  ngOnInit(): void {

    this.authSrv.user$.subscribe({
      next: (res) => {
        if (res) {
          this._userData = res;
          this.avatarName = this._userData.displayName!;
          this.avatarUrl = this._userData.photoURL!;
          if (this._userData.settings.darkMode) {
            this.isDarkModeActive = true;
            if (this.themeSrv.getCurrentTheme() !== 'dark') {
             this.themeSrv.toggleTheme();
            }
          }
        }
      },
    });

    console.log(this.avatarUrl);
  }

  toggleSideMenu() {
    this.centralRxJsSrv.sendData({
      key: config.senderKeys.sidebar,
    });
  }

  toggleTheme() {
    //this.isDarkModeActive = !this.isDarkModeActive;
    this.themeSrv.toggleTheme();
  }
}
