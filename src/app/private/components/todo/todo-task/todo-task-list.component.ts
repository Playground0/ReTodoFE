import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ITask } from 'src/app/private/model/task.model';
import { TaskEditorDialogComponent } from './task-editor-dialog/task-editor-dialog.component';
import { IDialogData } from 'src/app/private/model/UI/task-ui';
import {
  DefaultPanels,
  TaskActions,
} from 'src/app/private/model/UI/tasks.contanst';
import { PrivateCommonService } from 'src/app/private/services/private-common.service';

@Component({
  selector: 'app-todo-task-list',
  templateUrl: './todo-task-list.component.html',
  styleUrls: ['./todo-task-list.component.scss'],
})
export class TodoTaskListComponent {
  @Input() pageTitle: string = '';
  @Input() tasks!: ITask[];
  @Input() currentPanel!: DefaultPanels;
  @Output() taskActionCompleted: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  constructor(
    public dialog: MatDialog,
    private commonService: PrivateCommonService
  ) {}

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

    const dialog = this.dialog.open(TaskEditorDialogComponent, {
      panelClass: 'add-task-dialog',
      data: dialogData,
      width: '800px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true,
    });

    dialog.backdropClick().subscribe(() => {
      dialog.close();
    });

    dialog.afterClosed().subscribe((result: IDialogData) => {
      if (result.action) {
        this.doAction(result);
      }
    });
  }

  private doAction(dialogData: IDialogData) {
    const data: unknown = dialogData.data;
    switch (dialogData.action) {
      case TaskActions.Add:
        this.addTask(data as ITask);
        break;
      case TaskActions.Update:
        this.updateTask(data as ITask);
        break;
      default:
        console.error('Wrong Action');
    }
  }

  private addTask(data: ITask) {
    const isDefault = Object.values(DefaultPanels).includes(this.currentPanel);
    data.currentListId = isDefault ? '0' : this.currentPanel;
    this.commonService.addTask(data).subscribe({
      next: (res) => {
        if (res) {
          this.taskActionCompleted.emit(true);
        }
      },
      error: () => {
        this.taskActionCompleted.emit(false);
      },
    });
  }

  private updateTask(data: ITask) {
    this.commonService.updateTask(data).subscribe({
      next: (res) => {
        if (res) {
          this.taskActionCompleted.emit(true);
        }
      },
      error: () => {
        this.taskActionCompleted.emit(false);
      },
    });
  }

  public deleteTask(task: ITask) {
    this.commonService.deleteTask(task._id as string).subscribe({
      next: (res) => {
        if (res) {
          this.taskActionCompleted.emit(true);
        }
      },
      error: () => {
        this.taskActionCompleted.emit(false);
      },
    });
  }

  markAsDone(task: ITask) {
    this.commonService.completeTask(task._id).subscribe({
      next: (res) => {
        if (res) {
          this.taskActionCompleted.emit(true);
        }
      },
      error: () => {
        this.taskActionCompleted.emit(false);
      },
    });
  }
}
