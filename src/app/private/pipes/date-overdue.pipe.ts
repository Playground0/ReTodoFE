import { Pipe, PipeTransform } from '@angular/core';
import * as dayjs from 'dayjs';

@Pipe({
  name: 'dateoverdue'
})
export class DateOverduePipe implements PipeTransform {

  transform(dueDate: string): unknown {
    if (!dueDate) return false;
    const currentDate = dayjs()
    return currentDate.isAfter(dayjs(dueDate), 'day');
  }

}
