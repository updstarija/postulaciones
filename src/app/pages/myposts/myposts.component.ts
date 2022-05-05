import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-myposts',
  templateUrl: './myposts.component.html',
  styleUrls: ['./myposts.component.scss']
})
export class MypostsComponent implements OnInit {
  postulaciones:any;
  constructor(private utils:UtilsService,private user: AuthService) { }

  ngOnInit(): void {
    this.utils
        .httpGET('GetPostulacionId', { Id: this.user.userData.Id})
        .then((data: any) => {
  
          this.postulaciones = data;
          console.log(this.postulaciones);
        });
        
  }
  

}
