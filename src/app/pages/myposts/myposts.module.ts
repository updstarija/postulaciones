import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MypostsRoutingModule } from './myposts-routing.module';
import { MypostsComponent } from './myposts.component';


@NgModule({
  declarations: [MypostsComponent],
  imports: [
    CommonModule,
    MypostsRoutingModule
  ]
})
export class MypostsModule { }
