import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TokenStorageService } from '../services/token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class TokenHttpInterceptor implements HttpInterceptor {

  constructor(
    private service: TokenStorageService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.service.getToken();
    if (!token) {
      return next.handle(request);
    }
    const updatedRequest = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`),
    });
    console.log(updatedRequest);
    return next.handle(updatedRequest).pipe(
      tap(
        (event) => {},

        (error) => {}
      )
    );
  }
}
