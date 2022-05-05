import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardDocenteComponent } from './dashboard-docente.component';

const routes: Routes = [{ path: '', component: DashboardDocenteComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardDocenteRoutingModule { }
