import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntregasListRoutingModule } from './entregas-list-routing.module';
import { EntregasListComponent } from './entregas-list.component';

import { InputTextModule } from 'primeng/inputtext';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule } from "@angular/forms";

const primeNgModules = [
  ButtonModule,
  InputTextModule,
  ScrollPanelModule,
  TooltipModule,
  PanelModule,
];

@NgModule({
  declarations: [EntregasListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ...primeNgModules,
    EntregasListRoutingModule,
    AgGridModule,
    FormsModule
],
})
export class EntregasListModule {}
