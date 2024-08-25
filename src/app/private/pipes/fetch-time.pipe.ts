import { Pipe, PipeTransform } from '@angular/core';
import * as dayjs from 'dayjs';

@Pipe({
  name: 'fetchtime',
})
export class FetchTimePipe implements PipeTransform {
  transform(dueDate: string): unknown {
    if (!dueDate) return null;
    const currentDate = dayjs(dueDate);
    if(!currentDate.isValid()) return null;
    if (currentDate.hour() === 0 && currentDate.minute() === 0) {
      return null;
    }
    return currentDate.format('HH:mm');
  }
}
