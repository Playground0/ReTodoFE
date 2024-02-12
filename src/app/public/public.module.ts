import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { DemoComponent } from './demo/demo.component';
import { AboutusComponent } from './aboutus/aboutus.component';


@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    DemoComponent,
    AboutusComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule
  ]
})
export class PublicModule { }
