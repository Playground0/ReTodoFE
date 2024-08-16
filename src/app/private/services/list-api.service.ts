import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import {
  APIStatusMessage,
  IAPIResponse,
} from 'src/app/shared/model/basic-api.model';
import { IList, IListCreate, IListUpdate } from '../model/list.model';

@Injectable({
  providedIn: 'root',
})
export class ListApiService {
  private listApiUrl = '';
  constructor(private authService: AuthService, private http: HttpClient) {
    this.listApiUrl = this.authService.apiUrl + '/list';
  }

  public getAll(userId: string): Observable<IList[]> {
    let url = `${this.listApiUrl}/${userId}`;
    return this.http
      .get<IAPIResponse>(url)
      .pipe(map((res: IAPIResponse) => this.setupData(res)));
  }

  public createList(list: IListCreate): Observable<IList> {
    return this.http
      .post<IAPIResponse>(this.listApiUrl, list)
      .pipe(map((res) => this.setupData(res)));
  }

  public deleteList(listId: string, userId: string): Observable<any> {
    const request = { listId, userId };
    let url = `${this.listApiUrl}/delete`;
    return this.http
      .patch<IAPIResponse>(url, request)
      .pipe(map((res) => this.setupData(res)));
  }

  public updateList(updateList: IListUpdate): Observable<any> {
    return this.http
      .patch<IAPIResponse>(this.listApiUrl, updateList)
      .pipe(map((res) => this.setupData(res)));
  }

  public archiveList(listId: string, userId: string): Observable<any> {
    const request = { listId, userId };
    let url = `${this.listApiUrl}/archive`;
    return this.http
      .patch<IAPIResponse>(url, request)
      .pipe(map((res) => this.setupData(res)));
  }

  public hideList(listId: string, userId: string): Observable<any> {
    const request = { listId, userId };
    let url = `${this.listApiUrl}/hide`;
    return this.http
      .patch<IAPIResponse>(url, request)
      .pipe(map((res) => this.setupData(res)));
  }

  public undoListAction(listId: string, userId: string, undoAction: string) {
    const request = { listId, userId };
    let url = `${this.listApiUrl}-undo/${undoAction}`;
    return this.http
      .patch<IAPIResponse>(url, request)
      .pipe(map((res) => this.setupData(res)));
  }

  private setupData(res: IAPIResponse): any {
    if (res.Status === APIStatusMessage.Success) {
      return res.Data;
    }
    return null;
  }
}