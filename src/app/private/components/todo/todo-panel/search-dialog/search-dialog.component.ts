import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { debounceTime } from 'rxjs';
import { ITask } from 'src/app/private/model/task.model';
import { PrivateCommonService } from 'src/app/private/services/private-common.service';
import { TaskAPIService } from 'src/app/private/services/task-api.service';

@Component({
  selector: 'app-search-dialog',
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.scss'],
})
export class SearchDialogComponent implements OnInit, AfterViewInit {
  @ViewChild('searchInput') searchInput!: ElementRef;
  searchForm!: FormGroup;
  panel = 'Search Results';
  filteredTasks: ITask[] = [];
  currrentQuery = '';

  constructor(
    public dialogRef: MatDialogRef<SearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private fb: FormBuilder,
    private taskService: TaskAPIService,
    private commonService: PrivateCommonService
  ) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.searchInput.nativeElement.focus();
    });
  }

  ngOnInit(): void {
    this.searchTasks('');
    this.initializeForm();
    this.trackUndoActions();
  }

  initializeForm() {
    this.searchForm = this.fb.group({
      search: '',
    });
    this.trackSearchQueryChanges();
  }

  private trackSearchQueryChanges() {
    this.searchForm
      .get('search')
      ?.valueChanges.pipe(debounceTime(300))
      .subscribe((searchQuery) => {
        this.searchTasks(searchQuery);
      });
  }

  private trackUndoActions() {
    this.commonService.undoAction.subscribe({
      next: (res: boolean) => {
        if (res) {
          this.searchTasks(this.currrentQuery);
          this.commonService.setUndoAction(false);
        }
      },
    });
  }

  private searchTasks(searchQuery: string) {
    this.currrentQuery = searchQuery;
    this.taskService.searchTasks(searchQuery).subscribe({
      next: (res: ITask[]) => {
        this.filteredTasks = res;
      },
    });
  }

  public doAction(status: boolean) {
    if (status) {
      this.searchTasks(this.currrentQuery);
      return;
    }
  }
}
