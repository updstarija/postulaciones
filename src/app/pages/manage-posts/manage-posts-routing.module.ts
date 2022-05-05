import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManagePostsComponent } from './manage-posts.component';

const routes: Routes = [{ path: '', component: ManagePostsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagePostsRoutingModule { }
