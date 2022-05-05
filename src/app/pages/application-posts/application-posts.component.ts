import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-application-posts',
  templateUrl: './application-posts.component.html',
  styleUrls: ['./application-posts.component.scss'],
})
export class ApplicationPostsComponent
  implements AfterViewInit, OnDestroy, OnInit
{
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject<any>();
  loading: boolean;
  postulaciones: any[] = [];
  aplicaciones: any[] = [];
  experiencias: any[] = [];
  superiores: any[] = [];
  showModalApplications: boolean;
  showModalCurriculum: boolean;
  persona: any;
  showConfirmApprove: boolean;
  showConfirmCancel: boolean;
  postulacion: any;
  idPostulacionMateria: any;
  experiencia: number;
  nota: number;
  mensaje: string;
  Fechainicio: any = moment();
  Fechafin: any = moment();
  FechaActual: any = moment();
  Estado: any;
  constructor(private utils: UtilsService) {}

  ngOnInit(): void {
    this.showModalApplications = false;
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
        { width: '10%' },
        { width: '30%' },
        { width: '30%' },
        { width: '10%' },
        { width: '5%' },
        { width: '5%' },
        { width: '10%' },
      ],
    };
    this.UpdateTable();
  }
  UpdateTable() {
    this.getPostulacionesMaterias();
  }
  getPostulacionesMaterias() {
    this.loading = true;
    this.utils
      .httpGET(
        'GetPostulacionDetalle?fechafin=' +
          this.Fechafin
      )
      .then((data: any) => {
        if (this.Estado == 'Pendiente') {
          this.postulaciones = data.filter(
            (x) =>
              x.Pendiente > 0 ||
              (x.Cantidad == 0 &&
                new Date(x.Fechapostulacion).getTime() >=
                  new Date(this.FechaActual).getTime())
          );
        }
        if (this.Estado == 'Todos') {
          this.postulaciones = data;
        }
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
  showApplications(item) {
    this.showModalApplications = true;
    this.utils
      .httpGET('GetListaDocentes?id=' + item.Iddetallemateria)
      .then((data: any) => {
        this.aplicaciones = data;
      });
  }
  showCurriculum(item) {
    this.persona = item;
    this.showModalCurriculum = true;
    this.getExperincias(item.Id);
    this.getSuperiores(item.Id);
    this.getPersonal(item.Id);
  }
  getExperincias(id) {
    this.utils.httpGET('GetExperiencias', { id: id }).then((data) => {
      console.log(data);
      this.experiencias = data.filter((x) => x.Estado == 1);
    });
  }
  getSuperiores(id) {
    this.utils.httpGET('GetSuperiores', { id: id }).then((data) => {
      this.superiores = data.filter((x) => x.Estado == 1);
    });
  }
  getPersonal(id) {
    this.utils.httpGET('persona/' + id).then((data: any) => {
      this.experiencia = data.Experiencia;
    });
  }
  preApprove(item) {
    this.nota = null;
    this.postulacion = item;
    this.showConfirmApprove = true;
  }
  preCancel(item) {
    this.postulacion = item;
    this.showConfirmCancel = true;
  }
  approve() {
    if (this.nota >= 70 && this.nota <= 100) {
      this.postulacion.Estadopostulacionmateria = 2;
      this.utils
        .httpPUT(
          '/UpdateEstadoPostulacion?Estado=2&Id=' +
            this.postulacion.Idpostulacionmateria +
            '&Nota=' +
            this.nota +
            '&Msj=',
          null
        )
        .then((res) => {
          console.log(res);
          if (res != '') {
            console.log('error al guardar');
          } else {
            this.UpdateTable();
            this.showConfirmApprove = false;
          }
        })
        .catch((err) => {
          this.utils.Toast('Error comuniquese con el administrador', 3);
          console.log(err);
        });
    } else {
      this.utils.Toast(
        'La nota de aprobación debe estar entre 70 a 100 puntos',
        3
      );
    }
  }
  cancel() {
    this.postulacion.Estadopostulacionmateria = 3;
    const data = {
      Id: this.idPostulacionMateria,
      Estado: 3,
    };
    this.utils
      .httpPUT(
        '/UpdateEstadoPostulacion?Estado=3&Id=' +
          this.postulacion.Idpostulacionmateria +
          '&Nota=0&Msj=' +
          this.mensaje,
        null
      )
      .then((res) => {
        console.log(res);
        if (res != '') {
          console.log('error al guardar');
        } else {
          this.UpdateTable();
          this.showConfirmCancel = false;
        }
      })
      .catch((err) => {
        this.utils.Toast('Error comuniquese con el administrador', 3);
        console.log(err);
      });
  }
}
