import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private loader = new BehaviorSubject<boolean>(false)
  public loader$ = this.loader.asObservable()
  constructor() { }

  setLoader(value : boolean){
    this.loader.next(value)
  }
}
