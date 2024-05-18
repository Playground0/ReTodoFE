import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { LocalDataService } from 'src/app/core/services/localdata.service';
import { IUser } from 'src/app/public/models/auth-page.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
//TODO: Refactor the whole code
export class HeaderComponent implements OnInit, AfterViewInit {
  title = 'ReToDo';
  navConfig: any[] = [];
  showPrivate: boolean = false;
  userInfo!: IUser;

  //TODD: Create backend servies for these navs
  defaultNavConfig = [
    {
      link: '/aboutus',
      label: 'News',
    },
    {
      link: '/demo',
      label: 'Demo',
    },
    {
      link: '/aboutus',
      label: 'About us',
    },
    {
      link: '/auth/login',
      label: 'Login',
    },
  ];

  loggedInNavConfig = [
    {
      link: '/aboutus',
      label: 'News',
    },
    {
      link: '/aboutus',
      label: 'About us',
    },
    {
      link: '/profile',
      label: 'Profile',
    },
  ];

  constructor(
    private authService: AuthService,
    private localDataService: LocalDataService
  ) {}

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.navConfig = this.defaultNavConfig;
    this.authService.isUserLoggedIn$.subscribe({
      next: (status: boolean) => {
        if (status || this.authService.isAuthenticated()) {
          this.navConfig = this.loggedInNavConfig;
          this.showPrivate = true;
          this.authService.confirmUserLoggedIn();
          this.userInfo = this.localDataService.userLocalData as IUser;
          return;
        }
        this.showPrivate = false;
        this.navConfig = this.defaultNavConfig;
      },
    });
  }

  logout() {
    this.authService.logout(this.userInfo.email).subscribe({
      next: (res) => {
        if (res.Action_Status === 'Success') {
          console.log('logged out successfully');
        }
      },
    });
  }
}
