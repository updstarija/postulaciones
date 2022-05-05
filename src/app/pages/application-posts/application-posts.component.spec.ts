import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationPostsComponent } from './application-posts.component';

describe('ApplicationPostsComponent', () => {
  let component: ApplicationPostsComponent;
  let fixture: ComponentFixture<ApplicationPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationPostsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
