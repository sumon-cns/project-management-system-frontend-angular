import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError, Observable, throwError} from 'rxjs';
import {Router} from "@angular/router";
import {ToastService} from "./toast.service";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private router: Router, private toastService: ToastService, private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authService.clearLoggedInUserInfo();
          this.toastService.showErrorMessage(error.error);
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
