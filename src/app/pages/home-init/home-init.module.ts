import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeInitRoutingModule } from './home-init-routing.module';
import { HomeInitComponent } from './home-init.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [HomeInitComponent],
  imports: [CommonModule, HomeInitRoutingModule, ComponentsModule],
})
export class HomeInitModule {}
