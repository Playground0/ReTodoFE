import { Injectable } from '@angular/core';
import * as dayjs from 'dayjs';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  getStartOfDay(date?: string): string {
    if(date) {
      return dayjs(date).startOf('day').format("YYYY-MM-DDTHH:mm:ss")
    }
    return dayjs().startOf('day').format("YYYY-MM-DDTHH:mm:ss");
  }

  getStartOfMonth(): string {
    return dayjs().startOf('month').format("YYYY-MM-DDTHH:mm:ss");
  }
}
