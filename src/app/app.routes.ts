import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'crear-usuario',
    loadComponent: () => import('./components/create-user/create-user').then((m) => m.CreateUser),
  },
  { path: 'login', loadComponent: () => import('./components/login/login').then((m) => m.Login) },
  {
    path: 'principal',
    loadComponent: () => import('./components/home/home').then((m) => m.Home),
    children: [
      {
        path: 'editar-perfil',
        loadComponent: () =>
          import('./components/edit-profile/edit-profile').then((m) => m.EditProfile),
      },
      {
        path: 'publicar-producto',
        loadComponent: () =>
          import('./components/create-product/create-product').then((m) => m.CreateProduct),
      }
    ]
  },
  {
    path: 'crear-perfil',
    loadComponent: () =>
      import('./components/create-profile/create-profile').then((m) => m.CreateProfile),
  },
  { path: '', redirectTo: 'principal', pathMatch: 'full' },
  { path: '**', redirectTo: 'principal' },
];
