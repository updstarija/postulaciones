import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApplicationPostsComponent } from './application-posts.component';

const routes: Routes = [{ path: '', component: ApplicationPostsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationPostsRoutingModule { }
