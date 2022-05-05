import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-general-information',
  templateUrl: './general-information.component.html',
  styleUrls: ['./general-information.component.scss'],
})
export class GeneralInformationComponent implements OnInit {
  formData: FormGroup;
  data: any;
  paises: any[];
  categorias: any[];
  saving: boolean;
  error: string;
  id: any;
  @Output() public changeTab = new EventEmitter<{ tab: number }>();
  constructor(
    private user: AuthService,
    private utils: UtilsService,
    private router: Router
  ) {
    this.formData = new FormGroup({
      Titulo: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
      ]),
      Idcategoria: new FormControl(null, [Validators.required]),
      Salario: new FormControl('', [Validators.required]),
      Idpais: new FormControl(null, [Validators.required]),
      Ciudad: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      Presentacion: new FormControl('', [
        Validators.required,
        Validators.maxLength(500),
      ]),
      Idpersona: new FormControl(null),
    });
  }

  ngOnInit(): void {
    this.getPaises();
    this.getCategorias();
    this.id = this.user.userData.Id;
    this.utils
      .httpGET('GetGeneral?id=' + this.user.userData.Id)
      .then((data: any) => {
        console.log(data);
        if (data) {
          this.data = data;
          this.formData.patchValue({
            Titulo: data.Titulo,
            Idcategoria: data.Idcategoria,
            Idpais: data.Idpais,
            Ciudad: data.Ciudad,
            Salario: data.Salario,
            Presentacion: data.Presentacion,
            Idpersona: this.id,
          });
        } else {
          this.formData.patchValue({
            Titulo: '',
            Idcategoria: null,
            Idpais: null,
            Ciudad: '',
            Salario: '',
            Presentacion: '',
            Idpersona: this.id,
          });
        }
      });
  }
  async save() {
    if (!this.formData.valid) {
      return false;
    }
    this.saving = true;
    this.error = null;
    if (this.data) {
      const data = JSON.parse(JSON.stringify(this.formData.value));
      this.utils
        .httpPUT('/UpdateGeneral?id=' + this.id, data)
        .then((res) => {
          this.saving = false;
          if (res != '') {
            this.error = res;
            this.utils.Toast('Error al guardar', 2);
          } else {
            this.publish();
          }
        })
        .catch((err) => {
          console.log(err);
          this.saving = false;
        });
    } else {
      const data = JSON.parse(JSON.stringify(this.formData.value));
      console.log(data);
      this.utils
        .httpPOST('/SaveGeneral', data)
        .then((res) => {
          this.saving = false;
          if (res.error != '') {
            console.log(res);
            this.error = res;
            this.utils.Toast(this.error, 2);
          } else {
            this.publish();
          }
        })
        .catch((err) => {
          console.log(err);
          this.saving = false;
        });
    }
  }
  getPaises() {
    this.utils.httpGET('Pais').then((data: any[]) => {
      this.paises = data;
    });
  }
  getCategorias() {
    this.utils.httpGET('GetCategorias').then((data: any[]) => {
      console.log(data);
      this.categorias = data;
    });
  }
  back() {
    this.changeTab.emit({ tab: 3 });
  }
  publish() {
    this.utils
      .httpPUT('PublicarCurriculum?id=' + this.id, null)
      .then((res) => {
        this.saving = false;
        if (res != '') {
          this.error = res;
          this.utils.Toast('ERROR', 2);
        } else {
          this.utils.Toast('Curriculum publicado exitosamente.', 1);
          this.router.navigate(['/principal/docente'], { replaceUrl: true });
        }
      })
      .catch((err) => {
        this.utils.Toast('ERROR', 2);
        this.saving = false;
      });
  }
}
