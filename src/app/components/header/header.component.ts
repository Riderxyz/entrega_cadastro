import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToolbarModule } from 'primeng/toolbar';
import { AvatarModule } from 'primeng/avatar';
import { AuthService } from 'src/app/service/auth.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ToolbarModule, AvatarModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
avatarUrl = '';
avatarName = '';

private readonly authSrv: AuthService = inject(AuthService);
  constructor() {

  }


  ngOnInit(): void {
    this.avatarUrl = this.authSrv.localUserData.avatarUrl;
    this.avatarName = this.authSrv.localUserData.name.split(' ')[0];



  /*   this.authSrv.listenToUserChanges().pipe(

    ).subscribe({
      next: (res) => {
        console.log(res);

      }
    }) */
  }




  toggleSideMenu() {

  }
}
