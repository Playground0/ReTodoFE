import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivateRoutingModule } from './private-routing.module';
import { UserProfilePageComponent } from './components/user/user-profile-page/user-profile-page.component';
import { UserStatisticPageComponent } from './components/user/user-statistic-page/user-statistic-page.component';
import { TodoTaskComponent } from './components/todo/todo-task/todo-task.component';
import { TodoPanelComponent } from './components/todo/todo-panel/todo-panel.component';
import { TodoComponent } from './components/todo/todo.component';
import { TodoActionsComponent } from './components/todo/todo-actions/todo-actions.component';
import { MatIconModule } from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule} from '@angular/material/dialog';
import { TaskEditorDialogComponent } from './components/todo/todo-task/task-editor-dialog/task-editor-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@NgModule({
  declarations: [
    UserProfilePageComponent,
    UserStatisticPageComponent,
    TodoTaskComponent,
    TodoPanelComponent,
    TodoComponent,
    TodoActionsComponent,
    TaskEditorDialogComponent
  ],
  imports: [
    CommonModule,
    PrivateRoutingModule,
    MatIconModule,
    MatCheckboxModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TimepickerModule,
    MatSelectModule,
    MatSlideToggleModule
  ],
  providers:[{provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}]
})
export class PrivateModule { }
