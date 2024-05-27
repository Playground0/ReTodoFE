import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { ITask, ITaskCreate, ITaskUpdate } from '../model/task';
import {
  APIStatusMessage,
  IAPIResponse,
} from 'src/app/shared/model/basic-api.model';

@Injectable({
  providedIn: 'root',
})
//TODO: Refactor this code for error handling
export class TaskAPIService {
  private taskApiUrl = '';
  constructor(private authSerive: AuthService, private http: HttpClient) {
    this.taskApiUrl = this.authSerive.getApiUrl() + '/task';
  }

  public getTasks(
    userId: string,
    endpoint: string,
    listid: string = ''
  ): Observable<ITask[]> {
    let url = `${this.taskApiUrl}/${userId}/${endpoint}`;
    url = listid ? `${url}/${listid}` : url;
    return this.http.get<IAPIResponse>(url).pipe(
      map((res: IAPIResponse) => {
        if (res.Status === APIStatusMessage.Success) {
          return res.Data;
        }
        return null;
      })
    );
  }

  public creteTask(newTask: ITaskCreate): Observable<ITask> {
    return this.http.post<IAPIResponse>(this.taskApiUrl, newTask).pipe(
      map((res) => {
        if (res.Status === APIStatusMessage.Success) {
          return res.Data;
        }
        return null;
      })
    );
  }

  public getTaskDetails(userId: string, id: string): Observable<ITask> {
    return this.http
      .get<IAPIResponse>(
        `${this.authSerive.getApiUrl()}/task-details/${userId}/${id}`
      )
      .pipe(
        map((res) => {
          console.log(res);
          if (res.Status === APIStatusMessage.Success) {
            return res.Data;
          }
          return null;
        })
      );
  }

  public updateTask(task: ITaskUpdate): Observable<ITask> {
    return this.http.patch<IAPIResponse>(this.taskApiUrl, task).pipe(
      map((res) => {
        if (res.Status === APIStatusMessage.Success) {
          return res.Data;
        }
        return null;
      })
    );
  }

  public deleteTask(userId: string, taskId: string): Observable<boolean> {
    return this.http
      .patch<IAPIResponse>(`${this.taskApiUrl}/delete`, { userId, taskId })
      .pipe(
        map((res) => {
          if (res.Status === APIStatusMessage.Success) {
            return res.Data;
          }
          return null;
        })
      );
  }
}
