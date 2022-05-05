import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit {
  loading: boolean;
  postulaciones: any[];
  constructor(private utils: UtilsService,private router:Router) {}

  ngOnInit(): void {
    this.postulaciones = [];
    this.getPostulaciones();
  }
  getPostulaciones() {
    this.loading = true;
    this.utils.httpGET('GetPostulacionesDocentesTodo').then((data: any) => {
      this.postulaciones = data;
      console.log(this.postulaciones);
      this.loading = false;
    });
  }
  VerDetalle(item)
  {
    this.router.navigate(['/principal/detalle-postulacion/'+item.Id],{replaceUrl:true});
  }
}
