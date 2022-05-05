import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-init-docente',
  templateUrl: './home-init.component.html',
  styleUrls: ['./home-init.component.scss'],
})
export class HomeInitComponent implements OnInit {
  public user: any;
  showLogout: boolean;
  loading_logout: boolean;
  constructor(
    private authService: AuthService,
    private utils: UtilsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.userData;
    if (this.user.Idrol == 1) {
      this.router.navigate(['/principal/administrador'], { replaceUrl: true });
    }
    if (this.user.Idrol == 2) {
      this.router.navigate(['/principal/docente'], { replaceUrl: true });
    }
    if (this.user.Idrol == 3) {
      this.router.navigate(['/principal/talento-humano'], { replaceUrl: true });
    }
    if (this.user.Idrol == 4) {
      this.router.navigate(['/principal/jefe-carrera'], { replaceUrl: true });
    }
  }

  logout() {
    this.loading_logout = true;
    this.authService.logout();
    this.router.navigate(['/inicio'], { replaceUrl: true });
  }
}
