import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TracingPostComponent } from './tracing-post.component';

describe('TracingPostComponent', () => {
  let component: TracingPostComponent;
  let fixture: ComponentFixture<TracingPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TracingPostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TracingPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
