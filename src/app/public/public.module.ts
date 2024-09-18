import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { HomeComponent } from './components/home/home.component';
import { AuthPageComponent } from './components/auth-page/auth-page.component';
import { AboutusComponent } from './components/aboutus/aboutus.component';

import { SharedModule } from '../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { ResetPasswordComponent } from './components/auth-page/reset-password/reset-password.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FeaturesComponent } from './components/features/features.component';
import { ForumComponent } from './components/forum/forum.component';

@NgModule({
  declarations: [
    HomeComponent,
    AuthPageComponent,
    AboutusComponent,
    ResetPasswordComponent,
    FeaturesComponent,
    ForumComponent,
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    SharedModule,
    MatIconModule,
    MatSnackBarModule,
  ],
})
export class PublicModule {}
