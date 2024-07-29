import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoTaskListComponent } from './todo-task-list.component';

describe('TodoTaskListComponent', () => {
  let component: TodoTaskListComponent;
  let fixture: ComponentFixture<TodoTaskListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TodoTaskListComponent]
    });
    fixture = TestBed.createComponent(TodoTaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
