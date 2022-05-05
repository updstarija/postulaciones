import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-terna',
  templateUrl: './terna.component.html',
  styleUrls: ['./terna.component.scss'],
})
export class TernaComponent implements OnInit {
  turno: number;
  modulos: any[];
  modulo: any;
  ofertas: any[];
  loading: boolean;
  showDocentes: boolean;
  showCarreras: boolean;
  orden: any[];
  docentes: any[]=[];
  carreras: any[];
  jefes: any[];
  saving: boolean;
  oferta: any;
  showReporte:boolean=false;
  constructor(private utils: UtilsService) {}

  ngOnInit(): void {
    this.turno = 0;
    this.ofertas=[];
    this.getModulos();
    this.getJefesCarrera();
  }

  changeTurno(turno) {
    this.turno = turno;
    this.getOfertasTerna();
  }
  getModulos() {
    this.utils.httpGET('GetModulos').then((data: any) => {
      this.modulos = data;
    });
  }
  getOfertasTerna() {
    this.loading = true;
    var mod = this.modulos.find((x) => x.Id == this.modulo);
    this.utils
      .httpGET(
        'GetOfertasTerna?modulo=' + mod.Nombre + '&idturno=' + this.turno
      )
      .then((data: any) => {
        console.log(data);
        this.ofertas = data;
        this.generarReporte();
        this.loading = false;
      });
  }
  addDocente(item) {
    this.orden = [];
    this.oferta = item;
    this.loading = true;
    this.showDocentes = true;
    console.log(item);
    this.utils
      .httpGET('GetDocentesTerna?idmateria=' + item.Idmateriacontenido)
      .then((data) => {
        console.log(data);
        this.docentes = [];
        var i = 1;
        data.forEach((x) => {
          var d = item.Listadocente.find((o) => o.Id == x.Id);
          if (d) {
            x.check = true;
            x.Orden = d.Orden;
            i++;
            this.orden.push(x);
          } else {
            x.check = false;
          }
          this.docentes.push(x);
        });
        this.loading = false;
      });
  }
  saveListDocente() {
    this.saving = true;
    let lista = [];
    this.oferta.Listadocente = [];
    var i = 1;
    this.docentes.forEach((x) => {
      if (x.check) {
        var obj = {
          Idmodulo: this.modulo,
          Idturno: this.oferta.Idturno,
          Idmateria: this.oferta.Idmateriacontenido,
          Iddocente: x.Id,
          Orden: x.Orden,
          Habilitado: true,
        };
        lista.push(obj);
        this.oferta.Listadocente.push(x);
        i++;
      }
    });
    console.log(lista);
    this.utils.httpPOSTJSON('SaveDocentesTerna', lista).then((data) => {
      console.log(data);
      if (data.error) {
        this.utils.Toast('Error al insertar en base de datos', 3);
      }
      this.generarReporte();
      this.showDocentes = false;
      this.saving = false;
    });
  }
  addCarrera(item) {
    this.oferta = item;
    this.loading = true;
    this.showCarreras = true;
    this.utils
      .httpGET('GetCarrerasTerna?idmateria=' + item.Idmateriacontenido)
      .then((data) => {
        this.carreras = [];
        data.forEach((x) => {
          var d = item.Listacarrera.find((o) => o.Idcarrera == x.Idcarrera);
          console.log(d);
          if (d) {
            x.check = true;
          } else {
            x.check = false;
          }
          this.carreras.push(x);
        });
        this.loading = false;
      });
  }
  saveListCarrera() {
    this.saving = true;
    let lista = [];
    this.oferta.Listacarrera = [];
    var i = 1;
    this.carreras.forEach((x) => {
      if (x.check) {
        var obj = {
          Idmodulo: this.modulo,
          Idturno: this.oferta.Idturno,
          Idmateria: this.oferta.Idmateriacontenido,
          Idcarrera: x.Idcarrera,
        };
        lista.push(obj);
        this.oferta.Listacarrera.push(x);
        i++;
      }
    });
    console.log(lista);
    this.utils.httpPOSTJSON('SaveCarrerasTerna', lista).then((data) => {
      console.log(data);
      if (data.error) {
        this.utils.Toast('Error al insertar en base de datos', 3);
      }
      this.generarReporte();
      this.showCarreras = false;
      this.saving = false;
    });
  }
  getJefesCarrera() {
    this.utils.httpGET('GetJefesdeCarreraTerna').then((data) => {
      this.jefes = data;
      console.log(data);
    });
  }
  changeJefe(item) {
   this.saving=true;
    let obj={
      Idmateria:item.Idmateriacontenido,
      Idturno:item.Idturno,
      Idmodulo:this.modulo,
      Idjefe: item.Idjefecarrera,
      Cupo:item.Cupo
    }
    console.log(obj);
    this.utils.httpPOSTJSON('SaveJefeCupoTerna', obj).then((data) => {
      console.log(data);
      if (data.error) {
        this.utils.Toast('Error al actualizar la tabla', 3);
      }
      this.generarReporte();
      this.saving=false;
    });
  }
  changeDocente(item) {
    let lista=[];
    if(!item.check){
      item.Orden = this.orden.length + 1;
      this.orden.push(item);
    }
    else{
      item.Orden=null;
      var i=this.orden.findIndex(x=>x.Id == item.Id);
      this.orden.splice(i,1);
    }
    this.orden.forEach(x=>{
      lista.push(x);
    })
    let index=1;
    this.orden=[];
    lista.forEach(x=>{
      x.Orden=index;
      this.orden.push(x);
      index=index+1;
    })
  }
  SaveSeleccionado(d,item){
    console.log(d);
    console.log(item);
    var obj={
      Idmodulo:this.modulo,
      Idturno:item.Idturno,
      Idmateria: item.Idmateriacontenido,
      Iddocente:d.Id,
      Seleccionado:d.Seleccionado
    };
    this.saving=true;
    this.utils.httpPOSTJSON('SaveDocenteSeleccionado', obj).then((data) => {
      console.log(data);
      if (data.error) {
        this.utils.Toast('Error al actualizar la tabla', 3);
      }
      this.generarReporte();
      this.saving=false;
    });
  }

