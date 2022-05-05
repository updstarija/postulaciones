import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemComponent } from './item/item.component';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from './loader/loader.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatatableComponent } from './datatable/datatable.component';
import { DataTablesModule } from 'angular-datatables';
import { PersonalInformationComponent } from './personal-information/personal-information.component';
import { ExperienceComponent } from './experience/experience.component';
import { EducationComponent } from './education/education.component';
import { GeneralInformationComponent } from './general-information/general-information.component';

@NgModule({
  declarations: [
    ItemComponent,
    LoaderComponent,
    LoginComponent,
    DatatableComponent,
    PersonalInformationComponent,
    ExperienceComponent,
    EducationComponent,
    GeneralInformationComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    DataTablesModule,
    ReactiveFormsModule,
  ],
  exports: [
    ItemComponent,
    LoaderComponent,
    LoginComponent,
    DatatableComponent,
    PersonalInformationComponent,
    ExperienceComponent,
    EducationComponent,
    GeneralInformationComponent,
  ],
})
export class ComponentsModule {}
