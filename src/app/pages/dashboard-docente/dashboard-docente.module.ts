import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardDocenteRoutingModule } from './dashboard-docente-routing.module';
import { DashboardDocenteComponent } from './dashboard-docente.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [DashboardDocenteComponent],
  imports: [CommonModule, DashboardDocenteRoutingModule, ComponentsModule],
})
export class DashboardDocenteModule {}
