import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailPostsComponent } from './detail-posts.component';

const routes: Routes = [{ path: '', component: DetailPostsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailPostsRoutingModule { }
