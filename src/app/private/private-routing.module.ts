import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserStatisticPageComponent } from './components/user/user-statistic-page/user-statistic-page.component';
import { authGuard } from '../core/auth/auth.guard';
import { UserProfilePageComponent } from './components/user/user-profile-page/user-profile-page.component';
import { TodoComponent } from './components/todo/todo.component';
import { DashboardComponent } from './components/user/user-profile-page/dashboard/dashboard.component';
import { StashComponent } from './components/user/user-profile-page/stash/stash.component';

const routes: Routes = [
  { path: '', component: TodoComponent, canActivate: [authGuard] },
  {
    path: 'profile',
    component: UserProfilePageComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
      },
      {
        path: 'stash',
        component: StashComponent,
        canActivate: [authGuard],
      },
    ],
  },
  {
    path: 'statistics',
    component: UserStatisticPageComponent,
    canActivate: [authGuard],
  },
  { path: ':panelLink', component: TodoComponent, canActivate: [authGuard] },
  {
    path: 'list/:panelLink',
    component: TodoComponent,
    canActivate: [authGuard],
  },
  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivateRoutingModule {}
