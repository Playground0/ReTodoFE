import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { UserApiService } from 'src/app/private/services/user-api.service';

@Component({
  selector: 'app-stash',
  templateUrl: './stash.component.html',
  styleUrls: ['./stash.component.scss'],
})
export class StashComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'title',
    'creationDate',
    'updationDate',
    'type',
    'undo',
    'delete'
  ];
  dataSource = new MatTableDataSource();
  private subscription = new Subscription();
  stashOptions = [
    'Deleted tasks',
    'Archived tasks',
    'Completed tasks',
    'Deleted lists',
    'Archived lists',
    'Hidden lists',
  ];

  listCount = 0
  taskCount = 0
  prestineTable : unknown[] = []

  constructor(private userService: UserApiService) {}

  ngOnInit(): void {
    this.getStashedRecords();
  }

  getStashedRecords() {
    this.subscription.add(this.userService.getStash().subscribe({
      next: (res) => {  
        const tasks = res.tasks
        const lists = res.lists
        this.prestineTable = [...tasks,...lists]
        this.dataSource.data = this.prestineTable
        this.getTaskCounts(this.dataSource.data)
      }
    }));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  filterChooser(event: MatSelectChange){
    const filter = event.value;
    if(!filter) {
      this.dataSource.data = this.prestineTable
    }
    switch(filter){
      case 'Deleted tasks':{
        this.dataSource.data = this.prestineTable.filter((item:any) => item.isTask && item.isDeleted)
        break;
      }
      case 'Archived tasks':{
        this.dataSource.data = this.prestineTable.filter((item:any) => item.isTask && item.isArchived)
        break;
      }
      case 'Completed tasks':{
        this.dataSource.data = this.prestineTable.filter((item:any) => item.isTask && item.isCompleted)
        break;
      }
      case 'Deleted lists':{
        this.dataSource.data = this.prestineTable.filter((item:any) => !item.isTask && item.isDeleted)
        break;
      }
      case 'Archived lists':{
        this.dataSource.data = this.prestineTable.filter((item:any) => !item.isTask && item.isArchived)
        break;
      }
      case 'Hidden lists':{
        this.dataSource.data = this.prestineTable.filter((item:any) => !item.isTask && item.isHidden)
        break;
      }
    }
  }

  getTaskCounts(table: unknown[]){
    let tasks = table.filter((res:any) => res.isTask)
    let lists = table.filter((res:any) => !res.isTask)
    this.listCount = lists.length
    this.taskCount = tasks.length
  }

  restoreItem(item: unknown){
    console.log(item)
  }

  deleteItem(item: unknown){
    console.log(item)
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
