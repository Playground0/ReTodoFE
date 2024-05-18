import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserStatisticPageComponent } from './components/user/user-statistic-page/user-statistic-page.component';
import { authGuard } from '../core/auth/auth.guard';
import { UserProfilePageComponent } from './components/user/user-profile-page/user-profile-page.component';

const routes: Routes = [
  { path: '', component: UserProfilePageComponent, canActivate: [authGuard] },
  {
    path: 'statistics',
    component: UserStatisticPageComponent,
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivateRoutingModule {}
