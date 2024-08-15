import { Pipe, PipeTransform } from '@angular/core';
import * as dayjs from 'dayjs';

@Pipe({
  name: 'transformdate'
})
export class TransformDatePipe implements PipeTransform {

  transform(value: Date | string | number, format?: string, timezone?: string, locale?: string): string | null {
    if (!value) return null;
    const date = dayjs(value);
    const today = dayjs().startOf('day');
    const tomorrow = today.add(1,'day').startOf('day'); 
    if (date.isSame(today, 'day')) {
      return 'Today';
    } else if (date.isSame(tomorrow, 'day')) {
      return 'Tomorrow';
    } else {
      return date.format("MMM D, YYYY "); // Use DatePipe's functionality for other dates
    }
  }

}