  reporte:any[];
  generarReporte(){
    this.reporte=[];
    let n=1;
    this.ofertas.forEach(x=>{
      let tam=0;
      if(x.Listacarrera.length>x.Listadocente.length)
      {
        tam=x.Listacarrera.length;
      }
      else if(x.Listacarrera.length<x.Listadocente.length){
        tam=x.Listadocente.length;
      }
      else{
        tam=x.Listacarrera.length;
      }
      for(var i=0;i<tam;i++){
        var obj;
        if(i==0){
          let jefe ="";
          if(this.jefes.find(o=>o.Id==x.Idjefecarrera)){
            jefe=this.jefes.find(o=>o.Id==x.Idjefecarrera).Nombre;
          }
          let carrera ="";
          if(x.Listacarrera[i]){
            carrera=x.Listacarrera[i].Nombre;
          }
          let docente="";
          if(x.Listadocente[i]){
            docente=x.Listadocente[i].Nombre;
          }
          obj ={
            Num:n,
            Carrera:carrera,
            Equivalente:x.Equivalente,
            Materia: x.Materia,
            Idturno:x.Idturno,
            Alumnosproyectados:x.Alumnosproyectados,
            Cupo:x.Cupo,
            JefeCarrera: jefe,
            Docente:docente
          }
        }
        else{
          let carrera ="";
          if(x.Listacarrera[i]){
            carrera=x.Listacarrera[i].Nombre;
          }
          let docente="";
          if(x.Listadocente[i]){
            docente=x.Listadocente[i].Nombre;
          }
          obj ={
            Num:"",
            Carrera:carrera,
            Equivalente:"",
            Materia: "",
            Idturno:"",
            Alumnosproyectados:"",
            Cupo:"",
            JefeCarrera: "",
            Docente:docente
          }
        }
        this.reporte.push(obj);
      }
      n++;
    });
    console.log(this.reporte);
  }
  exportExcel() {
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element,{
      raw: true
    });


    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hoja 1');


    XLSX.writeFile(wb, 'Reporte - Terna ' + this.modulo + '.xlsx');
  }
}
