import { Component, OnDestroy, OnInit } from '@angular/core';
import { IPanel, IPanelLink } from '../../model/panel-info';
import { PrivateCommonService } from '../../services/private-common.service';
import { IUser } from 'src/app/core/model/auth-page.model';
import { ITask, ITaskCreate, ITaskUpdate } from '../../model/task';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import * as dayjs from 'dayjs';
import { LocalDataService } from 'src/app/core/services/localdata.service';
import { ITaskUI } from '../../model/task-ui';
import { MatDialog } from '@angular/material/dialog';
import { TaskAPIService } from '../../services/task-api.service';

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
  public currentPanel = '';

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

  public panelDefault: IPanel = {
    panelLinks: this.panelDefaultItems,
    tilte: '',
  };

  public userLists: IPanel = {
    panelLinks: [],
    tilte: 'My Projects',
  };

  constructor(
    private commonService: PrivateCommonService,
    private taskApiService: TaskAPIService,
    private route: ActivatedRoute,
    private localData: LocalDataService,
    public dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.userId = this.getUserData();
    this.subscription.add(
      this.route.params.subscribe((route) => {
        this.tasks = [];
        this.currentPanel = route['panelLink'];
        if (!this.listTitle) this.setListTitle(this.currentPanel);
        if (this.currentPanel !== 'search') {
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
          this.tasks = res;
        },
      })
    );
  }

  private setListTitle(link: string) {
    const item = this.panelDefaultItems.find((item) => item.link === link);
    if (item) {
      this.listTitle = item.name;
    }
  }

  //TODO: update it for list id
  public addTask(task: ITaskUI) {
    const user: IUser = this.localData.localUserData as IUser;
    let newTask: ITaskCreate = {
      userId: user.id,
      currentListId: '0',
      previousListID: '0',
      taskTitle: task.taskTitle,
      taskDesc: task.taskDesc,
      taskEndDate: task.taskEndDate
        ? dayjs(task.taskEndDate).toISOString()
        : '',
      occurance: task.occurance,
      priority: task.priority,
      reminder: task.reminder ? true : false,
      isRecurring: task.isRecurring ? true : false,
    };
    this.subscription.add(
      this.taskApiService.creteTask(newTask).subscribe({
        next: (res: ITask) => {
          this.refreshCurrentList();
        },
      })
    );
  }

  public updateTask(data: ITask) {
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
    this.taskApiService.updateTask(updateTask).subscribe({
      next: (res: ITask) => {
        console.log(res);
        this.refreshCurrentList();
      },
    });

    console.log(data);
  }

  public deleteTask(taskId: string) {
    this.taskApiService.deleteTask(this.userId, taskId).subscribe({
      next: (res: boolean | null) => {
        if (res) {
          this.refreshCurrentList();
        }
      },
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private refreshCurrentList = () =>
    this.getTasks(this.userId, this.currentPanel);
}
