import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  template: `<div class="loader" *ngIf="loader">
    <mat-spinner></mat-spinner>
  </div>`,
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent {
  @Input() loader = false
}
