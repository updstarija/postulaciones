import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';
import { UtilsService } from './utils.service';

export interface Usuario {
  Id: number;
  Nombre: string;
  Paterno: string;
  Materno: string;
  Celular: string;
  Documento: string;
  Fechanac: Date;
  Nomusu: string;
  Password: string;
  Idrol: number;
  Idfacultad?: number;
  Curriculum?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // private user$: Observable<any>;
  // private userUpdateSubject = new Subject<any>();

  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();
  public userData: any;

  constructor(private utils: UtilsService) {
    // this.user$ = this.userUpdateSubject.asObservable();
    // this.token$ = this.tokenSubject.asObservable();
  }

  // public getUser(): Observable<any> {
  //   return this.user$.asObservable();
  // }
  public setUser(value: any) {
    this.userData = value;
    this.userSubject.next(value);
  }

  noPermiso(id) {
    if (this.userData) {
      if (this.userData.permisos) {
        return this.userData.permisos.filter((p) => p.id === id).length == 0;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  public isAuthenticated(): boolean {
   // let token: string = sessionStorage.getItem('api-token');
    let token: string | null = localStorage.getItem('api-token');
    if (token) {
      const helper = new JwtHelperService();
      console.log(helper.decodeToken(token));
      this.setUser(JSON.parse(helper.decodeToken(token).unique_name));
      return true;
      // const expired = helper.isTokenExpired(token);
      // if(expired) return false;
      // else return true;
    } else {
      return false;
    }
    //return !this.jwtHelper.isTokenExpired(token);
  }

  login(datos) {
    return this.utils.httpPOST('authenticate', datos);
  }

  logout() {
    localStorage.removeItem('api-token');
    localStorage.removeItem('refresh-token');
    // sessionStorage.removeItem('refreshToken');
    this.setUser(null);
    // this.setUserLocal(null);
  }

  existPermission(ids: Array<any>) {
    if (this.userData) {
      let found = false;
      ids.forEach((id) => {
        if (this.userData.permisos.filter((p) => p.id == id).length > 0)
          found = true;
      });
      return found;
    } else {
      return false;
    }
  }
}
