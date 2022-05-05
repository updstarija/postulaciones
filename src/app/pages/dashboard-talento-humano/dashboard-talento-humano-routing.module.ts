import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardTalentoHumanoComponent } from './dashboard-talento-humano.component';

const routes: Routes = [{ path: '', component: DashboardTalentoHumanoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardTalentoHumanoRoutingModule { }
