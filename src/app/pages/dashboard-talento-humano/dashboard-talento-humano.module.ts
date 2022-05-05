import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardTalentoHumanoRoutingModule } from './dashboard-talento-humano-routing.module';
import { DashboardTalentoHumanoComponent } from './dashboard-talento-humano.component';


@NgModule({
  declarations: [DashboardTalentoHumanoComponent],
  imports: [
    CommonModule,
    DashboardTalentoHumanoRoutingModule
  ]
})
export class DashboardTalentoHumanoModule { }
