import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription, tap } from 'rxjs';
import { IUser } from 'src/app/core/model/auth-page.model';
import { IPanelLink } from 'src/app/private/model/UI/panel-info';
import {
  DefaultPanels,
  ListActions,
  SnackBarListAction,
} from 'src/app/private/model/UI/tasks.contanst';
import { ListApiService } from 'src/app/private/services/list-api.service';
import { PrivateCommonService } from 'src/app/private/services/private-common.service';

@Component({
  selector: 'app-todo-panel',
  templateUrl: './todo-panel.component.html',
  styleUrls: ['./todo-panel.component.scss'],
})
export class TodoPanelComponent implements OnDestroy {
  @Input() panelItems!: IPanelLink[];
  @Output() action: EventEmitter<string> = new EventEmitter<string>();
  @Output() refreshUserLists: EventEmitter<any> = new EventEmitter<any>();
  private subscription = new Subscription();
  private snackBarDurationInSeconds = 5;

  constructor(
    private router: Router,
    private listService: ListApiService,
    private commonService: PrivateCommonService,
    private _snackBar: MatSnackBar
  ) {}

  public sendViewAction(panelLink: IPanelLink) {
    this.router.navigateByUrl(`/todo/${panelLink.link}`);
    this.action.emit(panelLink.name);
  }

  public deleteList(panelLink: IPanelLink) {
    const userId = this.getUserData();
    this.subscription.add(
      this.listService
        .deleteList(panelLink.link, userId)
        .pipe(tap(() => this.refreshData()))
        .subscribe({
          next: (res) => {
            this.openUndoSnackBar(
              panelLink.link,
              ListActions.Delete,
              SnackBarListAction.ListDeleted
            );
          },
        })
    );
  }

  public hidelist(panelLink: IPanelLink) {
    const userId = this.getUserData();
    this.subscription.add(
      this.listService
        .hideList(panelLink.link, userId)
        .pipe(tap(() => this.refreshData()))
        .subscribe({
          next: (res) => {
            this.openUndoSnackBar(
              panelLink.link,
              ListActions.Hide,
              SnackBarListAction.ListHidden
            );
          },
        })
    );
  }

  public archivelist(panelLink: IPanelLink) {
    const userId = this.getUserData();
    this.subscription.add(
      this.listService
        .archiveList(panelLink.link, userId)
        .pipe(tap(() => this.refreshData()))
        .subscribe({
          next: (res) => {
            this.openUndoSnackBar(
              panelLink.link,
              ListActions.Archive,
              SnackBarListAction.ListArchived
            );
          },
        })
    );
  }

  private refreshData = () => {
    const panel: IPanelLink = {
      link: DefaultPanels.Inbox,
      name: 'Inbox',
      tooltip: 'Show Inbox',
      isDefaultList: true,
    };
    this.sendViewAction(panel);
    this.refreshUserLists.emit(true);
  };

  private getUserData(): string {
    const user: IUser = this.commonService.getUserData() as IUser;
    return user.id;
  }

  private openUndoSnackBar(
    listId: string,
    action: ListActions,
    message: string
  ) {
    const config: MatSnackBarConfig = {
      duration: this.snackBarDurationInSeconds * 1000,
    };
    this._snackBar.open(message, ListActions.Undo, config);
    const snackBar = this._snackBar._openedSnackBarRef;
    this.subscription.add(
      snackBar?.afterDismissed().subscribe({
        next: (res) => {
          if (res.dismissedByAction) {
            this.undoList(listId, action);
          }
        },
      })
    );
  }

  private undoList(listId: string, action: string) {
    this.subscription.add(
      this.listService
        .undoListAction(listId, this.getUserData(), action)
        .pipe(tap(() => this.refreshUserLists.emit(true)))
        .subscribe()
    );
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
