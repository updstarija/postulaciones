import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagePostsRoutingModule } from './manage-posts-routing.module';
import { ManagePostsComponent } from './manage-posts.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [ManagePostsComponent],
  imports: [CommonModule,ManagePostsRoutingModule,ComponentsModule],
})
export class ManagePostsModule { }
