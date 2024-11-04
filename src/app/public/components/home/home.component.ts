import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private subscription = new Subscription()

  constructor(private authService: AuthService, private router: Router){}

  ngOnInit(): void {
    this.subscription.add(
      this.authService.isUserLoggedIn$.subscribe({
        next: (status: boolean) => {
          if (status || this.authService.isLoggedIn()) {
            this.router.navigateByUrl('/todo/inbox')
            return;
          }
        },
      }) ,
    )
  }
}
