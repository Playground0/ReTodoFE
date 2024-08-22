import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivateRoutingModule } from './private-routing.module';
import { UserProfilePageComponent } from './components/user/user-profile-page/user-profile-page.component';
import { UserStatisticPageComponent } from './components/user/user-statistic-page/user-statistic-page.component';
import { TodoTaskListComponent } from './components/todo/todo-task/todo-task-list.component';
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
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTooltipModule} from '@angular/material/tooltip';
import { DateOverduePipe } from './pipes/date-overdue.pipe';
import { FetchTimePipe } from './pipes/fetch-time.pipe';
import {MatMenuModule} from '@angular/material/menu';
import { TransformDatePipe } from './pipes/transform-date.pipe';
import { PomodoroTimerComponent } from './components/todo/todo-actions/pomodoro-timer/pomodoro-timer.component';
import { ShowTwoDigitPipe } from './pipes/show-two-digits.pipe';

@NgModule({
  declarations: [
    UserProfilePageComponent,
    UserStatisticPageComponent,
    TodoTaskListComponent,
    TodoPanelComponent,
    TodoComponent,
    TodoActionsComponent,
    TaskEditorDialogComponent,
    DateOverduePipe,
    FetchTimePipe,
    TransformDatePipe,
    PomodoroTimerComponent,
    ShowTwoDigitPipe
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
    MatSelectModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatMenuModule,
  ],
  providers:[{provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: true}}]
})
export class PrivateModule { }
