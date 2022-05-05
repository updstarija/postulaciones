import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl,Validators } from '@angular/forms';
import { UtilsService } from '../../services/utils.service';
import { AuthService } from '../../services/auth.service';
import * as moment from 'moment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  formData: FormGroup;
  paises: any[];
  saving: boolean;
  error: string;
  id: any;
  constructor(private utils: UtilsService, private user: AuthService) { 
    this.formData = new FormGroup({
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
      Documento: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      Celular: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      Correo: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.maxLength(50),
      ]),
      Fechanac: new FormControl(new Date(), [Validators.required]),
      Idnacionalidad: new FormControl(null, []),
      Sexo: new FormControl('', [Validators.required]),
      Direccion: new FormControl('', [Validators.maxLength(250)]),
      Estadocivil: new FormControl('', [Validators.required]),
    });

  }

  ngOnInit(): void {
    this.id = this.user.userData.Id;
    console.log(this.user.userData);
    this.utils.httpGET('persona/' + this.user.userData.Id).then((data: any) => {
      console.log(data);
      //console.log(moment(data.Fechanac).format('MM/DD/YYYY'));
      this.formData.patchValue({
        Nombre: data.Nombre,
        Paterno: data.Paterno,
        Materno: data.Materno,
        Documento: data.Documento,
        Celular: data.Celular,
        Correo: data.Correo,
        Fechanac: moment(data.Fechanac).format('YYYY-MM-DD'),
        Idnacionalidad: data.Idnacionalidad,
        Sexo: data.Sexo,
        Estadocivil: data.Estadocivil,
        Direccion: data.Direccion,
      });
    });
  }
 save(){}
}
