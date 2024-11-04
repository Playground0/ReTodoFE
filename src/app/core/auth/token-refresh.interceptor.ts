import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class TokenRefreshInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if(!this.authService.isLoggedIn())
    {
      return next.handle(request)
    }
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.authService.refreshAccessTokens().pipe(
            switchMap((res: any) => {
              const retryRequest = request.clone({
                withCredentials: true
              });
              return next.handle(retryRequest)
            }),
            catchError(() => {
              this.authService.hardLogoutUser()
              return throwError(() => new Error('All tokens have expired due to inactivity. Please login again!'));;
            })
          );
        }
        return throwError(() => new Error('Something went wrong while parsing token!'));
      })
    );
  }
}