import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailPostsRoutingModule } from './detail-posts-routing.module';
import { DetailPostsComponent } from './detail-posts.component';


@NgModule({
  declarations: [DetailPostsComponent],
  imports: [
    CommonModule,
    DetailPostsRoutingModule
  ]
})
export class DetailPostsModule { }
