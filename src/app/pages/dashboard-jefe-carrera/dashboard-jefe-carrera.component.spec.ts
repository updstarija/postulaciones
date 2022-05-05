import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardJefeCarreraComponent } from './dashboard-jefe-carrera.component';

describe('DashboardJefeCarreraComponent', () => {
  let component: DashboardJefeCarreraComponent;
  let fixture: ComponentFixture<DashboardJefeCarreraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardJefeCarreraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardJefeCarreraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
