import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICustomFormBody, IFormControlBody } from '../model/form.model';
import { BehaviorSubject } from 'rxjs';

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
      if (validation === 'required') {
        result.push(Validators.required);
      } else if (validation === 'minLength') {
        result.push(Validators.minLength(validators.minLength));
      } else if (validation === 'maxLength') {
        result.push(Validators.maxLength(validators.maxLength));
      } // TODO: Add more validators as needed
    }
    return result;
  }
  //It sets the current value of the form
  set currentData(value: any) {
    this.formData.next(value);
  }

  //Get only the currentvalue of the data
  get currentData() {
    return this.formData.value;
  }
}
