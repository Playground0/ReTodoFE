import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStatisticPageComponent } from './user-statistic-page.component';

describe('UserStatisticPageComponent', () => {
  let component: UserStatisticPageComponent;
  let fixture: ComponentFixture<UserStatisticPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserStatisticPageComponent]
    });
    fixture = TestBed.createComponent(UserStatisticPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
