import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IFormControlBody } from '../model/form.model';
import { BehaviorSubject } from 'rxjs';
import { passwordStrengthValidator } from '../validators/passwordStrength.validator';
import { ageValidator } from '../validators/ageValidator.validator';
import { phoneNumberValidator } from '../validators/phoneNumber.validator';

@Injectable({
  providedIn: 'root',
})
export class FormsService {
  private formData = new BehaviorSubject<any>('');
  public formData$ = this.formData.asObservable();
  constructor() {}

  public initializeForm(form: IFormControlBody[]): FormGroup {
    let newForm: FormBuilder = new FormBuilder();
    const formGroupConfig: { [key: string]: any } = {};
    form.forEach((control: IFormControlBody) => {
      formGroupConfig[control.controlName] = [
        null,
        this.mapValidators(control.controlValidation),
      ];
    });
    return newForm.group(formGroupConfig);
  }

  private mapValidators(validators: any): Validators[] {
    if (!validators) return [];
    const result = [];
    for (const validation of Object.keys(validators)) {
      const value = validators[validation];
      if (!value) {
        continue;
      }
      switch (validation) {
        case 'required':
          result.push(Validators.required);
          break;
        case 'minLength':
          result.push(Validators.minLength(validators.minLength));
          break;
        case 'maxLength':
          result.push(Validators.maxLength(validators.maxLength));
          break;
        case 'email':
          result.push(Validators.email);
          break;
        case 'newPassword':
          result.push(passwordStrengthValidator());
          break;
        case 'age':
          result.push(ageValidator());
          break;
        case 'phoneNumber':
          result.push(phoneNumberValidator());
          break;
      }
    }
    return result;
  }

  set currentData(value: any) {
    this.formData.next(value);
  }

  get currentData() {
    return this.formData.value;
  }
}
