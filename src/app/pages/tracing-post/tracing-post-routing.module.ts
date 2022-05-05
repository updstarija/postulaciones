import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TracingPostComponent } from './tracing-post.component';

const routes: Routes = [{ path: '', component: TracingPostComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TracingPostRoutingModule { }
