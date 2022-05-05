import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as moment from 'moment';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-tracing-post',
  templateUrl: './tracing-post.component.html',
  styleUrls: ['./tracing-post.component.scss'],
})
export class TracingPostComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject<any>();
  loading: boolean;
  postulaciones: any[] = [];
  showProgramarEntrevista: boolean;
  Fechaentrevista: any;
  showProgramarHabilitacion: boolean;
  Fechahabilitacion: any;
  showEvaluar: any;
  Notaacademica: any;
  Notatecnica: any;
  saving: boolean;
  id: any;
  userData: any;
  showObservar: boolean;
  tipoObservacion: any;
  observacion: any;
  Fechainicio: any = moment();
  Fechafin: any = moment();
  FechaActual: any = moment();
  Estado: any;
  showDetalleObservacion: boolean;

  constructor(private utils: UtilsService, private user: AuthService) {}

  ngOnInit(): void {
    this.userData = this.user.userData;
    this.Fechainicio = moment(new Date())
      .add('months', -5)
      .format('yyyy-MM-DD');
    this.Fechafin = moment(new Date()).format('yyyy-MM-DD');
    this.Estado = 'Pendiente';
    this.FechaActual = moment(new Date()).format('yyyy-MM-DD');
    this.loadTable();
  }
  loadTable() {
    this.loading = true;

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [5, 10, 25, 50, 100],
      processing: true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json',
      },
      responsive: true,
      columns: [
        { width: '5%' },
        { width: '15%' },
        { width: '15%' },
        { width: '5%' },
        { width: '10%' },
        { width: '10%' },
        { width: '5%' },
        { width: '5%' },
        { width: '5%' },
      ],
    };
    this.UpdateTable();
  }
  UpdateTable() {
    if (this.userData.Idrol == 1) {
      this.getPostulacionesMateriasAdmin();
    }
    if (this.userData.Idrol == 4) {
      this.getPostulacionesMateriasJefeCarrera();
    }
  }
  getPostulacionesMateriasAdmin() {
    var estado = 1;
    switch (this.Estado) {
      case 'Pendiente':
        estado = 1;
        break;
      case 'Aprobado':
        estado = 2;
        break;
      case 'Reprobado':
        estado = 3;
        break;
      case 'Observado':
        estado = 4;
        break;
    }
    this.loading = true;
    this.utils
      .httpGET(
        'GetSeguimientos?fechaini=' +
          this.Fechainicio +
          '&fechafin=' +
          this.Fechafin +
          '&estado=' +
          estado
      )
      .then((data: any) => {
        this.postulaciones = data;
        this.loading = false;
        this.rerender();
      });
  }
  getPostulacionesMateriasJefeCarrera() {
    var estado = 1;
    switch (this.Estado) {
      case 'Pendiente':
        estado = 1;
        break;
      case 'Aprobado':
        estado = 2;
        break;
      case 'Reprobado':
        estado = 3;
        break;
      case 'Observado':
        estado = 4;
        break;
    }
    this.loading = true;
    this.utils
      .httpGET(
        'GetSeguimientos?fechaini=' +
          this.Fechainicio +
          '&fechafin=' +
          this.Fechafin +
          '&estado=' +
          estado
      )
      .then((data: any) => {
        this.postulaciones = data.filter(
          (x) => x.Idfacultad == this.userData.Idfacultad
        );
        this.loading = false;
        this.rerender();
      });
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  ngOnDestroy(): void {
    if (this.dtTrigger) {
      // this.dtTrigger.unsubscribe();
    }
  }
  preProgramarEntrevista(item) {
    this.Fechaentrevista = null;
    this.showProgramarEntrevista = true;
    this.id = item.Id;
  }
  programarEntrevista() {
    this.saving = true;
    let obj = {
      Id: this.id,
      Fechaentrevista: this.Fechaentrevista,
    };
    console.log(obj);
    this.utils.httpPOSTJSON('ProgramarEntrevista', obj).then((data) => {
      if (data.error != '') {
        this.utils.Toast(data.error, 2);
        this.saving = false;
      } else {
        this.utils.Toast('Se programó la entrevista exitosamente', 1);
        this.showProgramarEntrevista = false;
        this.saving = false;
        this.UpdateTable();
      }
    });
  }
  preProgramarHabilitacion(item) {
    this.Fechahabilitacion = null;
    this.showProgramarHabilitacion = true;
    this.id = item.Id;
  }
  programarHabilitacion() {
    this.saving = true;
    let obj = {
      Id: this.id,
      Fechahabilitacion: this.Fechahabilitacion,
    };
    this.utils.httpPOSTJSON('ProgramarHabilitacion', obj).then((data) => {
      if (data.error != '') {
        this.utils.Toast(data.error, 2);
        this.saving = false;
      } else {
        this.utils.Toast('Se programó la habilitación exitosamente', 1);
        this.showProgramarHabilitacion = false;
        this.saving = false;
        this.UpdateTable();
      }
    });
  }
  preevaluarHabilitacion(item) {
    this.showEvaluar = true;
    this.id = item.Id;
    this.Notaacademica = null;
    this.Notatecnica = null;
  }
  evaluarHabilitacion() {
    if (
      this.Notaacademica >= 0 &&
      this.Notaacademica <= 100 &&
      this.Notatecnica >= 0 &&
      this.Notatecnica <= 100
    ) {
      this.saving = true;
      let obj = {
        Id: this.id,
        Notaacademica: this.Notaacademica,
        Notatecnica: this.Notatecnica,
      };
      this.utils.httpPOSTJSON('EvaluarSeguimiento', obj).then((data) => {
        if (data.error != '') {
          this.utils.Toast(data.error, 2);
          this.saving = false;
        } else {
          this.utils.Toast(
            'Se registro las notas de habilitación exitosamente',
            1
          );
          this.showEvaluar = false;
          this.saving = false;
          this.UpdateTable();
        }
      });
    } else {
      this.utils.Toast('Las notas debe estar en un rango de 0 a 100 puntos', 2);
    }
  }
  preObservar(item) {
    this.showObservar = true;
    this.id = item.Id;
    this.tipoObservacion = null;
    this.observacion = null;
  }
  observar() {
    this.saving = true;
    let obj = {
      Id: this.id,
      Observacion: this.observacion,
      Tipoobservacion: this.tipoObservacion,
    };
    console.log(obj);
    this.utils.httpPOSTJSON('ObservarSeguimiento', obj).then((data) => {
      if (data.error != '') {
        this.utils.Toast(data.error, 2);
        this.saving = false;
      } else {
        this.utils.Toast('Se observo la postulación exitosamente', 1);
        this.showObservar = false;
        this.saving = false;
        this.UpdateTable();
      }
    });
  }
  verDetalle(item) {
    this.showDetalleObservacion = true;
    this.tipoObservacion = item.Tipoobservacion;
    this.observacion = item.Observacion;
  }
}
