import { Component, OnDestroy, OnInit } from '@angular/core';
import { IPanelLink } from '../../model/UI/panel-info';
import { PrivateCommonService } from '../../services/private-common.service';
import { IUser } from 'src/app/core/model/auth-page.model';
import { ITask, ITaskCreate, ITaskUpdate } from '../../model/task';
import { ActivatedRoute } from '@angular/router';
import { Subscription, tap } from 'rxjs';
import { LocalDataService } from 'src/app/core/services/localdata.service';
import { IDialogData } from '../../model/UI/task-ui';
import { MatDialog } from '@angular/material/dialog';
import { TaskAPIService } from '../../services/task-api.service';
import {
  DefaultPanels,
  SnackBarAction,
  TaskActions,
} from '../../model/UI/tasks.contanst';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { DateService } from 'src/app/shared/service/date.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
})
export class TodoComponent implements OnInit, OnDestroy {
  private userId = '';
  public tasks: ITask[] = [];
  public runFuntion!: Function;
  public listTitle: string = '';
  private subscription = new Subscription();
  public currentPanel!: DefaultPanels;

  //TODO: Add this to app configuation endpoint
  private panelDefaultItems: IPanelLink[] = [
    {
      name: 'Search',
      link: 'search',
      tooltip: 'Search task',
    },
    {
      name: 'Inbox',
      link: 'inbox',
      tooltip: 'Show Inbox',
    },
    {
      name: `Today's Task`,
      link: 'today',
      tooltip: `Show today tasks`,
    },
    {
      name: 'Upcoming Task',
      link: 'upcoming',
      tooltip: 'Show Upcoming Task',
    },
    // {
    //   name: `Completed Task`,
    //   link: 'completed',
    //   tooltip: `Show completed tasks`,
    // },
    // {
    //   name: `Deleted Task`,
    //   link: 'deleted',
    //   tooltip: `Show deleted tasks`,
    // },
    // {
    //   name: `Archived Task`,
    //   link: 'archives',
    //   tooltip: `Show archived tasks`,
    // },
  ];

  public panelDefault: IPanelLink[] = this.panelDefaultItems;

  public userLists: IPanelLink[] = [];

  private snackBarDurationInSeconds = 5;

  constructor(
    private commonService: PrivateCommonService,
    private taskApiService: TaskAPIService,
    private route: ActivatedRoute,
    private localData: LocalDataService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private dateService: DateService
  ) {}

  public ngOnInit(): void {
    this.userId = this.getUserData();
    this.subscription.add(
      this.route.params.subscribe((route) => {
        this.tasks = [];
        this.currentPanel = route['panelLink'];
        if (!this.listTitle) this.setupListTitle(this.currentPanel);
        if (this.currentPanel !== DefaultPanels.Search) {
          this.refreshCurrentList();
        }
      })
    );
    console.log('Server time zone:', new Date().getTimezoneOffset());
  }

  public panelAction(title: string) {
    this.listTitle = title;
  }
  private getUserData(): string {
    const user: IUser = this.commonService.getUserData() as IUser;
    return user.id;
  }

  private getTasks(userId: string, link: string) {
    this.subscription.add(
      this.taskApiService.getTasks(userId, link).subscribe({
        next: (res: ITask[]) => {
          this.tasks = res.sort(this.compareTasks);
        },
      })
    );
  }

  private setupListTitle(link: string) {
    const item = this.panelDefaultItems.find((item) => item.link === link);
    if (item) {
      this.listTitle = item.name;
    }
  }

  public doTaskAction(dialogData: IDialogData) {
    const data: unknown = dialogData.data;
    switch (dialogData.action) {
      case TaskActions.Add:
        this.addTask(data as ITask);
        break;
      case TaskActions.Update:
        this.updateTask(data as ITask);
        break;
      case TaskActions.Delete:
        this.deleteTask(data as string);
        break;
      case TaskActions.Complete:
        this.completeTask(data as ITask);
        break;
      default:
        console.error('Wrong Action');
    }
  }

  //TODO: update it for list id
  private addTask(task: ITask) {
    const user: IUser = this.localData.localUserData as IUser;
    let newTask: ITaskCreate = {
      userId: user.id,
      currentListId: '0',
      previousListID: '0',
      taskTitle: task.taskTitle,
      taskDesc: task.taskDesc,
      taskStartDate: this.setupStartOfTheDay(task.taskStartDate),
      taskEndDate: this.setupStartOfTheDay(task.taskEndDate),
      occurance: task.occurance,
      priority: task.priority,
      reminder: task.reminder ? true : false,
      isRecurring: task.isRecurring ? true : false,
    };
    this.subscription.add(
      this.taskApiService
        .creteTask(newTask)
        .pipe(tap(() => this.refreshCurrentList()))
        .subscribe()
    );
  }

  private updateTask(data: ITask) {
    let updateTask: ITaskUpdate = {
      taskId: data._id,
      currentListId: data.currentListId,
      previousListID: data.previousListID,
      userId: data.userId,
      taskTitle: data.taskTitle,
      taskStartDate: this.setupStartOfTheDay(data.taskStartDate),
      taskEndDate: this.setupStartOfTheDay(data.taskEndDate),
      taskDesc: data.taskDesc,
      occurance: data.occurance,
      priority: data.priority,
      reminder: data.reminder,
      isRecurring: data.isRecurring,
    };
    this.subscription.add(
      this.taskApiService
        .updateTask(updateTask)
        .pipe(tap(() => this.refreshCurrentList()))
        .subscribe()
    );
  }

  private deleteTask(taskId: string) {
    this.taskApiService.deleteTask(this.userId, taskId).subscribe({
      next: (res: boolean | null) => {
        if (res) {
          this.refreshCurrentList();
          this.openUndoSnackBar(
            taskId,
            TaskActions.Delete,
            SnackBarAction.TaskDeleted
          );
        }
      },
    });
  }

  private completeTask(data: ITask) {
    this.subscription.add(
      this.taskApiService.markAsCompleteTask(data._id, this.userId).subscribe({
        next: (res) => {
          this.refreshCurrentList();
          this.openUndoSnackBar(
            data._id,
            TaskActions.Complete,
            SnackBarAction.TaskCompleted
          );
        },
      })
    );
  }

  private openUndoSnackBar(
    taskId: string,
    action: TaskActions,
    message: string
  ) {
    const config: MatSnackBarConfig = {
      duration: this.snackBarDurationInSeconds * 1000,
    };
    this._snackBar.open(message, TaskActions.Undo, config);
    const snackBar = this._snackBar._openedSnackBarRef;
    this.subscription.add(
      snackBar?.afterDismissed().subscribe({
        next: (res) => {
          if (res.dismissedByAction) {
            this.undoTask(taskId, action);
          }
        },
      })
    );
  }

  private undoTask(taskId: string, taskAction: TaskActions) {
    this.subscription.add(
      this.taskApiService
        .undoTaskAction(taskId, this.userId, taskAction)
        .pipe(tap(() => this.refreshCurrentList()))
        .subscribe()
    );
  }

  private refreshCurrentList = () =>
    this.getTasks(this.userId, this.currentPanel);

  private compareTasks(a: ITask, b: ITask): number {
    const dateA = new Date(a.taskEndDate).getTime();
    const dateB = new Date(b.taskEndDate).getTime();

    // Compare dates
    if (dateA !== dateB) {
      return dateA - dateB; // Ascending order for dates
    }

    // If dates are the same, compare by priority in descending order
    return b.priority - a.priority; // Descending order for priority
  }

  private setupStartOfTheDay(date: string) {
    return date ? this.dateService.getStartOfDay(date) : '';
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
