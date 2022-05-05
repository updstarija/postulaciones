import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardJefeCarreraRoutingModule } from './dashboard-jefe-carrera-routing.module';
import { DashboardJefeCarreraComponent } from './dashboard-jefe-carrera.component';


@NgModule({
  declarations: [DashboardJefeCarreraComponent],
  imports: [
    CommonModule,
    DashboardJefeCarreraRoutingModule
  ]
})
export class DashboardJefeCarreraModule { }
