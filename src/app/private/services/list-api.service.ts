import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import {
  APIStatusMessage,
  IAPIResponse,
} from 'src/app/shared/model/basic-api.model';

@Injectable({
  providedIn: 'root',
})
export class ListApiService {
  private listApiUrl = '';
  constructor(private authService: AuthService, private http: HttpClient) {
    this.listApiUrl = this.authService.apiUrl + '/list';
  }

  public getAll(userId: string): Observable<any>{
    let url = `${this.listApiUrl}/all/${userId}`;
    return this.http.get<IAPIResponse>(url).pipe(
      map((res: IAPIResponse) => {
        return this.setupData(res);
      })
    );
  }

  private setupData(res: IAPIResponse): any {
    if (res.Status === APIStatusMessage.Success) {
      return res.Data;
    }
    return null;
  }
}
