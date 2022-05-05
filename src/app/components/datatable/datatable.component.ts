import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { toast } from 'bulma-toast';
import { ItemComponent } from '../item/item.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss'],
})
export class DatatableComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject<any>();
  postulaciones: any;
  facultades: any;
  postulacion: any;
  materias: any;
  loading: boolean;
  showModal: boolean;
  showMenu: boolean;
  showTabla: boolean;
  showConfirm: boolean;
  showSelect: boolean;
  buscar: string = '';
  descripcion: string = '';
  Listamaterias = [];
  saving: boolean;
  formData: FormGroup;
  error: string = '';
  Idpostulacion: any;
  public usuario: any;
  Fechainicio: any = moment();
  Fechafin: any = moment();
  FechaActual: any = moment();
  Estado: any;

  constructor(private utils: UtilsService, private user: AuthService) {
    this.formData = new FormGroup({
      Descripcion: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
      ]),
      Fechaini: new FormControl(new Date(), [Validators.required]),
      Fechafin: new FormControl(new Date(), [Validators.required]),
      Buscar: new FormControl(''),
      Idfacultad: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.loading=true;
    this.usuario = this.user.userData;
    console.log(this.usuario);
    this.loading = true;
    this.Fechainicio = moment(new Date())
    .add('months', -5)
    .format('yyyy-MM-DD');
    this.Fechafin = moment(new Date()).format('yyyy-MM-DD');
    this.Estado = 'Vigente';
    this.FechaActual = moment(new Date()).format('yyyy-MM-DD');
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [5, 10, 25, 50, 100],
      processing:true,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json',
      },
      responsive: true,
      columns: [
        { width: '10%' },
        { width: '30%' },
        { width: '15%' },
        { width: '15%' },
        { width: '20%' },
        { width: '10%' },
      ],
    };
    this.UpdateTable();

    this.formData.controls['Buscar'].valueChanges.subscribe((e) => {
      if (e) {
        this.buscar = e;
        this.GetMateria();
      }
    });

    this.utils.httpGET('GetFacultades').then((data: any) => {
      this.facultades = data;
      console.log(this.facultades);
    });
  }
  Nuevo() {
    this.formData.patchValue({
      Descripcion: '',
      Fechaini: null,
      Fechafin: null,
      Idfacultad: this.user.userData.Idfacultad,
    });
    this.Listamaterias = [];
    this.Idpostulacion = null;
    this.showModal = true;
    this.showTabla = false;
    if (this.user.userData.Id == 4) this.showSelect = true;
    else this.showSelect = false;
  }

  UpdateTable() {
    this.Idpostulacion = null;
    let estado;
    switch (this.Estado) {
      case "Vigente":
         estado=1;
        break;
      case "No Vigente":
        estado=2;
        break;
      default:
        break;
    }

    console.log(this.Fechainicio,this.Fechafin,estado);
    this.utils.httpGET('GetPostulaciones?fechaini='+
      this.Fechainicio +
      '&fechafin=' +
      this.Fechafin +
      '&estado='+
      estado
    ).then((data: any) => {
      if (this.user.userData.Idrol == 4)
        this.postulaciones = data.filter(
          (x) => x.Idfacultad == this.user.userData.Idfacultad
        );
      else this.postulaciones = data;
      //this.dtTrigger.next();
      this.loading = false;
      this.rerender();
    });
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  GetMateria() {
    if (this.buscar != '') {
      this.utils
        .httpGET('BuscarMateria', { Buscar: this.buscar })
        .then((data: any) => {
          this.materias = data;
        });
      this.showMenu = true;
    } else {
      this.showMenu = false;
    }
  }
  AddMateria(item) {
    this.showTabla = true;
    this.showMenu = false;
    if (this.Listamaterias.filter((x) => x.Id == item.Id).length == 0) {
      this.Listamaterias.push(item);
      if (this.Idpostulacion != null) {
        let materias = [];
        materias = materias.concat(item.Id);
        const obj = { Id: this.Idpostulacion, ListaMateria: materias };
        console.log(obj);
        this.utils
          .httpPOSTJSON('/AddMateria/', obj)
          .then((res) => {
            this.saving = false;
            if (res) {
              console.log(this.error);
            } else {
              console.log('Datos guardados');
              this.utils.Toast('Registro Existoso', 1);
            }
          })
          .catch((err) => {
            this.utils.Toast('Error comuniquese con el administrador', 3);
            console.log(err);
            this.saving = false;
          });
      }
    } else {
      this.utils.Toast('La materia seleccionada ya fue introducida', 2);
    }
  }

  Save() {
    if (!this.formData.valid) {
      return false;
    }
    this.saving = true;
    const data = JSON.parse(JSON.stringify(this.formData.value));
    data.Fechaini = moment(this.formData.value.Fechaini).format('YYYY-MM-DD');
    data.Fechafin = moment(this.formData.value.Fechafin).format('YYYY-MM-DD');
    let materias = [];
    materias = materias.concat(this.Listamaterias.map((x) => x.Id));
    const obj = {
      Descripcion: data.Descripcion,
      Fechaini: data.Fechaini,
      Fechafin: data.Fechafin,
      Listamateria: materias,
      Idfacultad: data.Idfacultad,
      Idusuario: this.user.userData.Id,
    };
    if (data.Fechaini <= data.Fechafin) {
      if (this.Idpostulacion == null) {
        this.utils
          .httpPOSTJSON('/savepostulacion/', obj)
          .then((res) => {
            this.saving = false;
            if (res) {
              console.log(this.error);
            } else {
              console.log('Datos guardados');
              this.utils.Toast('Registro Existoso', 1);
              this.UpdateTable();
              this.showModal = false;
            }
          })
          .catch((err) => {
            this.utils.Toast('Error comuniquese con el administrador', 3);
            console.log(err);
            this.saving = false;
          });
      } else {
        data.Id = this.Idpostulacion;
        console.log(data);
        this.utils
          .httpPUT('/UpdatePostulacion/', data)
          .then((res) => {
            this.saving = false;
            if (res) {
              console.log(this.error);
            } else {
              console.log('Datos guardados');
              this.utils.Toast('Modificación Existosa', 1);
              this.UpdateTable();
              this.showModal = false;
            }
          })
          .catch((err) => {
            this.utils.Toast('Error comuniquese con el administrador', 3);
            console.log(err);
            this.saving = false;
          });
      }
    } else {
      this.utils.Toast(
        'La fecha de inicio no puede ser menor a la fecha fin',
        2
      );
    }
  }
  Edit(item) {
    this.formData.patchValue({
      Descripcion: item.Descripcion,
      Fechaini: moment(item.Fechaini).format('YYYY-MM-DD'),
      Fechafin: moment(item.Fechafin).format('YYYY-MM-DD'),
      Idfacultad: item.Idfacultad,
    });
    this.Listamaterias = item.DetalleMateria;
    this.Idpostulacion = item.Id;
    this.showModal = true;
    this.showTabla = true;
  }

  Confirm(item) {
    this.showConfirm = true;
    this.postulacion = item;
  }

  Delete() {
    this.utils
      .httpDelete('/DeletePostulacion/?Id=' + this.postulacion.Id)
      .then((res) => {
        this.saving = false;
        if (res) {
          console.log(this.error);
        } else {
          console.log('Datos guardados');
          this.UpdateTable();
          this.showConfirm = false;
          this.utils.Toast('Eliminacion Existosa.', 1);
        }
      })
      .catch((err) => {
        this.utils.Toast(
          'Se ha producido un error contacte al administrador.',
          3
        );
        this.saving = false;
      });
  }

  DeleteMateria(item) {
    if (this.Listamaterias.length > 1) {
      this.utils
        .httpDelete(
          '/DeleteMateria/?Idmateria=' +
            item.Id +
            '&Idpostulacion=' +
            this.Idpostulacion
        )
        .then((res) => {
          this.saving = false;
          if (res) {
            console.log(this.error);
          } else {
            console.log('Datos guardados');
            this.Listamaterias = this.Listamaterias.filter((x) => x != item);
            this.utils.Toast('Eliminacion Existosa.', 1);
          }
        })
        .catch((err) => {
          this.utils.Toast(
            'Se ha producido un error contacte al administrador.',
            3
          );
          this.saving = false;
        });
    } else {
      this.utils.Toast('La lista de materias no puede quedar vacia.', 2);
    }
  }

  Cancel() {
    this.UpdateTable();
    this.showModal = false;
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }
}
