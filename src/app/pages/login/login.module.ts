import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { DividerModule } from 'primeng/divider';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    DividerModule,
    LoginRoutingModule
  ]
})
export class LoginModule { }
