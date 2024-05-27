import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ITask } from 'src/app/private/model/task';
import { TaskEditorDialogComponent } from './task-editor-dialog/task-editor-dialog.component';
import { IDialogData, ITaskUI } from 'src/app/private/model/task-ui';

@Component({
  selector: 'app-todo-task',
  templateUrl: './todo-task.component.html',
  styleUrls: ['./todo-task.component.scss'],
})
export class TodoTaskComponent {
  @Input() pageTitle: string = '';
  @Input() tasks!: ITask[];
  @Input() currentPanel: string = '';
  @Output() newTask: EventEmitter<ITaskUI> = new EventEmitter<ITaskUI>();
  @Output() deleteTask: EventEmitter<string> = new EventEmitter<string>();
  @Output() updateTask: EventEmitter<ITask> = new EventEmitter<ITask>();

  constructor(public dialog: MatDialog) {}

  markAsDone(event: Event, task: ITask) {
    console.log(task.taskTitle);
    event.stopPropagation();
  }

  addTask(task: any) {}

  showTaskDetails(task: ITask) {
    this.openDialog('200ms', '200ms', '', task);
  }

  //TODO: refactor below code
  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string,
    currentPanel?: string,
    data?: ITask
  ): void {
    const dialogData = {
      panel: currentPanel ? currentPanel : '',
      data: data,
    };

    this.dialog
      .open(TaskEditorDialogComponent, {
        panelClass: 'add-task-dialog',
        data: dialogData,
        width: '800px',
        enterAnimationDuration,
        exitAnimationDuration,
      })
      .afterClosed()
      .subscribe((result: IDialogData) => {
        if (result.action === 'add') {
          this.newTask.emit(result.data as ITaskUI);
        } else if (result.action === 'delete') {
          this.deleteTask.emit(result.data as string);
        } else if (result.action === 'update') {
          this.updateTask.emit(result.data as ITask);
        }
      });
  }
}
