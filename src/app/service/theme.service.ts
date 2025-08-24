import { getEmptyUser } from './../interfaces/user.interface';
// theme.service.ts
import { inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { UserInterface } from '../interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private currentTheme: 'light' | 'dark' = 'light'; // tema inicial

  private lightTheme = 'light-theme.css';
  private darkTheme = 'dark-theme.css';
  $onThemeChange = new Subject<'light' | 'dark'>();
  private readonly authSrv: AuthService = inject(AuthService);
  private _userData: UserInterface = getEmptyUser();
  constructor() {
    this.authSrv.user$.subscribe({
      next: (res) => {
        if (res) {
          this._userData = res;
        }
      },
    });
  }

  toggleTheme() {
    const themeLink = document.getElementById('app-theme') as HTMLLinkElement;
    if (!themeLink) return;
    if (this.currentTheme === 'light') {
      themeLink.href = this.darkTheme;
      this.currentTheme = 'dark';
      this._userData.settings.darkMode = true;
      this.authSrv.updateUserData(this._userData).subscribe((res) => {
        this.$onThemeChange.next('dark');
      });
    } else {
      themeLink.href = this.lightTheme;
      this.currentTheme = 'light';
      this._userData.settings.darkMode = false;
          this.authSrv.updateUserData(this._userData).subscribe((res) => {
        this.$onThemeChange.next('light');
      });
    }
  }

  getCurrentTheme() {
    return this.currentTheme;
  }
}
