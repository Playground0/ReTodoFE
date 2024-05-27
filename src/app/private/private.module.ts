import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivateRoutingModule } from './private-routing.module';
import { UserProfilePageComponent } from './components/user/user-profile-page/user-profile-page.component';
import { UserStatisticPageComponent } from './components/user/user-statistic-page/user-statistic-page.component';
import { TodoTaskComponent } from './components/todo/todo-task/todo-task.component';
import { TodoPanelComponent } from './components/todo/todo-panel/todo-panel.component';
import { TodoComponent } from './components/todo/todo.component';


@NgModule({
  declarations: [
    UserProfilePageComponent,
    UserStatisticPageComponent,
    TodoTaskComponent,
    TodoPanelComponent,
    TodoComponent
  ],
  imports: [
    CommonModule,
    PrivateRoutingModule
  ]
})
export class PrivateModule { }
