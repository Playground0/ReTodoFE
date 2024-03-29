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
export class CustomFormComponent implements OnChanges {
  @Input() public config$!: ICustomFormBody;

  public form: FormGroup = new FormGroup('');
  public hide = true;
  public dynamicAuthTitle = '';

  constructor(private formService: FormsService, private authService: AuthService) {}

  ngOnChanges(changes: SimpleChanges): void {
    //TODO: Refactor the below code
    if (!changes['config$']) return;
    const config: ICustomFormBody = changes['config$'].currentValue;
    if (!config.controls) return;
    this.form.reset();
    this.form = this.formService.initializeForm(this.config$.controls);
  }

  onSubmit() {
    if(this.form.invalid){
      this.form.markAllAsTouched()
      return
    }
    this.formService.currentData = this.form.value;
  }
}
