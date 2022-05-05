import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, first, map, switchMap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
// import { AuthService } from './auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  _baseURL: string = environment.baseUrl;
  constructor(private auth: AuthService, private http: HttpClient, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const token: string = localStorage.getItem('api-token') || '';
    const refreshToken: string = localStorage.getItem('refresh-token') || '';
    const helper = new JwtHelperService();
    let expired=false;
    if (token) {
      expired = helper.isTokenExpired(token);
      if (!req.url.includes('/authenticate') && !req.url.includes('/refreshtoken')) {
        req = req.clone({
          setHeaders: {
            Authorization: 'Bearer ' + token
          }
        });
      }
    }
    
    if (expired && !req.url.includes('/authenticate') && !req.url.includes('/refreshtoken')) {

      console.log('expired');
      
      return next.handle(req).pipe(
        map((event: HttpEvent<any>) => {
          console.log(event);
          
            return event;
        })).pipe(catchError(err => {
        return this.http.post<any>(this._baseURL + '/refreshtoken', { Token: refreshToken }, {
          headers: new HttpHeaders().set('Content-Type', 'application/json'),
          observe: 'response'
        }).pipe(switchMap((data) => {
          console.log(data);
          if (data.status === 200) {
            localStorage.setItem("api-token", data.body);
            const helper = new JwtHelperService();
            const user = JSON.parse(helper.decodeToken(token).unique_name)
            this.auth.setUser(user);
            // localStorage.setItem("refreshToken", data.body.refreshToken);
            req = req.clone({
              setHeaders: {
                Authorization: 'Bearer ' + data.body
              }
            });
            return next.handle(req);
          } else {
            this.auth.logout();
            this.router.navigate(['/login']);
           // this.dialogRef.closeAll();
            return throwError(err);
          }
        }));
      }));
    } else {
      return next.handle(req);
    }

  }
}