import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDocenteComponent } from './dashboard-docente.component';

describe('DashboardDocenteComponent', () => {
  let component: DashboardDocenteComponent;
  let fixture: ComponentFixture<DashboardDocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardDocenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardDocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
