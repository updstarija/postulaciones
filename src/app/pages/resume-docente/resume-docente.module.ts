import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResumeDocenteRoutingModule } from './resume-docente-routing.module';
import { ResumeDocenteComponent } from './resume-docente.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [ResumeDocenteComponent],
  imports: [CommonModule, ResumeDocenteRoutingModule, ComponentsModule],
})
export class ResumeDocenteModule {}
