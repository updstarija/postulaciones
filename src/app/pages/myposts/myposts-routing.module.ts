import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MypostsComponent } from './myposts.component';

const routes: Routes = [{ path: '', component: MypostsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MypostsRoutingModule { }
