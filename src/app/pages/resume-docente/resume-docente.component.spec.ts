import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeDocenteComponent } from './resume-docente.component';

describe('ResumeDocenteComponent', () => {
  let component: ResumeDocenteComponent;
  let fixture: ComponentFixture<ResumeDocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResumeDocenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeDocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
