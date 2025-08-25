import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntregasListRoutingModule } from './entregas-list-routing.module';
import { EntregasListComponent } from './entregas-list.component';


@NgModule({
  declarations: [
    EntregasListComponent
  ],
  imports: [
    CommonModule,
    EntregasListRoutingModule
  ]
})
export class EntregasListModule { }
