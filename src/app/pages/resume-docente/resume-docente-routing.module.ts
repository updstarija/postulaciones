import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResumeDocenteComponent } from './resume-docente.component';

const routes: Routes = [{ path: '', component: ResumeDocenteComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResumeDocenteRoutingModule { }
