import { Injectable } from '@angular/core';
import { IUser } from 'src/app/public/models/auth-page.model';

@Injectable({
  providedIn: 'root',
})
export class LocalDataService {
  private tokenName = 'rtdAuthToken';
  private userDataName = 'rtdUserData';

  public set tokenLocalData(value: string) {
    localStorage.setItem(this.tokenName, value);
  }

  public get tokenLocalData(): string {
    let sessionData = localStorage.getItem(this.tokenName);
    if (!sessionData) return '';
    return sessionData;
  }

  public set userLocalData(value: IUser | string) {
    localStorage.setItem(this.userDataName, JSON.stringify(value));
  }

  public get userLocalData(): IUser | string{
    let userData = localStorage.getItem(this.userDataName);
    if (!userData) return '';
    return JSON.parse(userData);
  }

  public setLocalData(varialbleName: string, value: unknown) {
    localStorage.setItem(varialbleName, JSON.stringify(value));
  }

  public getLocalData(varialbleName: string): unknown {
    let data = localStorage.getItem(varialbleName);
    if (!data) return '';
    return JSON.parse(data);
  }

  public removeLocalData(variableName: string) {
    localStorage.removeItem(variableName);
  }
}
