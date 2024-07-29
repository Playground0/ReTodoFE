import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ITask } from 'src/app/private/model/task';
import { TaskEditorDialogComponent } from './task-editor-dialog/task-editor-dialog.component';
import { IDialogData } from 'src/app/private/model/UI/task-ui';
import {
  DefaultPanels,
  TaskActions,
} from 'src/app/private/model/UI/tasks.contanst';

@Component({
  selector: 'app-todo-task-list',
  templateUrl: './todo-task-list.component.html',
  styleUrls: ['./todo-task-list.component.scss'],
})
export class TodoTaskListComponent {
  @Input() pageTitle: string = '';
  @Input() tasks!: ITask[];
  @Input() currentPanel!: DefaultPanels;
  @Output() taskAction: EventEmitter<IDialogData> =
    new EventEmitter<IDialogData>();

  constructor(public dialog: MatDialog) {}

  markAsDone(task: ITask) {
    this.emitObject(TaskActions.Complete, task)
  }

  public deleteTask(task: ITask) {
    this.emitObject(TaskActions.Delete, task)
  }

  showTaskDetails(task: ITask) {
    this.openDialog('200ms', '200ms', task);
  }

  //TODO: refactor below code
  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string,
    data?: ITask
  ): void {
    const dialogData: IDialogData = {
      panel: this.currentPanel ? this.currentPanel : '',
      data: data ?? data,
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
        if (result.action) {
          this.taskAction.emit(result);
        }
      });
  }

  private emitObject(taskAction: TaskActions, task :ITask){
    const data: IDialogData = {
      action: taskAction,
      panel: this.currentPanel ? this.currentPanel : '',
      data: task ?? task,
    };
    this.taskAction.emit(data)
  }
}
