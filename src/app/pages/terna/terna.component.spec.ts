import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TernaComponent } from './terna.component';

describe('TernaComponent', () => {
  let component: TernaComponent;
  let fixture: ComponentFixture<TernaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TernaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TernaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
