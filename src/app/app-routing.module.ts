import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  AuthGuardLoginService,
  AuthGuardService,
} from './services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'principal',
    pathMatch: 'full',
  },
  {
    path: 'inicio',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomeModule),
    canActivate: [AuthGuardLoginService],
  },
  {
    path: 'principal',
    loadChildren: () =>
      import('./pages/home-init/home-init.module').then(
        (m) => m.HomeInitModule
      ),
    canActivate: [AuthGuardService],
  },
  
  { path: '**', redirectTo: 'inicio' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
