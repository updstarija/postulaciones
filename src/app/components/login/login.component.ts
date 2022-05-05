import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from 'src/app/services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  showLogin: boolean;
  loading: boolean;
  user: string = '';
  password: string = '';
  user_r: string = '';
  password_r: string = '';
  errorLogin: boolean;
  showCreate: boolean;
  errorCreate: boolean;
  formCreate: FormGroup;
  saving: boolean;
  error: string;
  constructor(
    private utils: UtilsService,
    private router: Router,
    private authService: AuthService
  ) {
    this.formCreate = new FormGroup({
      Nombre: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
      ]),
      Paterno: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
      ]),
      Materno: new FormControl('', [Validators.maxLength(100)]),
      Correo: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.maxLength(50),
      ]),
      Password: new FormControl('', [
        Validators.required,
        Validators.minLength(7),
      ]),
      PasswordRepeat: new FormControl('', [
        Validators.required,
        Validators.minLength(7),
      ]),
    });
  }

  ngOnInit(): void {
    this.showLogin = false;
    this.errorLogin = false;
  }
  login() {
    this.errorLogin = false;
    this.loading = true;
    const data = {
      Username: this.user,
      Password: this.password,
    };
    this.authService
      .login(data)
      .then((resp: any) => {
        console.log(resp);
        localStorage.setItem('api-token', resp.token);
        localStorage.setItem('refresh-token', resp.refreshtoken);
        const helper = new JwtHelperService();
        const decodeToken = helper.decodeToken(resp.token);
        console.log(decodeToken.data);
        this.authService.setUser(decodeToken.data);
        this.showLogin = false;
        this.router.navigate(['/principal'], { replaceUrl: true });
        this.loading = false;
        this.errorLogin = false;
      })
      .catch((err) => {
        console.log(err);
        this.loading = false;
        this.errorLogin = true;
      });
  }
  async save() {
    if (!this.formCreate.valid) {
      return false;
    }
    if (
      this.formCreate.value.Password != this.formCreate.value.PasswordRepeat
    ) {
      this.utils.Toast('Las contraseñas no coinciden', 2);
      return false;
    }
    this.saving = true;
    this.error = null;
    const data = JSON.parse(JSON.stringify(this.formCreate.value));
    console.log(data);
    this.utils
      .httpPOST('/SaveUsuario', data)
      .then((res) => {
        this.saving = false;
        if (res.error != '') {
          this.error = res.error;
          this.utils.Toast(this.error, 2);
        } else {
          this.utils.Toast('Usuario registrado exitosamente.', 1);
          this.user = data.Correo;
          this.password = data.Password;
          this.login();
        }
      })
      .catch((err) => {
        this.error = err;
        this.utils.Toast(this.error, 2);
        this.saving = false;
      });
  }
  create() {
    this.showLogin = false;
    this.showCreate = true;
    this.formCreate.patchValue({
      Nombre: '',
      Paterno: '',
      Materno: '',
      Correo: '',
      Password: '',
      PasswordRepeat: '',
    });
  }
  cancel() {
    this.showLogin = true;
    this.showCreate = false;
  }
}
