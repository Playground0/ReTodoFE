import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskEditorDialogComponent } from './task-editor-dialog.component';

describe('AddTaskDialogComponent', () => {
  let component: TaskEditorDialogComponent;
  let fixture: ComponentFixture<TaskEditorDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskEditorDialogComponent]
    });
    fixture = TestBed.createComponent(TaskEditorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
