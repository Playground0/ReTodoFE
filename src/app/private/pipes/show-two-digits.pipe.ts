import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'twodigit'
})
export class ShowTwoDigitPipe implements PipeTransform {

  transform(number: number): string {
    if (!number) return '00';
    if(number < 10) {
        return '0' + number
    }
    return number.toString()
  }

}
