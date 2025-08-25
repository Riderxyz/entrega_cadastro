import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntregasListComponent } from './entregas-list.component';

const routes: Routes = [{ path: '', component: EntregasListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntregasListRoutingModule { }
