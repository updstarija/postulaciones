import { Component, OnInit, ViewChild } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject<any>();
  usuarios:any;
  showModal:boolean;
  showConfirm:boolean;
  saving:boolean;
  loading:boolean;
  formCreate: FormGroup;
  idusuario:any;
  error: string;
  usuario:any;
  

  constructor(private utils:UtilsService,private router: Router) {
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
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [5, 10, 25, 50, 100],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json',
      },
      responsive: true,
      columns: [
        { width: '10%' },
        { width: '20%' },
        { width: '20%' },
        { width: '20%' },
        { width: '20%' },
        { width: '10%' },
      ],
    };
    this.UpdateTable();
  }
  UpdateTable() {
    // this.Idpostulacion = null;
    this.utils.httpGET('Getusuarios').then((data: any) => {
      this.usuarios = data;
      //this.dtTrigger.next();
      this.rerender();
    });
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }
  Nuevo(){
    this.showModal=true;
  }
  Cancel(){
    this.showModal = false;
  }

  Save(){
    
    if (!this.formCreate.valid) {
      return false;
    }
    if (
      this.formCreate.value.Password != this.formCreate.value.PasswordRepeat
    ) {
      this.utils.Toast('Las contraseñas no coinciden', 2);
      return false;
    }
    const data = JSON.parse(JSON.stringify(this.formCreate.value));
    if (this.idusuario==null) {
      this.utils
      .httpPOST('/SaveUsuario', data)
      .then((res) => {
        this.saving = false;
        if (res.error != '') {
          this.error = res.error;
          this.utils.Toast(this.error, 2);
        } else {
          this.utils.Toast('Usuario registrado exitosamente.', 1);
          this.UpdateTable();
          this.showModal=false;
        }
      })
      .catch((err) => {
        this.error = err;
        this.utils.Toast(this.error, 2);
        this.saving = false;
      });
    }
    else{
      data.Id=this.idusuario;
      console.log(data);
      this.utils
      .httpPUT('/UpdateUsuario/', data)
      .then((res) => {
        this.saving = false;
        if (res) {
          console.log(this.error);
        } else {
          console.log('Datos guardados');
          this.UpdateTable();
          this.utils.Toast('Modificación Existosa', 1);
          this.showModal = false;
        }
      })
      .catch((err) => {
        this.utils.Toast('Error comuniquese con el administrador', 3);
        console.log(err);
        this.saving = false;
      });
    }
    
  }
  Edit(item) {
    this.formCreate.patchValue({
      Nombre: item.Nombre,
      Paterno: item.Paterno,
      Materno: item.Materno,
      Correo:item.Nomusu,
      Password: item.Password,
      PasswordRepeat: item.Password,
    });
    this.showModal = true;
    this.idusuario=item.Id;
  }

  Confirm(item){
    this.showConfirm=true;
    this.usuario=item;
  }

  Delete(){
    this.utils
    .httpDelete(
      '/DeletePostulacion/?Id=' +
        this.usuario.Id
    )
    .then((res) => {
      this.saving = false;
      if (res) {
        console.log(this.error);
      } else {
        console.log('Datos guardados');
        this.UpdateTable();
        this.showConfirm=false;
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
}
