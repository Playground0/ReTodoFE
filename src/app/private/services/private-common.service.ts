import { Injectable } from '@angular/core';
import { IUser } from 'src/app/core/model/auth-page.model';
import { LocalDataService } from 'src/app/core/services/localdata.service';
import { ITask, ITaskCreate, ITaskUpdate } from '../model/task.model';
import { TaskAPIService } from './task-api.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { SnackBarAction, TaskActions } from '../model/UI/tasks.contanst';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class PrivateCommonService {
  private snackBarDurationInSeconds = 5;
  private undoAction$ = new BehaviorSubject(false);
  undoAction = this.undoAction$.asObservable();
  constructor(
    private localDataService: LocalDataService,
    private taskApiService: TaskAPIService,
    private _snackBar: MatSnackBar
  ) {}



  private get snackBarConfig(): MatSnackBarConfig {
    return {
      duration: this.snackBarDurationInSeconds * 1000,
    };
  }

  public addTask(
    task: ITask,
  ): Observable<ITask> {
    let newTask: ITaskCreate = {
      currentListId: task.currentListId ? task.currentListId : '0',
      previousListID: '0',
      taskTitle: task.taskTitle,
      taskDesc: task.taskDesc,
      taskStartDate: task.taskStartDate,
      taskEndDate: task.taskEndDate,
      occurance: task.occurance,
      priority: task.priority,
      reminder: task.reminder ? true : false,
      isRecurring: task.isRecurring ? true : false,
    };
    return this.taskApiService.createTask(newTask).pipe(
      tap(() => {
        this._snackBar.open('Task Created !', '', this.snackBarConfig);
      })
    );
  }

  public updateTask(data: ITask) {
    let updateTask: ITaskUpdate = {
      taskId: data._id,
      currentListId: data.currentListId,
      previousListID: data.previousListID,
      taskTitle: data.taskTitle,
      taskStartDate: data.taskStartDate,
      taskEndDate: data.taskEndDate,
      taskDesc: data.taskDesc,
      occurance: data.occurance,
      priority: data.priority,
      reminder: data.reminder,
      isRecurring: data.isRecurring,
    };
    return this.taskApiService.updateTask(updateTask).pipe(
      tap(() => {
        this._snackBar.open('Task Updated !', '', this.snackBarConfig);
      })
    );
  }

  public deleteTask(taskId: string) {
    return this.taskApiService
      .deleteTask(taskId)
      .pipe(
        tap(() =>
          this.openUndoSnackBar(
            taskId,
            TaskActions.Delete,
            SnackBarAction.TaskDeleted
          )
        )
      );
  }

  public completeTask(taskId: string) {
    return this.taskApiService
      .markAsCompleteTask(taskId)
      .pipe(
        tap(() =>
          this.openUndoSnackBar(
            taskId,
            TaskActions.Complete,
            SnackBarAction.TaskCompleted
          )
        )
      );
  }

  private openUndoSnackBar(
    taskId: string,
    action: TaskActions,
    message: string
  ) {
    this._snackBar.open(message, TaskActions.Undo, this.snackBarConfig);
    const snackBar = this._snackBar._openedSnackBarRef;
    snackBar?.afterDismissed().subscribe({
      next: (res) => {
        if (res.dismissedByAction) {
          this.undoTask(taskId, action);
        }
      },
    });
  }

  private undoTask(taskId: string, taskAction: TaskActions) {
    return this.taskApiService
      .undoTaskAction(taskId, taskAction)
      .subscribe({
        next: (res) => {
          this.setUndoAction(true);
        },
      });
  }

  public setUndoAction(value: boolean) {
    this.undoAction$.next(value);
  }
}
