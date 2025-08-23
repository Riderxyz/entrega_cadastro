import { Component, inject } from '@angular/core';
import { Toast } from 'primeng/toast';
import { AuthService } from 'src/app/service/auth.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  private readonly authSrv:AuthService = inject(AuthService);
  private readonly toastSrv: ToastService = inject(ToastService)
  constructor() {


  }

login() {
this.authSrv.loginWithGoogle().subscribe({
  next: (res) => {
    console.log(res);

    
  },
  error: () => {}
})
}

}

