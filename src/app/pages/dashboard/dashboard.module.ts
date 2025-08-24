import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { StatusCardsComponent } from './status-cards/status-cards.component';
import { AgGridModule } from 'ag-grid-angular';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { PanelModule } from 'primeng/panel';
@NgModule({
  declarations: [
    DashboardComponent,
    StatusCardsComponent
  ],
  imports: [
    CommonModule,
    CardModule,
    InputTextModule,
    ScrollPanelModule,
    PanelModule,
    DashboardRoutingModule,
    AgGridModule
  ]
})
export class DashboardModule { }
