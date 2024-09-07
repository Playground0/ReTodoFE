import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
import { SearchDialogComponent } from './search-dialog/search-dialog.component';

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
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  public sendViewAction(panelLink: IPanelLink) {
    if (panelLink.link === DefaultPanels.Search) {
      this.openSearchDialog(panelLink)
      return;
    }
    this.router.navigateByUrl(`/todo/${panelLink.link}`);
    this.action.emit(panelLink.name);
  }

  private openSearchDialog(panelLink: IPanelLink){
    const dialogRef = this.dialog.open(SearchDialogComponent, {
      panelClass: 'add-task-dialog',
      data: {},
      width: '800px',
      enterAnimationDuration:'200ms',
      exitAnimationDuration: '200ms',
      disableClose: true,
    });

    dialogRef.backdropClick().subscribe(() => {
      dialogRef.close();
    })

    dialogRef.afterClosed().subscribe(() => {
      this.action.emit(panelLink.name);
    })
  }

  public deleteList(panelLink: IPanelLink) {
    const userId = this.getUserId();
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
    const userId = this.getUserId();
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
    const userId = this.getUserId();
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

  private getUserId(): string {
    const user: IUser = this.commonService.UserData as IUser;
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
        .undoListAction(listId, this.getUserId(), action)
        .pipe(tap(() => this.refreshUserLists.emit(true)))
        .subscribe()
    );
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
