import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Toast } from 'primeng/toast';
import { take } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private readonly authSrv: AuthService = inject(AuthService);
  private readonly toastSrv: ToastService = inject(ToastService);
  private router = inject(Router);
  constructor() {
    this.authSrv.isLoggedIn$.pipe(take(1)).subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  login() {
    this.authSrv.loginWithGoogle().subscribe({
      next: (res) => {
        console.log(res);
      },
      error: () => {},
    });
  }
}
