import {
  Component,
  OnInit,
  HostListener,
  Input,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})


export class HomeComponent implements OnInit {
  menu: boolean;
  showShop: boolean;
  postulaciones: Array<any> = [];
  loading: boolean;
  @Input() Item:any;
  Fechainicio:any=moment();
  Fechafin:any=moment();

  constructor(private utils: UtilsService, private router:Router) {}

  ngOnInit(): void {
    this.Fechainicio = moment(new Date())
    .add('months', -5)
    .format('yyyy-MM-DD');
    this.Fechafin = moment(new Date()).format('yyyy-MM-DD');
    this.getPostulaciones();
    
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e) {
    const element = document.querySelector('.navbar');
    if (window.pageYOffset > 20) {
      element.classList.add('navbar-scrolled');
    } else {
      element.classList.remove('navbar-scrolled');
    }
    this.showShop = window.pageYOffset > 600;
  }

  scroll(el: HTMLElement, disableScroll?: boolean, sectionAnalitycs?) {
    if (sectionAnalitycs) {
      console.log(sectionAnalitycs);

      //this.analitycs.logEvent(sectionAnalitycs);
    }
    el.scrollIntoView({ behavior: disableScroll ? 'auto' : 'smooth' });
    this.menu = false;
  }
  getPostulaciones() {
    this.loading = true;
    this.utils.httpGET('GetPostulaciones?fechaini='+
      this.Fechainicio +
      '&fechafin=' +
      this.Fechafin +
      '&estado='+ 1
    ).then((data: any) => {
      console.log(data);
      this.postulaciones = data;
      //console.log(this.postulaciones);
      this.loading = false;
    });
  }
  VerDetalle(item){
   this.utils.Toast("Debe iniciar sesion para ver el detalle de la postulación",2);
  }
}
