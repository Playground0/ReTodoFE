import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { HomeComponent } from './components/home/home.component';
import { AuthPageComponent } from './components/auth-page/auth-page.component';
import { DemoComponent } from './components/demo/demo.component';
import { AboutusComponent } from './components/aboutus/aboutus.component';

import { SharedModule } from '../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    HomeComponent,
    AuthPageComponent,
    DemoComponent,
    AboutusComponent,
  ],
  imports: [CommonModule, PublicRoutingModule, SharedModule, MatIconModule],
})
export class PublicModule {}
