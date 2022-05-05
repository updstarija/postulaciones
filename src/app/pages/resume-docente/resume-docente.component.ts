import { Component, OnInit, ViewChild } from '@angular/core';
import { PersonalInformationComponent } from 'src/app/components/personal-information/personal-information.component';

@Component({
  selector: 'app-resume-docente',
  templateUrl: './resume-docente.component.html',
  styleUrls: ['./resume-docente.component.scss'],
})
export class ResumeDocenteComponent implements OnInit {
  tab: number;

  constructor() {}

  ngOnInit(): void {
    this.tab = 1;
  }
  changeTab(tab) {
    this.tab = tab;
  }
  changeTabGlobal(event) {
    this.tab = event.tab;
  }
}
