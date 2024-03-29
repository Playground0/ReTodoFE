import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivateRoutingModule } from './private-routing.module';
import { UserProfilePageComponent } from './components/user/user-profile-page/user-profile-page.component';
import { UserStatisticPageComponent } from './components/user/user-statistic-page/user-statistic-page.component';


@NgModule({
  declarations: [
    UserProfilePageComponent,
    UserStatisticPageComponent
  ],
  imports: [
    CommonModule,
    PrivateRoutingModule
  ]
})
export class PrivateModule { }
