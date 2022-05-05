import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TernaRoutingModule } from './terna-routing.module';
import { TernaComponent } from './terna.component';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [TernaComponent],
  imports: [CommonModule, TernaRoutingModule, FormsModule, ComponentsModule],
})
export class TernaModule {}
