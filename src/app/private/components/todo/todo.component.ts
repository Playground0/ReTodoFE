import { Component, OnDestroy, OnInit } from '@angular/core';
import { IPanelLink } from '../../model/UI/panel-info';
import { PrivateCommonService } from '../../services/private-common.service';
import { IUser } from 'src/app/core/model/auth-page.model';
import { ITask } from '../../model/task.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TaskAPIService } from '../../services/task-api.service';
import { DefaultPanels } from '../../model/UI/tasks.contanst';
import { ListApiService } from '../../services/list-api.service';
import { IList, IListCreate } from '../../model/list.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { LoaderService } from 'src/app/shared/service/loader.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
})
export class TodoComponent implements OnInit, OnDestroy {
  //TODO: Add this to app configuation endpoint
  private panelDefaultItems: IPanelLink[] = [
    {
      name: 'Search Tasks',
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
  ];

  public tasks: ITask[] = [];
  public runFuntion!: Function;
  public listTitle: string = '';
  private subscription = new Subscription();
  public currentPanel!: DefaultPanels;
  public showListForm = false;
  private isDefaultList = false;
  public panelDefault: IPanelLink[] = this.panelDefaultItems;
  public userLists: IPanelLink[] = [];
  public listForm: FormGroup;
  isCreatingList = false;
  snackBarConfig: MatSnackBarConfig = {
    duration: 2000
  }

  constructor(
    private commonService: PrivateCommonService,
    private taskApiService: TaskAPIService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private listService: ListApiService,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private loaderService: LoaderService,
  ) {
    this.listForm = this.fb.group({
      listTitle: ['', Validators.required],
    });
  }

  public ngOnInit(): void {
    this.refreshUserLists();
    this.checkRouteAndSetupPage();
    this.trackUndoAction();
  }

  private checkRouteAndSetupPage() {
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

  private trackUndoAction() {
    this.loaderService.setLoader(true)
    this.subscription.add(
      this.commonService.undoAction.subscribe({
        next: (res: boolean) => {
          this.loaderService.setLoader(false)
          if (res) {
            this.checkForDefaultAndRefresh();
            this.commonService.setUndoAction(false);
          }
        },
        error: (err) =>{
          this.loaderService.setLoader(false)
        }
      })
    );
  }

  public panelAction(title: string) {
    if (title === 'Search Tasks') {
      this.checkForDefaultAndRefresh();
      return;
    }
    this.listTitle = title;
  }

  private getTasks(link: string) {
    this.loaderService.setLoader(true)
    this.subscription.add(
      this.taskApiService.getTasks(link).subscribe({
        next: (res: ITask[]) => {
          this.loaderService.setLoader(false)
          this.tasks = res.sort(this.compareTasks);
        },
        error: (err) => {
          this.loaderService.setLoader(false)
        }
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

  public onActionCompletion(status: boolean) {
    if (status) {
      this.checkForDefaultAndRefresh();
    }
  }

  private refreshCurrentList = () => {
    this.getTasks(this.currentPanel);
  };

  private refreshUserLists = () => this.getLists();

  private refreshUserListTask = () => this.getTasksForList(this.currentPanel);

  public hardRefreshPanel = () => {
    this.refreshUserLists();
    this.refreshCurrentList();
  };

  private checkForDefaultAndRefresh() {
    if (this.isDefaultList) {
      this.refreshCurrentList();
    } else {
      this.refreshUserListTask();
    }
  }

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

  private getLists() {
    this.loaderService.setLoader(true)
    this.subscription.add(
      this.listService.getAll().subscribe({
        next: (res: IList[]) => {
          this.loaderService.setLoader(false)
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
        error: (err) =>{
          this.loaderService.setLoader(false)
        }
      })
    );
  }

  public toggleListForm() {
    this.showListForm = !this.showListForm;
    if (!this.showListForm) this.listForm.reset();
  }

  public addNewLIst() {
    if(this.listForm.invalid){
      this.listForm.markAllAsTouched()
      return
    }
    const newList: IListCreate = this.listForm.value;
    this.loaderService.setLoader(true)
    this.subscription.add(
      this.listService
        .createList(newList)
        .pipe(
          tap(() => {
            this.refreshUserLists();
            this.toggleListForm();
          })
        )
        .subscribe({
          next: (res: IList) => {
            this.loaderService.setLoader(false)
            this.snackBar.open(`${res.listTitle} is created!!`, '', this.snackBarConfig)
          },
          error: (err) => {
            this.loaderService.setLoader(false)
            const error = err.error;
            this.snackBar.open(error.Message, '', this.snackBarConfig)
          }
        })
    );
  }

  public getTasksForList(listId: string) {
    this.loaderService.setLoader(true)
    this.subscription.add(
      this.taskApiService.getCustomListTask(listId).subscribe({
        next: (res) => {
          this.loaderService.setLoader(false)
          this.tasks = res.sort(this.compareTasks);
        },
        error: (err) => {
          this.loaderService.setLoader(false)
          this.router.navigateByUrl('**');
        },
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
