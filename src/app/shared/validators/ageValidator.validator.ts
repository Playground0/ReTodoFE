import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function ageValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value === null || value === undefined || value === '') {
      return null;
    }

    const age = Number(value);

    if (isNaN(age) || age <= 0 || age > 120) {
      return { invalidAge: true };
    }

    return null;
  };
}