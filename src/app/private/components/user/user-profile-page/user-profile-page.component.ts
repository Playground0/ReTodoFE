import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IPanelLink } from 'src/app/private/model/UI/panel-info';

@Component({
  selector: 'app-user-profile-page',
  templateUrl: './user-profile-page.component.html',
  styleUrls: ['./user-profile-page.component.scss'],
})
export class UserProfilePageComponent {
  panelItems: IPanelLink[] = [
    {
      name: 'Dashboard',
      link: 'dashboard',
      tooltip: 'Check all about you',
      isDefaultList: true,
    },
    {
      name: 'Stash',
      link: 'stash',
      tooltip: 'Your Stash',
      isDefaultList: true,
    }
  ];

  constructor(private router: Router) {}

  sendViewAction(panelLink: IPanelLink) {
    this.router.navigateByUrl(`/profile/${panelLink.link}`)
  }
}
