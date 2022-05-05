import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/services/utils.service';
import * as moment from 'moment';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss'],
})
export class PersonalInformationComponent implements OnInit {
  formData: FormGroup;
  paises: any[];
  saving: boolean;
  error: string;
  id: any;
  @Output() public changeTab = new EventEmitter<{ tab: number }>();

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
    this.getPaises();
  }
  getPaises() {
    this.utils.httpGET('Pais').then((data: any[]) => {
      this.paises = data;
    });
  }
  async save() {
    if (!this.formData.valid) {
      return false;
    }
    this.saving = true;
    this.error = null;
    if (this.id) {
      const data = JSON.parse(JSON.stringify(this.formData.value));
      data.Fechanac = moment(this.formData.value.Fechanac).format('YYYY-MM-DD');
      console.log(data);
      this.utils
        .httpPUT('/persona/' + this.id, data)
        .then((res) => {
          this.saving = false;
          if (res) {
            this.error = res;
            console.log(this.error);
          } else {
            //this.utils.showToast(res.message, 4000);
            //this.dialogRef.close(res.item);
            console.log('Datos guardados');
            this.changeTab.emit({ tab: 2 });
          }
        })
        .catch((err) => {
          console.log(err);
          this.saving = false;
        });
    }
  }
}
