import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AuthPageComponent } from './components/auth-page/auth-page.component';
import { AboutusComponent } from './components/aboutus/aboutus.component';
import { DemoComponent } from './components/demo/demo.component';

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
    path: 'demo',
    component: DemoComponent,
  },
  {
    path: 'features',
    component: AboutusComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicRoutingModule {}
