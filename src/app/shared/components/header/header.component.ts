import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { LocalDataService } from 'src/app/core/services/localdata.service';
import { IUser } from '../../../core/model/auth-page.model';
import { APIStatusMessage, IAPIResponse } from '../../model/basic-api.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
//TODO: Refactor the whole code
export class HeaderComponent implements OnInit, OnDestroy {
  title = 'ReToDo';
  navConfig: any[] = [];
  showPrivate: boolean = false;
  userInfo!: IUser;

  //TODD: Create backend servies for these navs
  defaultNavConfig = [
    {
      link: '/forum',
      label: 'Forum',
    },
    {
      link: '/donation',
      label: 'Donate',
    },
    {
      link: '/features',
      label: 'Features',
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
      link: '/forum',
      label: 'Forum',
    },
    {
      link: '/donation',
      label: 'Donate',
    },
    {
      link: '/features',
      label: 'Features',
    },
    {
      link: '/aboutus',
      label: 'About us',
    },
    {
      link: '/todo/profile',
      label: 'Profile',
    },
  ];
  private subscription = new Subscription()

  constructor(
    private authService: AuthService,
    private localDataService: LocalDataService
  ) {}

  ngOnInit(): void {
    this.navConfig = this.defaultNavConfig;
    this.subscription.add(
      this.authService.isUserLoggedIn$.subscribe({
        next: (status: boolean) => {
          if (status || this.authService.isLoggedIn()) {
            this.navConfig = this.loggedInNavConfig;
            this.showPrivate = true;
            this.authService.confirmUserLoggedIn();
            this.userInfo = this.localDataService.localUserData as IUser;
            return;
          }
          this.showPrivate = false;
          this.navConfig = this.defaultNavConfig;
        },
      }) ,
    )
    
  }

  logout() {
    this.authService.logout(this.userInfo.email).subscribe({
      next: (res:IAPIResponse) => {
        if (res.Status === APIStatusMessage.Success) {
          console.log('logged out successfully');
        }
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
