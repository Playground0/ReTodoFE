import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoPanelComponent } from './todo-panel.component';

describe('TodoPanelComponent', () => {
  let component: TodoPanelComponent;
  let fixture: ComponentFixture<TodoPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TodoPanelComponent]
    });
    fixture = TestBed.createComponent(TodoPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
