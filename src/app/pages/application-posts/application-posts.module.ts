import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationPostsRoutingModule } from './application-posts-routing.module';
import { ApplicationPostsComponent } from './application-posts.component';
import { DataTablesModule } from 'angular-datatables';
import { ComponentsModule } from 'src/app/components/components.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ApplicationPostsComponent],
  imports: [
    CommonModule,
    ApplicationPostsRoutingModule,
    DataTablesModule,
    FormsModule,
    ComponentsModule,
  ],
})
export class ApplicationPostsModule {}
