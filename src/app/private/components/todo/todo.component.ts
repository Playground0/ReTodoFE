import { Component, OnDestroy, OnInit } from '@angular/core';
import { IPanelLink } from '../../model/UI/panel-info';
import { PrivateCommonService } from '../../services/private-common.service';
import { IUser } from 'src/app/core/model/auth-page.model';
import { ITask, ITaskCreate, ITaskUpdate } from '../../model/task.model';
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
import { ListApiService } from '../../services/list-api.service';
import { IList, IListCreate } from '../../model/list.model';
import { FormBuilder, FormGroup } from '@angular/forms';

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
  public showListForm = false;
  private isDefaultList = false;

  //TODO: Add this to app configuation endpoint
  private panelDefaultItems: IPanelLink[] = [
    {
      name: 'Search',
      link: 'search',
      tooltip: 'Search task',
      isDefaultList: true,
    },
    {
      name: 'Inbox',
      link: 'inbox',
      tooltip: 'Show Inbox',
      isDefaultList: true,
    },
    {
      name: `Today's Task`,
      link: 'today',
      tooltip: `Show today tasks`,
      isDefaultList: true,
    },
    {
      name: 'Upcoming Task',
      link: 'upcoming',
      tooltip: 'Show Upcoming Task',
      isDefaultList: true,
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
  public listForm: FormGroup;
  isCreatingList = false;

  constructor(
    private commonService: PrivateCommonService,
    private taskApiService: TaskAPIService,
    private route: ActivatedRoute,
    private localData: LocalDataService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private dateService: DateService,
    private listService: ListApiService,
    private fb: FormBuilder
  ) {
    this.listForm = this.fb.group({
      listTitle: [''],
    });
  }

  public ngOnInit(): void {
    this.userId = this.getUserData();
    this.refreshUserLists();
    this.subscription.add(
      this.route.params.subscribe((route) => {
        this.tasks = [];
        this.currentPanel = route['panelLink'];
        this.isDefaultList = [
          DefaultPanels.Inbox,
          DefaultPanels.Search,
          DefaultPanels.Today,
          DefaultPanels.Upcoming,
        ].includes(this.currentPanel);
        if (!this.listTitle) this.setupListTitle(this.currentPanel);
        if (!this.isDefaultList) {
          this.refreshUserListTask();
        } else if (this.currentPanel !== DefaultPanels.Search) {
          this.refreshCurrentList();
        }
      })
    );
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
    let item: any = {};
    if (this.isDefaultList) {
      item = this.panelDefaultItems.find((item) => item.link === link);
    } else {
      item = this.userLists.find((item) => item.link === link);
    }
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
    const isDefaultPanel = this.isDefaultList;
    let newTask: ITaskCreate = {
      userId: user.id,
      currentListId: !isDefaultPanel ? this.currentPanel : '0',
      previousListID: '0',
      taskTitle: task.taskTitle,
      taskDesc: task.taskDesc,
      taskStartDate:task.taskStartDate,
      taskEndDate: task.taskEndDate,
      occurance: task.occurance,
      priority: task.priority,
      reminder: task.reminder ? true : false,
      isRecurring: task.isRecurring ? true : false,
    };
    this.subscription.add(
      this.taskApiService
        .createTask(newTask)
        .pipe(
          tap(() => {
            if (this.isDefaultList) {
              this.refreshCurrentList();
            } else {
              this.refreshUserListTask();
            }
          })
        )
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
      taskStartDate: data.taskStartDate,
      taskEndDate: data.taskEndDate,
      taskDesc: data.taskDesc,
      occurance: data.occurance,
      priority: data.priority,
      reminder: data.reminder,
      isRecurring: data.isRecurring,
    };
    this.subscription.add(
      this.taskApiService
        .updateTask(updateTask)
        .pipe(
          tap(() => {
            if (this.isDefaultList) {
              this.refreshCurrentList();
            } else {
              this.refreshUserListTask();
            }
          })
        )
        .subscribe()
    );
  }

  private deleteTask(taskId: string) {
    this.taskApiService.deleteTask(this.userId, taskId).subscribe({
      next: (res: boolean | null) => {
        if (res) {
          if (this.isDefaultList) {
            this.refreshCurrentList();
          } else {
            this.refreshUserListTask();
          }

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
          if (this.isDefaultList) {
            this.refreshCurrentList();
          } else {
            this.refreshUserListTask();
          }
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
        .pipe(
          tap(() => {
            if (this.isDefaultList) {
              this.refreshCurrentList();
            } else {
              this.refreshUserListTask();
            }
          })
        )
        .subscribe()
    );
  }

  private refreshCurrentList = () => {
    this.getTasks(this.userId, this.currentPanel);
  };

  private refreshUserLists = () => this.getLists(this.userId);

  private refreshUserListTask = () => this.getTasksForList(this.currentPanel);

  public hardRefreshPanel = () => {
    this.refreshUserLists();
    this.refreshCurrentList();
  };

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

  private getLists(userId: string) {
    this.subscription.add(
      this.listService.getAll(userId).subscribe({
        next: (res: IList[]) => {
          this.userLists = res.map((list) => {
            return {
              name: list.listTitle,
              link: list._id,
              tooltip: list.listTitle,
              isDefaultList: false,
            };
          });
          this.setupListTitle(this.currentPanel);
        },
      })
    );
  }

  public toggleListForm() {
    this.showListForm = !this.showListForm;
    if (!this.showListForm) this.listForm.reset();
  }

  public addNewLIst() {
    const newList: IListCreate = this.listForm.value;
    newList.userId = this.userId;
    this.subscription.add(
      this.listService
        .createList(newList)
        .pipe(
          tap(() => {
            this.refreshUserLists();
            this.toggleListForm();
          })
        )
        .subscribe()
    );
  }

  public getTasksForList(listId: string) {
    this.subscription.add(
      this.taskApiService.getCustomListTask(this.userId, listId).subscribe({
        next: (res) => {
          this.tasks = res.sort(this.compareTasks);
        },
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
