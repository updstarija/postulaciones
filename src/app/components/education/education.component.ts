import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { AuthService } from 'src/app/services/auth.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss'],
})
export class EducationComponent implements OnInit {
  id: number = -1;
  index: number = -1;
  loading: boolean;
  colegios: any[];
  savingColegio: boolean;
  error: string;
  showModalColegio: boolean;
  formDataColegio: FormGroup;
  showModalBorrarColegio: boolean;
  deletingColegio: boolean;
  superiores: any[];
  formDataSuperior: FormGroup;
  showModalSuperior: boolean;
  savingSuperior: boolean;
  showModalBorrarSuperior: boolean;
  deletingSuperior: boolean;
  idiomas: any[];
  formDataIdioma: FormGroup;
  showModalIdioma: boolean;
  savingIdioma: boolean;
  showModalBorrarIdioma: boolean;
  deletingIdioma: boolean;
  saving_next: boolean;
  nivelColegios: any[];
  nivelSuperiores: any[];
  nivelIdiomas: any[];
  paises: any[];
  idiomasAll: any[];
  @Output() public changeTab = new EventEmitter<{ tab: number }>();
  constructor(private user: AuthService, private utils: UtilsService) {
    this.formDataColegio = new FormGroup({
      Colegio: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ]),
      Ciudad: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ]),
      Idpais: new FormControl(null, [Validators.required]),
      Idnivelestudio: new FormControl(null, [Validators.required]),
      Fechaini: new FormControl(new Date(), [Validators.required]),
      Fechafin: new FormControl(new Date(), [Validators.required]),
      Idpersona: new FormControl(null),
    });
    this.formDataSuperior = new FormGroup({
      Institucion: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ]),
      Descripcion: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      Ciudad: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ]),
      Idpais: new FormControl(null, [Validators.required]),
      Idnivelsuperior: new FormControl(null, [Validators.required]),
      Fechaini: new FormControl(new Date(), [Validators.required]),
      Fechafin: new FormControl(new Date()),
      Actual: new FormControl(false),
      Idpersona: new FormControl(null),
    });
    this.formDataIdioma = new FormGroup({
      Ididioma: new FormControl(null, [Validators.required]),
      Idescrito: new FormControl(null, [Validators.required]),
      Idoral: new FormControl(null, [Validators.required]),
      Idlectura: new FormControl(null, [Validators.required]),
      Idpersona: new FormControl(null),
    });
  }

  ngOnInit(): void {
    this.colegios = [];
    this.superiores = [];
    this.getColegios();
    this.getSuperiores();
    this.getNivelEstudios();
    this.getNivelSuperiores();
    this.getPaises();
    this.getIdiomas();
    this.getNivelIdiomas();
    this.getIdiomasAll();
  }
  showModalNewColegio() {
    this.id = -1;
    this.index = -1;
    this.showModalColegio = true;
    this.formDataColegio.patchValue({
      Colegio: '',
      Ciudad: '',
      Fechaini: null,
      Fechafin: null,
      Idnivelestudio: null,
      Idpais: null,
      Idpersona: this.user.userData.Id,
    });
  }
  showModalEditColegio(i, data) {
    this.id = data.Id;
    this.index = i;
    let fechaFin = moment(data.Fechafin).format('YYYY-MM-DD');
    if (fechaFin == moment('0001-01-01T00:00:00').format('YYYY-MM-DD')) {
      fechaFin = null;
    }
    this.showModalColegio = true;
    this.formDataColegio.patchValue({
      Colegio: data.Colegio,
      Ciudad: data.Ciudad,
      Fechaini: moment(data.Fechaini).format('YYYY-MM-DD'),
      Fechafin: fechaFin,
      Idpais: data.Idpais,
      Idnivelestudio: data.Idnivelestudio,
      Idpersona: this.user.userData.Id,
    });
  }

  async saveColegio() {
    let fechaFin = null;
    if (!this.formDataColegio.valid) {
      return false;
    }
    if (!this.formDataColegio.value.Actual) {
      fechaFin = moment(
        this.formDataColegio.value.Fechafin,
        'YYYY-MM-DD',
        true
      );
      if (!fechaFin.isValid()) {
        this.utils.Toast('La fecha fin no es fecha valida', 2);
        return false;
      } else {
        let factual = new Date().getTime();
        let fini = new Date(
          moment(this.formDataColegio.value.Fechaini).format('YYYY-MM-DD')
        ).getTime();
        let ffin = new Date(
          moment(this.formDataColegio.value.Fechafin).format('YYYY-MM-DD')
        ).getTime();
        if (factual <= fini) {
          this.utils.Toast('La fecha de inicio debe ser menor a la actual', 2);
          return false;
        } else if (fini >= ffin) {
          this.utils.Toast('La fecha de fin debe ser mayor a la de inicio', 2);
          return false;
        }
      }
    }
    this.savingColegio = true;
    this.error = null;
    if (this.id >= 0) {
      const data = JSON.parse(JSON.stringify(this.formDataColegio.value));
      data.Fechaini = moment(this.formDataColegio.value.Fechaini).format(
        'YYYY-MM-DD'
      );
      data.Fechafin = moment(this.formDataColegio.value.Fechafin).format(
        'YYYY-MM-DD'
      );
      this.utils
        .httpPUT('/UpdateColegio?id=' + this.id, data)
        .then((res) => {
          if (res) {
            this.error = res;
            this.utils.Toast(this.error, 2);
            this.savingColegio = false;
          } else {
            this.showModalColegio = false;
            this.savingColegio = false;
            data.Id = this.id;
            data.Nivelestudio = this.nivelColegios.find(
              (x) => x.Id == data.Idnivelestudio
            ).Descripcion;
            data.Pais = this.paises.find((x) => x.Id == data.Idpais).Nombre;
            this.colegios[this.index] = data;
            this.utils.Toast('Datos guardados correctamente.', 1);
          }
        })
        .catch((err) => {
          this.utils.Toast(err, 2);
          this.savingColegio = false;
        });
    } else {
      const data = JSON.parse(JSON.stringify(this.formDataColegio.value));
      data.Fechaini = moment(this.formDataColegio.value.Fechaini).format(
        'YYYY-MM-DD'
      );
      data.Fechafin = moment(this.formDataColegio.value.Fechafin).format(
        'YYYY-MM-DD'
      );
      this.utils
        .httpPOST('/SaveColegio', data)
        .then((res) => {
          if (res.error) {
            this.error = res.error;
            this.utils.Toast(this.error, 2);
            this.savingColegio = false;
          } else {
            data.Id = res.obj.Id;
            data.Nivelestudio = this.nivelColegios.find(
              (x) => x.Id == data.Idnivelestudio
            ).Descripcion;
            data.Pais = this.paises.find((x) => x.Id == data.Idpais).Nombre;
            this.colegios.push(data);
            this.showModalColegio = false;
            this.savingColegio = false;
            this.utils.Toast('Datos guardados correctamente.', 1);
          }
        })
        .catch((err) => {
          this.utils.Toast(err, 2);
          this.savingColegio = false;
        });
    }
  }
  showModalDeleteColegio(i, data) {
    this.index = i;
    this.id = data.Id;
    this.showModalBorrarColegio = true;
  }
  deleteColegio() {
    this.deletingColegio = true;
    this.utils
      .httpDelete('DeleteColegio?id=' + this.id)
      .then((res) => {
        if (res) {
          this.error = res;
          this.utils.Toast(this.error, 2);
        } else {
          this.utils.Toast('Datos borrados correctamente.', 1);
          this.showModalBorrarColegio = false;
          this.deletingColegio = false;
          this.colegios.splice(this.index, 1);
        }
      })
      .catch((err) => {
        this.utils.Toast(err, 2);
        this.showModalBorrarColegio = false;
        this.deletingColegio = false;
      });
  }
  getColegios() {
    this.utils
      .httpGET('GetColegios', { id: this.user.userData.Id })
      .then((data) => {
        this.colegios = data.filter((x) => x.Estado == 1);
      });
  }

  showModalNewSuperior() {
    this.id = -1;
    this.index = -1;
    this.showModalSuperior = true;
    this.formDataSuperior.patchValue({
      Institucion: '',
      Descripcion: '',
      Ciudad: '',
      Fechaini: null,
      Fechafin: null,
      Idnivelsuperior: null,
      Idpais: null,
      Actual: false,
      Idpersona: this.user.userData.Id,
    });
  }
  showModalEditSuperior(i, data) {
    this.id = data.Id;
    this.index = i;
    let fechaFin = moment(data.Fechafin).format('YYYY-MM-DD');
    if (fechaFin == moment('0001-01-01T00:00:00').format('YYYY-MM-DD')) {
      fechaFin = null;
    }
    this.showModalSuperior = true;
    this.formDataSuperior.patchValue({
      Institucion: data.Institucion,
      Descripcion: data.Descripcion,
      Ciudad: data.Ciudad,
      Fechaini: moment(data.Fechaini).format('YYYY-MM-DD'),
      Fechafin: fechaFin,
      Idnivelsuperior: data.Idnivelsuperior,
      Idpais: data.Idpais,
      Actual: data.Actual,
      Idpersona: this.user.userData.Id,
    });
  }

  async saveSuperior() {
    let fechaFin = null;
    if (!this.formDataSuperior.valid) {
      return false;
    }
    if (!this.formDataSuperior.value.Actual) {
      fechaFin = moment(
        this.formDataSuperior.value.Fechafin,
        'YYYY-MM-DD',
        true
      );
      if (!fechaFin.isValid()) {
        this.utils.Toast('La fecha fin no es fecha valida', 2);
        return false;
      } else {
        let factual = new Date().getTime();
        let fini = new Date(
          moment(this.formDataSuperior.value.Fechaini).format('YYYY-MM-DD')
        ).getTime();
        let ffin = new Date(
          moment(this.formDataSuperior.value.Fechafin).format('YYYY-MM-DD')
        ).getTime();
        if (factual <= fini) {
          this.utils.Toast('La fecha de inicio debe ser menor a la actual', 2);
          return false;
        } else if (fini >= ffin) {
          this.utils.Toast('La fecha de fin debe ser mayor a la de inicio', 2);
          return false;
        }
      }
    }
    this.savingSuperior = true;
    this.error = null;
    if (this.id >= 0) {
      const data = JSON.parse(JSON.stringify(this.formDataSuperior.value));
      data.Fechaini = moment(this.formDataSuperior.value.Fechaini).format(
        'YYYY-MM-DD'
      );
      if (data.Fechafin) {
        data.Fechafin = moment(this.formDataSuperior.value.Fechafin).format(
          'YYYY-MM-DD'
        );
      }
      console.log(data);
      this.utils
        .httpPUT('/UpdateSuperior?id=' + this.id, data)
        .then((res) => {
          if (res) {
            this.error = res;
            this.utils.Toast(this.error, 2);
            this.savingSuperior = false;
          } else {
            this.showModalSuperior = false;
            this.savingSuperior = false;
            data.Id = this.id;
            data.Nivelsuperior = this.nivelSuperiores.find(
              (x) => x.Id == data.Idnivelsuperior
            ).Descripcion;
            data.Pais = this.paises.find((x) => x.Id == data.Idpais).Nombre;
            this.superiores[this.index] = data;
            this.utils.Toast('Datos guardados correctamente.', 1);
          }
        })
        .catch((err) => {
          this.utils.Toast(err, 2);
          this.savingSuperior = false;
        });
    } else {
      const data = JSON.parse(JSON.stringify(this.formDataSuperior.value));
      data.Fechaini = moment(this.formDataSuperior.value.Fechaini).format(
        'YYYY-MM-DD'
      );
      if (data.Fechafin) {
        data.Fechafin = moment(this.formDataSuperior.value.Fechafin).format(
          'YYYY-MM-DD'
        );
      }
      this.utils
        .httpPOST('/SaveSuperior', data)
        .then((res) => {
          if (res.error) {
            this.error = res.error;
            this.utils.Toast(this.error, 2);
            this.savingSuperior = false;
          } else {
            data.Id = res.obj.Id;
            data.Nivelsuperior = this.nivelSuperiores.find(
              (x) => x.Id == data.Idnivelsuperior
            ).Descripcion;
            data.Pais = this.paises.find((x) => x.Id == data.Idpais).Nombre;
            this.superiores.push(data);
            this.showModalSuperior = false;
            this.savingSuperior = false;
            this.utils.Toast('Datos guardados correctamente.', 1);
          }
        })
        .catch((err) => {
          this.utils.Toast(err, 2);
          this.savingSuperior = false;
        });
    }
  }
  showModalDeleteSuperior(i, data) {
    this.index = i;
    this.id = data.Id;
    this.showModalBorrarSuperior = true;
  }
  deleteSuperior() {
    this.deletingSuperior = true;
    this.utils
      .httpDelete('DeleteSuperior?id=' + this.id)
      .then((res) => {
        if (res) {
          this.error = res;
          this.utils.Toast(this.error, 2);
        } else {
          this.utils.Toast('Datos borrados correctamente.', 1);
          this.showModalBorrarSuperior = false;
          this.deletingSuperior = false;
          this.superiores.splice(this.index, 1);
        }
      })
      .catch((err) => {
        this.utils.Toast(err, 2);
        this.showModalBorrarSuperior = false;
        this.deletingSuperior = false;
      });
  }
  getSuperiores() {
    this.utils
      .httpGET('GetSuperiores', { id: this.user.userData.Id })
      .then((data) => {
        this.superiores = data.filter((x) => x.Estado == 1);
        console.log(this.superiores);
      });
  }
  getNivelEstudios() {
    this.utils
      .httpGET('GetNivelEstudio', { id: this.user.userData.Id })
      .then((data) => {
        this.nivelColegios = data.filter((x) => x.Estado == 1);
        console.log(this.nivelColegios);
      });
  }
  getNivelSuperiores() {
    this.utils
      .httpGET('GetNivelSuperior', { id: this.user.userData.Id })
      .then((data) => {
        this.nivelSuperiores = data.filter((x) => x.Estado == 1);
        console.log(this.nivelSuperiores);
      });
  }
  getPaises() {
    this.utils.httpGET('Pais').then((data: any[]) => {
      this.paises = data;
    });
  }
  showModalNewIdioma() {
    this.id = -1;
    this.index = -1;
    this.showModalIdioma = true;
    this.formDataIdioma.patchValue({
      Ididioma: null,
      Idescrito: null,
      Idoral: null,
      Idlectura: null,
      Idpersona: this.user.userData.Id,
    });
  }
  showModalEditIdioma(i, data) {
    this.id = data.Id;
    this.index = i;
    this.showModalIdioma = true;
    console.log(data);
    this.formDataIdioma.patchValue({
      Ididioma: data.Ididioma,
      Idescrito: data.Idescrito,
      Idoral: data.Idoral,
      Idlectura: data.Idlectura,
      Idpersona: this.user.userData.Id,
    });
  }
  showModalDeleteIdioma(i, data) {
    this.index = i;
    this.id = data.Id;
    this.showModalBorrarIdioma = true;
  }
  deleteIdioma() {
    this.deletingIdioma = true;
    this.utils
      .httpDelete('DeleteIdioma?id=' + this.id)
      .then((res) => {
        if (res) {
          this.error = res;
          this.utils.Toast(this.error, 2);
        } else {
          this.utils.Toast('Datos borrados correctamente.', 1);
          this.showModalBorrarIdioma = false;
          this.deletingIdioma = false;
          this.idiomas.splice(this.index, 1);
        }
      })
      .catch((err) => {
        this.utils.Toast(err, 2);
        this.showModalBorrarIdioma = false;
        this.deletingIdioma = false;
      });
  }
  async saveIdioma() {
    if (!this.formDataIdioma.valid) {
      return false;
    }
    this.savingIdioma = true;
    this.error = null;
    if (this.id >= 0) {
      const data = JSON.parse(JSON.stringify(this.formDataIdioma.value));
      this.utils
        .httpPUT('/UpdateIdioma?id=' + this.id, data)
        .then((res) => {
          if (res) {
            this.error = res;
            this.utils.Toast(this.error, 2);
            this.savingIdioma = false;
          } else {
            this.showModalIdioma = false;
            this.savingIdioma = false;
            data.Id = this.id;
            data.Escrito = this.nivelIdiomas.find(
              (x) => x.Id == data.Idescrito
            ).Descripcion;
            data.Lectura = this.nivelIdiomas.find(
              (x) => x.Id == data.Idlectura
            ).Descripcion;
            data.Oral = this.nivelIdiomas.find(
              (x) => x.Id == data.Idoral
            ).Descripcion;
            data.Idioma = this.idiomasAll.find(
              (x) => x.Id == data.Ididioma
            ).Nombre;
            this.idiomas[this.index] = data;
            this.utils.Toast('Datos guardados correctamente.', 1);
          }
        })
        .catch((err) => {
          this.utils.Toast(err, 2);
          this.savingIdioma = false;
        });
    } else {
      const data = JSON.parse(JSON.stringify(this.formDataIdioma.value));
      console.log(data);
      this.utils
        .httpPOST('/SaveIdioma', data)
        .then((res) => {
          if (res.error) {
            this.error = res.error;
            this.utils.Toast(this.error, 2);
            this.savingIdioma = false;
          } else {
            data.Id = res.obj.Id;
            data.Escrito = this.nivelIdiomas.find(
              (x) => x.Id == data.Idescrito
            ).Descripcion;
            data.Lectura = this.nivelIdiomas.find(
              (x) => x.Id == data.Idlectura
            ).Descripcion;
            data.Oral = this.nivelIdiomas.find(
              (x) => x.Id == data.Idoral
            ).Descripcion;
            data.Idioma = this.idiomasAll.find(
              (x) => x.Id == data.Ididioma
            ).Nombre;
            this.idiomas.push(data);
            this.showModalIdioma = false;
            this.savingIdioma = false;
            this.utils.Toast('Datos guardados correctamente.', 1);
          }
        })
        .catch((err) => {
          this.utils.Toast(err, 2);
          this.savingIdioma = false;
        });
    }
  }
  getIdiomas() {
    this.utils
      .httpGET('GetIdiomas', { id: this.user.userData.Id })
      .then((data) => {
        this.idiomas = data.filter((x) => x.Estado == 1);
        console.log(this.idiomas);
      });
  }
  getIdiomasAll() {
    this.utils.httpGET('GetIdiomasAll').then((data) => {
      this.idiomasAll = data.filter((x) => x.Estado == 1);
    });
  }
  getNivelIdiomas() {
    this.utils.httpGET('GetNivelIdioma').then((data) => {
      this.nivelIdiomas = data.filter((x) => x.Estado == 1);
    });
  }
  next() {
    this.changeTab.emit({ tab: 4 });
  }
  back() {
    this.changeTab.emit({ tab: 2 });
  }
}
