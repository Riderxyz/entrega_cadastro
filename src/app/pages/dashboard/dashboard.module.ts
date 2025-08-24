import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { StatusCardsComponent } from './status-cards/status-cards.component';
import { AgGridModule } from 'ag-grid-angular';
import { CardModule } from 'primeng/card';
@NgModule({
  declarations: [
    DashboardComponent,
    StatusCardsComponent
  ],
  imports: [
    CommonModule,
    CardModule,
    DashboardRoutingModule,
    AgGridModule
  ]
})
export class DashboardModule { }
