import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-dashboard-docente',
  templateUrl: './dashboard-docente.component.html',
  styleUrls: ['./dashboard-docente.component.scss'],
})
export class DashboardDocenteComponent implements OnInit {
  public user: any;
  postulaciones: Array<any> = [];
  loading: boolean;
  showLogout: boolean;
  loading_logout: boolean;
  constructor(
    private authService: AuthService,
    private utils: UtilsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.utils
      .httpGET('persona/' + this.authService.userData.Id)
      .then((data: any) => {
        this.user = data;
        console.log(this.user);
      });
    this.getPostulaciones();
  }
  getPostulaciones() {
    console.log('aqui');
    this.loading = true;
    this.utils.httpGET('GetPostulacionesDocentes').then((data: any) => {
      console.log(data);
      this.postulaciones = data;
      console.log(this.postulaciones);
      this.loading = false;
    });
  }
  VerDetalle(item) {
    if (this.user.Curriculum) {
      this.router.navigate(['/principal/detalle-postulacion/' + item.Id], {
        replaceUrl: true,
      });
    } else {
      this.utils.Toast('Debe publicar su curriculum para poder postularse', 2);
    }
  }
  more() {
    this.router.navigate(['/principal/postulaciones'], { replaceUrl: true });
  }
}
