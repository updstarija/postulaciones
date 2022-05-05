import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTalentoHumanoComponent } from './dashboard-talento-humano.component';

describe('DashboardTalentoHumanoComponent', () => {
  let component: DashboardTalentoHumanoComponent;
  let fixture: ComponentFixture<DashboardTalentoHumanoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardTalentoHumanoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardTalentoHumanoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
