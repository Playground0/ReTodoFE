import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { ITask, ITaskCreate, ITaskUpdate } from '../model/task.model';
import {
  APIStatusMessage,
  IAPIResponse,
} from 'src/app/shared/model/basic-api.model';
import { LocalDataService } from 'src/app/core/services/localdata.service';
import { IUser } from 'src/app/core/model/auth-page.model';

@Injectable({
  providedIn: 'root',
})
//TODO: Refactor this code for error handling
export class TaskAPIService {
  private taskApiUrl = '';
  constructor(
    private authSerive: AuthService,
    private http: HttpClient,
    private localDataService: LocalDataService
  ) {
    this.taskApiUrl = this.authSerive.getApiUrl() + '/task';
  }

  public getTasks(endpoint: string, listid: string = ''): Observable<ITask[]> {
    let url = `${this.taskApiUrl}/${endpoint}`;
    url = listid ? `${url}/${listid}` : url;
    return this.http.get<IAPIResponse>(url).pipe(
      map((res: IAPIResponse) => {
        return this.setupData(res);
      })
    );
  }

  public createTask(newTask: ITaskCreate): Observable<ITask> {
    return this.http.post<IAPIResponse>(this.taskApiUrl, newTask).pipe(
      map((res) => {
        return this.setupData(res);
      })
    );
  }

  public getTaskDetails(taskId: string): Observable<ITask> {
    return this.http
      .get<IAPIResponse>(`${this.authSerive.getApiUrl()}/task-details/${taskId}`)
      .pipe(
        map((res) => {
          return this.setupData(res);
        })
      );
  }

  public updateTask(task: ITaskUpdate): Observable<ITask> {
    return this.http.patch<IAPIResponse>(this.taskApiUrl, task).pipe(
      map((res) => {
        return this.setupData(res);
      })
    );
  }

  public deleteTask(taskId: string): Observable<boolean> {
    return this.http
      .patch<IAPIResponse>(`${this.taskApiUrl}/delete`, { taskId })
      .pipe(
        map((res) => {
          return this.setupData(res);
        })
      );
  }

  public markAsCompleteTask(taskId: string): Observable<ITask> {
    return this.http
      .patch<IAPIResponse>(`${this.taskApiUrl}/complete`, { taskId })
      .pipe(
        map((res) => {
          return this.setupData(res);
        })
      );
  }

  public undoTaskAction(taskId: string, taskAction: string) {
    return this.http
      .patch<IAPIResponse>(`${this.taskApiUrl}/undo/${taskAction}`, {
        taskId,
      })
      .pipe(
        map((res) => {
          return this.setupData(res);
        })
      );
  }

  public getCustomListTask(listId: string) {
    let url = `${this.taskApiUrl}/custom-list/${listId}`;
    return this.http
      .get<IAPIResponse>(url)
      .pipe(map((res) => this.setupData(res)));
  }

  public searchTasks(searchQuery: string) {
    const url = `${this.taskApiUrl}?search=${searchQuery}`;

    return this.http
      .get<IAPIResponse>(url)
      .pipe(map((res) => this.setupData(res)));
  }

  private setupData(res: IAPIResponse): any {
    if (res.Status === APIStatusMessage.Success) {
      return res.Data;
    }
    return null;
  }
}
