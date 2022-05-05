import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { toast, ToastType } from 'bulma-toast'
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  _baseURL: string = environment.baseUrl;
  _user = null;
 

  constructor(private http: HttpClient) {}
  getToken() {
    const token: string = sessionStorage.getItem('api-token');
    if (token) {
      const helper = new JwtHelperService();
      this._user = helper.decodeToken(token).data;
      return token;
    } else {
      return null;
    }
  }
 
  httpGET(url: string, params?) {
    if (url.substring(0, 1) !== '/') {
      url = '/' + url;
    }
    if (params) {
      let body = new URLSearchParams();
      for (const key in params) {
        body.set(key, params[key]);
      }
      return this.http
        .get(this._baseURL + url + '?' + body.toString())
        .pipe(catchError(this.handleError))
        .toPromise() as Promise<Array<any>>;
    } else
      return this.http
        .get(this._baseURL + url)
        .pipe(catchError(this.handleError))
        .toPromise() as Promise<Array<any>>;
  }
  httpPOST(url, data) {
    if (url.substring(0, 1) !== '/') {
      url = '/' + url;
    }
    let body = new URLSearchParams();
    for (const key in data) {
      body.set(key, data[key]);
    }
    return this.http
      .post<any>(this._baseURL + url, body.toString(), {
        headers: new HttpHeaders().set(
          'Content-Type',
          'application/x-www-form-urlencoded'
        ),
      })
      .pipe(catchError(this.handleError))
      .toPromise();
  }

  httpPUT(url, data) {
    if (url.substring(0, 1) !== '/') {
      url = '/' + url;
    }
    let body = new URLSearchParams();
    for (const key in data) {
      body.set(key, data[key]);
    }
    return this.http
      .put<any>(this._baseURL + url, body.toString(), {
        headers: new HttpHeaders().set(
          'Content-Type',
          'application/x-www-form-urlencoded'
        ),
      })
      .pipe(catchError(this.handleError))
      .toPromise();
  }

  httpDelete(url) {
    if (url.substring(0, 1) !== '/') {
      url = '/' + url;
    }
    return this.http
      .delete<any>(this._baseURL + url, {
        headers: new HttpHeaders().set(
          'Content-Type',
          'application/x-www-form-urlencoded'
        ),
      })
      .pipe(catchError(this.handleError))
      .toPromise();
  }

  httpPostImage(url, data) {
    return this.http
      .post<any>(this._baseURL + url, data)
      .pipe(catchError(this.handleError))
      .toPromise();
  }

  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

  public httpFileUpload(url, data, file) {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    formData.append('file', file);
    return this.http
      .post(this._baseURL + url, formData)
      .pipe(catchError(this.handleError))
      .toPromise() as Promise<any>;
  }

  public httpPUTFileUpload(url, data, file) {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    formData.append('file', file);
    return this.http
      .put(this._baseURL + url, formData)
      .pipe(catchError(this.handleError))
      .toPromise() as Promise<any>;
  }

  removeDuplicates(originalArray, prop) {
    let newArray = [];
    let lookupObject = {};

    for (let i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (let i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }

  httpPOSTJSON(url, data) {
    if (url.substring(0, 1) !== '/') {
      url = '/' + url;
    }
    return this.http
      .post<any>(this._baseURL + url,data, {
        headers: new HttpHeaders().set(
          'Content-Type',
          'application/json'
        ),
      })
      .pipe(catchError(this.handleError))
      .toPromise();
  }

  Toast(msj,tipo){
    let alert:any="";
    switch (tipo){
      case 1:
        alert="is-success";
        break;
      case 2:
        alert='is-warning';
        break;
      case 3:
        alert="is-danger";
        break;
    }
    toast({
      message: msj,
      type: alert,
      dismissible: true,
      pauseOnHover: true,
    });
  }
}
