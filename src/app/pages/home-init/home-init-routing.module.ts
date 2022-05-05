import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeInitComponent } from './home-init.component';

const routes: Routes = [
  {
    path: '',
    component: HomeInitComponent,
    children: [
      {
        path: 'perfil',
        loadChildren: () =>
          import('../profile/profile.module').then((m) => m.ProfileModule),
      },
      {
        path: 'administrador',
        loadChildren: () =>
          import('../dashboard-admin/dashboard-admin.module').then(
            (m) => m.DashboardAdminModule
          ),
      },
      {
        path: 'docente',
        loadChildren: () =>
          import('../dashboard-docente/dashboard-docente.module').then(
            (m) => m.DashboardDocenteModule
          ),
      },
      {
        path: 'usuarios',
        loadChildren: () =>
          import('../users/users.module').then((m) => m.UsersModule),
      },
      {
        path: 'gestionar-postulaciones',
        loadChildren: () =>
          import('../manage-posts/manage-posts.module').then(
            (m) => m.ManagePostsModule
          ),
      },
      {
        path: 'mi-curriculum',
        loadChildren: () =>
          import('../resume-docente/resume-docente.module').then(
            (m) => m.ResumeDocenteModule
          ),
      },
      {
        path: 'jefe-carrera',
        loadChildren: () =>
          import(
            '../dashboard-jefe-carrera/dashboard-jefe-carrera.module'
          ).then((m) => m.DashboardJefeCarreraModule),
      },
      {
        path: 'talento-humano',
        loadChildren: () =>
          import(
            '../dashboard-talento-humano/dashboard-talento-humano.module'
          ).then((m) => m.DashboardTalentoHumanoModule),
      },
      {
        path: 'detalle-postulacion/:Id',
        loadChildren: () =>
          import('../detail-posts/detail-posts.module').then(
            (m) => m.DetailPostsModule
          ),
      },
      {
        path: 'postulaciones',
        loadChildren: () =>
          import('../posts/posts.module').then((m) => m.PostsModule),
      },
      {
        path: 'mis-postulaciones',
        loadChildren: () =>
          import('../myposts/myposts.module').then((m) => m.MypostsModule),
      },
      {
        path: 'gestionar-aplicaciones',
        loadChildren: () =>
          import('../application-posts/application-posts.module').then(
            (m) => m.ApplicationPostsModule
          ),
      },
      {
        path: 'seguimiento-aplicaciones',
        loadChildren: () =>
          import('../tracing-post/tracing-post.module').then(
            (m) => m.TracingPostModule
          ),
      },
      { path: 'terna', loadChildren: () => import('../terna/terna.module').then(m => m.TernaModule) },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeInitRoutingModule {}
