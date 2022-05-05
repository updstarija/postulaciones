import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TracingPostRoutingModule } from './tracing-post-routing.module';
import { TracingPostComponent } from './tracing-post.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [TracingPostComponent],
  imports: [
    CommonModule,
    TracingPostRoutingModule,
    DataTablesModule,
    FormsModule,
    ComponentsModule,
  ],
})
export class TracingPostModule {}
