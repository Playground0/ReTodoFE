import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ICustomFormBody } from '../../model/form.model';
import { FormsService } from '../../service/forms.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'rtd-custom-form',
  templateUrl: './custom-form.component.html',
  styleUrls: ['./custom-form.component.scss'],
})
export class CustomFormComponent{
  @Input() set config(value: ICustomFormBody){
    this._config = value;
    this.setupForm(this._config)
  };
  get config(){
    return this._config
  }
  @Input() set data(value: unknown) {
    this._data = value;
    this.setupData(this._data)
  }
  get data() {
    return this._data;
  }
  public _data: unknown;
  public _config!: ICustomFormBody
  public form: FormGroup = new FormGroup('');
  public hide = true;
  public dynamicAuthTitle = '';

  constructor(
    private formService: FormsService
  ) {}


  setupForm(config: ICustomFormBody){
    if (!config.controls) return;
    this.form.reset();
    this.form = this.formService.initializeForm(config.controls);
  }

  setupData(data: unknown) {
    if(!data) return
    this.form.patchValue(data)
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.formService.currentData = this.form.value;
  }
}
