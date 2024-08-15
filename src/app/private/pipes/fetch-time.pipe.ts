import { Pipe, PipeTransform } from '@angular/core';
import * as dayjs from 'dayjs';

@Pipe({
  name: 'fetchtime'
})
export class FetchTimePipe implements PipeTransform {

  transform(dueDate: string): unknown {
    if (!dueDate) return false;
    const currentDate = dayjs(dueDate);
    if(currentDate.hour() <= 0 && currentDate.minute() === 0){
      return null
    }
    const time = currentDate.hour() + ':' + currentDate.minute()
    return time
  }

}
