import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-detail-posts',
  templateUrl: './detail-posts.component.html',
  styleUrls: ['./detail-posts.component.scss'],
})
export class DetailPostsComponent implements OnInit {
  postulacion: any;
  Idcheck: any;
  postulacionmateria = [];
  error = '';
  showButton: boolean;

  constructor(
    private route: ActivatedRoute,
    private utils: UtilsService,
    private user: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.showButton = false;
    const id = this.route.snapshot.params['Id'];
    console.log(id);
    this.utils
      .httpGET('GetPostulacion', { Id: id, Idusuario: this.user.userData.Id })
      .then((data: any) => {
        this.postulacion = data;
        data.DetalleMateria.forEach((x) => {
          if (x.Idpostulacionmateria == 0) {
            this.showButton = true;
          }
        });
      });
  }
  Save() {
    let obj: any;
    this.postulacion.DetalleMateria.map((x) => {
      if (x.Check == true) {
        obj = {
          Idpersona: this.user.userData.Id,
          Iddetallepostulacion: x.Id,
        };
        this.postulacionmateria.push(obj);
      }
    });
    if (this.postulacionmateria.length > 0) {
      this.utils
        .httpPOSTJSON('/SavePostulacionMateria', this.postulacionmateria)
        .then((res) => {
          console.log(res);
          if (res.error) {
            this.error = res.error;
            this.utils.Toast(this.error, 2);
          } else {
            this.router.navigate(['/principal/mis-postulaciones'], {
              replaceUrl: true,
            });
            this.utils.Toast('Postulacion Existosa.', 1);
          }
        })
        .catch((err) => {
          this.utils.Toast(err, 3);
        });
    } else {
      this.utils.Toast('Debe seleccionar una materia para postular', 2);
    }
  }
}
