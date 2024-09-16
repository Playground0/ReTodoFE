import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function phoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value === null || value === undefined || value === '') {
      return null;
    }

    const phonePattern = /^[0-9]{10}$/;

    if (!phonePattern.test(value)) {
      return { invalidPhoneNumber: true };
    }

    return null;
  };
}