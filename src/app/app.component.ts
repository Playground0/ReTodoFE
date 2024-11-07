import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoaderService } from './shared/service/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'ReToDoFE';
  loader = false;

  constructor(
    private loaderService: LoaderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loaderService.loader$.subscribe({
      next: (dynamicLoader: boolean) => {
        this.loader = dynamicLoader;
        this.cdr.detectChanges();
      },
    });
  }
}
