import { Injectable } from '@angular/core';
import { LocalDataService } from 'src/app/core/services/localdata.service';

@Injectable({
  providedIn: 'root'
})
export class PrivateCommonService {

  constructor(private localDataService: LocalDataService) { }

  public getUserData(){
    return this.localDataService.localUserData;
  }
}
