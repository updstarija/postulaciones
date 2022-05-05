import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostsRoutingModule } from './posts-routing.module';
import { PostsComponent } from './posts.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [PostsComponent],
  imports: [CommonModule, PostsRoutingModule, ComponentsModule],
})
export class PostsModule {}
