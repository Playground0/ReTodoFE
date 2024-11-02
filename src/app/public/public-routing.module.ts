import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AuthPageComponent } from './components/auth-page/auth-page.component';
import { AboutusComponent } from './components/aboutus/aboutus.component';
import { ResetPasswordComponent } from './components/auth-page/reset-password/reset-password.component';
import { FeaturesComponent } from './components/features/features.component';
import { ForumComponent } from './components/forum/forum.component';
import { DonationComponent } from './components/donation/donation.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'auth/:authType',
    component: AuthPageComponent,
  },
  {
    path: 'aboutus',
    component: AboutusComponent,
  },
  {
    path: 'features',
    component: FeaturesComponent,
  },
  {
    path: 'forum',
    component: ForumComponent,
  },
  {
    path: 'reset-password/:token/:email',
    component: ResetPasswordComponent,
  },
  { path: 'donation', component: DonationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicRoutingModule {}
