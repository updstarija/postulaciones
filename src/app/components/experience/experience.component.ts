import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { AuthService } from 'src/app/services/auth.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss'],
})
export class ExperienceComponent implements OnInit {
  loading: boolean;
  savingExperiencia: boolean;
  error: string;
  showModalExperiencia: boolean;
  formDataExperiencia: FormGroup;
  showModalBorrarExperiencia: boolean;
  deletingExperiencia: boolean;
  btnExperiencia: string;
  id: number = -1;
  experiencias: any[];
  index: number = -1;
  habilidades: any[];
  formDataHabilidad: FormGroup;
  showModalHabilidad: boolean;
  savingHabilidad: boolean;
  showModalBorrarHabilidad: boolean;
  deletingHabilidad: boolean;
  referencias: any[];
  formDataReferencia: FormGroup;
  showModalReferencia: boolean;
  savingReferencia: boolean;
  showModalBorrarReferencia: boolean;
  deletingReferencia: boolean;
  saving_next: boolean;
  formDataExperienciaGlobal: FormGroup;

  @Output() public changeTab = new EventEmitter<{ tab: number }>();
  constructor(private user: AuthService, private utils: UtilsService) {
    this.formDataExperiencia = new FormGroup({
      Empresa: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(150),
      ]),
      Cargo: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ]),
      Descripcion: new FormControl('', [
        Validators.required,
        Validators.maxLength(500),
      ]),
      Fechaini: new FormControl(new Date(), [Validators.required]),
      Fechafin: new FormControl(new Date()),
      Actual: new FormControl(false),
      Idpersona: new FormControl(null),
    });
    this.formDataHabilidad = new FormGroup({
      Descripcion: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      Experiencia: new FormControl(null, Validators.required),
      Idpersona: new FormControl(null),
    });
    this.formDataReferencia = new FormGroup({
      Empresa: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ]),
      Nombre: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ]),
      Telefono: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ]),
      Idpersona: new FormControl(null),
    });
    this.formDataExperienciaGlobal = new FormGroup({
      Experiencia: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.showModalExperiencia = false;
    this.experiencias = [];
    this.getExperincias();
    this.getHabilidades();
    this.getReferencias();
    this.utils.httpGET('persona/' + this.user.userData.Id).then((data: any) => {
      this.formDataExperienciaGlobal.patchValue({
        Experiencia: data.Experiencia || '',
      });
    });
  }

  showModalNew() {
    this.id = -1;
    this.index = -1;
    this.showModalExperiencia = true;
    this.formDataExperiencia.patchValue({
      Empresa: '',
      Cargo: '',
      Descripcion: '',
      Fechaini: null,
      Fechafin: null,
      Actual: false,
      Idpersona: this.user.userData.Id,
    });
  }
  showModalEdit(i, data) {
    this.id = data.Id;
    this.index = i;
    let fechaFin = moment(data.Fechafin).format('YYYY-MM-DD');
    if (fechaFin == moment('0001-01-01T00:00:00').format('YYYY-MM-DD')) {
      fechaFin = null;
    }
    this.showModalExperiencia = true;
    this.formDataExperiencia.patchValue({
      Empresa: data.Empresa,
      Cargo: data.Cargo,
      Descripcion: data.Descripcion,
      Fechaini: moment(data.Fechaini).format('YYYY-MM-DD'),
      Fechafin: fechaFin,
      Actual: data.Actual,
      Idpersona: this.user.userData.Id,
    });
  }

  async saveExperiencia() {
    let fechaFin = null;
    if (!this.formDataExperiencia.valid) {
      return false;
    }
    if (!this.formDataExperiencia.value.Actual) {
      fechaFin = moment(
        this.formDataExperiencia.value.Fechafin,
        'YYYY-MM-DD',
        true
      );
      if (!fechaFin.isValid()) {
        this.utils.Toast('La fecha fin no es fecha valida', 2);
        return false;
      } else {
        let factual = new Date().getTime();
        let fini = new Date(
          moment(this.formDataExperiencia.value.Fechaini).format('YYYY-MM-DD')
        ).getTime();
        let ffin = new Date(
          moment(this.formDataExperiencia.value.Fechafin).format('YYYY-MM-DD')
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
    this.savingExperiencia = true;
    this.error = null;
    if (this.id >= 0) {
      const data = JSON.parse(JSON.stringify(this.formDataExperiencia.value));
      data.Fechaini = moment(this.formDataExperiencia.value.Fechaini).format(
        'YYYY-MM-DD'
      );
      if (data.Fechafin) {
        data.Fechafin = moment(this.formDataExperiencia.value.Fechafin).format(
          'YYYY-MM-DD'
        );
      }
      this.utils
        .httpPUT('/UpdateExperiencia?id=' + this.id, data)
        .then((res) => {
          if (res) {
            this.error = res;
            this.utils.Toast(this.error, 2);
            this.savingExperiencia = false;
          } else {
            this.utils.Toast('Datos guardados correctamente.', 1);
            this.showModalExperiencia = false;
            this.savingExperiencia = false;
            data.Id = this.id;
            this.experiencias[this.index] = data;
          }
        })
        .catch((err) => {
          this.utils.Toast(err, 2);
          this.savingExperiencia = false;
        });
    } else {
      const data = JSON.parse(JSON.stringify(this.formDataExperiencia.value));
      data.Fechaini = moment(this.formDataExperiencia.value.Fechaini).format(
        'YYYY-MM-DD'
      );
      if (data.Fechafin) {
        data.Fechafin = moment(this.formDataExperiencia.value.Fechafin).format(
          'YYYY-MM-DD'
        );
      }
      this.utils
        .httpPOST('/SaveExperiencia', data)
        .then((res) => {
          if (res.error) {
            this.error = res.error;
            this.utils.Toast(this.error, 2);
            this.savingExperiencia = false;
          } else {
            data.Id = res.obj.Id;
            this.experiencias.push(data);
            this.showModalExperiencia = false;
            this.savingExperiencia = false;
            this.utils.Toast('Datos guardados correctamente.', 1);
          }
        })
        .catch((err) => {
          this.utils.Toast(err, 2);
          this.savingExperiencia = false;
        });
    }
  }
  showModalDelete(i, data) {
    this.index = i;
    this.id = data.Id;
    this.showModalBorrarExperiencia = true;
  }
  deleteExperiencia() {
    this.deletingExperiencia = true;
    this.utils
      .httpDelete('DeleteExperiencia?id=' + this.id)
      .then((res) => {
        if (res) {
          this.error = res;
          this.utils.Toast(this.error, 2);
        } else {
          this.utils.Toast('Datos borrados correctamente.', 1);
          this.showModalBorrarExperiencia = false;
          this.deletingExperiencia = false;
          this.experiencias.splice(this.index, 1);
        }
      })
      .catch((err) => {
        this.utils.Toast(err, 2);
        this.showModalBorrarExperiencia = false;
        this.deletingExperiencia = false;
      });
  }
  getExperincias() {
    this.utils
      .httpGET('GetExperiencias', { id: this.user.userData.Id })
      .then((data) => {
        this.experiencias = data.filter((x) => x.Estado == 1);
      });
  }
  showModalNewHabilidad() {
    this.id = -1;
    this.index = -1;
    this.showModalHabilidad = true;
    this.formDataHabilidad.patchValue({
      Descripcion: '',
      Experiencia: '',
      Idpersona: this.user.userData.Id,
    });
  }
  showModalEditHabilidad(i, data) {
    this.id = data.Id;
    this.index = i;
    this.showModalHabilidad = true;
    this.formDataHabilidad.patchValue({
      Descripcion: data.Descripcion,
      Experiencia: data.Experiencia,
      Idpersona: this.user.userData.Id,
    });
  }
  showModalDeleteHabilidad(i, data) {
    this.index = i;
    this.id = data.Id;
    this.showModalBorrarHabilidad = true;
  }
  deleteHabilidad() {
    this.deletingHabilidad = true;
    this.utils
      .httpDelete('DeleteHabilidad?id=' + this.id)
      .then((res) => {
        if (res) {
          this.error = res;
          this.utils.Toast(this.error, 2);
        } else {
          this.utils.Toast('Datos borrados correctamente.', 1);
          this.showModalBorrarHabilidad = false;
          this.deletingHabilidad = false;
          this.habilidades.splice(this.index, 1);
        }
      })
      .catch((err) => {
        this.utils.Toast(err, 2);
        this.showModalBorrarHabilidad = false;
        this.deletingHabilidad = false;
      });
  }
  async saveHabilidad() {
    if (!this.formDataHabilidad.valid) {
      return false;
    }
    this.savingHabilidad = true;
    this.error = null;
    if (this.id >= 0) {
      const data = JSON.parse(JSON.stringify(this.formDataHabilidad.value));
      this.utils
        .httpPUT('/UpdateHabilidad?id=' + this.id, data)
        .then((res) => {
          if (res) {
            this.error = res;
            this.utils.Toast(this.error, 2);
            this.savingHabilidad = false;
          } else {
            this.utils.Toast('Datos guardados correctamente.', 1);
            this.showModalHabilidad = false;
            this.savingHabilidad = false;
            data.Id = this.id;
            this.habilidades[this.index] = data;
          }
        })
        .catch((err) => {
          this.utils.Toast(err, 2);
          this.savingHabilidad = false;
        });
    } else {
      const data = JSON.parse(JSON.stringify(this.formDataHabilidad.value));
      this.utils
        .httpPOST('/SaveHabilidad', data)
        .then((res) => {
          this.savingHabilidad = false;
          if (res.error) {
            this.error = res.error;
            this.utils.Toast(this.error, 2);
            this.savingHabilidad = false;
          } else {
            data.Id = res.obj.Id;
            this.habilidades.push(data);
            this.showModalHabilidad = false;
            this.savingHabilidad = false;
            this.utils.Toast('Datos guardados correctamente.', 1);
          }
        })
        .catch((err) => {
          this.utils.Toast(err, 2);
          this.savingHabilidad = false;
        });
    }
  }
  getHabilidades() {
    this.utils
      .httpGET('GetHabilidades', { id: this.user.userData.Id })
      .then((data) => {
        console.log(data);
        this.habilidades = data.filter((x) => x.Estado == 1);
      });
  }
  showModalNewReferencia() {
    this.id = -1;
    this.index = -1;
    this.showModalReferencia = true;
    this.formDataReferencia.patchValue({
      Empresa: '',
      Nombre: '',
      Telefono: '',
      Idpersona: this.user.userData.Id,
    });
  }
  showModalEditReferencia(i, data) {
    this.id = data.Id;
    this.index = i;
    this.showModalReferencia = true;
    this.formDataReferencia.patchValue({
      Empresa: data.Empresa,
      Nombre: data.Nombre,
      Telefono: data.Telefono,
      Idpersona: this.user.userData.Id,
    });
  }
  showModalDeleteReferencia(i, data) {
    this.index = i;
    this.id = data.Id;
    this.showModalBorrarReferencia = true;
  }
  deleteReferencia() {
    this.deletingReferencia = true;
    this.utils
      .httpDelete('DeleteReferencia?id=' + this.id)
      .then((res) => {
        if (res) {
          this.error = res;
          this.utils.Toast(this.error, 2);
        } else {
          this.utils.Toast('Datos borrados correctamente.', 1);
          this.showModalBorrarReferencia = false;
          this.deletingReferencia = false;
          this.referencias.splice(this.index, 1);
        }
      })
      .catch((err) => {
        this.utils.Toast(err, 2);
        this.showModalBorrarReferencia = false;
        this.deletingReferencia = false;
      });
  }
  async saveReferencia() {
    if (!this.formDataReferencia.valid) {
      return false;
    }
    this.savingReferencia = true;
    this.error = null;
    if (this.id >= 0) {
      const data = JSON.parse(JSON.stringify(this.formDataReferencia.value));
      this.utils
        .httpPUT('/UpdateReferencia?id=' + this.id, data)
        .then((res) => {
          if (res) {
            this.error = res;
            this.utils.Toast(this.error, 2);
            this.savingReferencia = false;
          } else {
            this.utils.Toast('Datos guardados correctamente.', 1);
            this.showModalReferencia = false;
            this.savingReferencia = false;
            data.Id = this.id;
            this.referencias[this.index] = data;
          }
        })
        .catch((err) => {
          this.utils.Toast(err, 2);
          this.savingReferencia = false;
        });
    } else {
      const data = JSON.parse(JSON.stringify(this.formDataReferencia.value));
      this.utils
        .httpPOST('/SaveReferencia', data)
        .then((res) => {
          this.savingReferencia = false;
          if (res.error) {
            this.error = res.error;
            this.utils.Toast(this.error, 2);
            this.savingReferencia = false;
          } else {
            data.Id = res.obj.Id;
            this.referencias.push(data);
            this.showModalReferencia = false;
            this.savingReferencia = false;
            this.utils.Toast('Datos guardados correctamente.', 1);
          }
        })
        .catch((err) => {
          this.utils.Toast(err, 2);
          this.savingReferencia = false;
        });
    }
  }
  getReferencias() {
    this.utils
      .httpGET('GetReferencias', { id: this.user.userData.Id })
      .then((data) => {
        console.log(data);
        this.referencias = data.filter((x) => x.Estado == 1);
      });
  }
  next() {
    this.saving_next = true;
    const data = JSON.parse(
      JSON.stringify(this.formDataExperienciaGlobal.value)
    );
    this.utils
      .httpPUT(
        '/UpdatePersonaExperiencia?id=' +
          this.user.userData.Id +
          '&experiencia=' +
          data.Experiencia,
        null
      )
      .then((res) => {
        if (res) {
          this.error = res;
          console.log(this.error);
          this.saving_next = false;
        } else {
          this.changeTab.emit({ tab: 3 });
          this.saving_next = false;
        }
      })
      .catch((err) => {
        console.log(err);
        this.saving_next = false;
      });
  }
  back() {
    this.changeTab.emit({ tab: 1 });
  }
}
