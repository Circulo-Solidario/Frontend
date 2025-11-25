import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'crear-usuario',
    loadComponent: () => import('./components/create-user/create-user').then((m) => m.CreateUser),
  },
  { path: 'login', loadComponent: () => import('./components/login/login').then((m) => m.Login) },
  {
    path: 'crear-perfil',
    loadComponent: () =>
      import('./components/create-profile/create-profile').then((m) => m.CreateProfile),
  },
  {
    path: 'recuperar-contrasena',
    loadComponent: () =>
      import('./components/forgot-password/forgot-password').then((m) => m.ForgotPassword),
  },
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
      },
      {
        path: 'busqueda',
        loadComponent: () => import('./components/products-list/products-list').then((m) => m.ProductsList)
      },
      {
        path: 'detalles',
        loadComponent: () => import('./components/product-detail/product-detail').then((m) => m.ProductDetail)
      },
      {
        path: 'mis-publicaciones',
        loadComponent: () => import('./components/donor-product-list/donor-product-list').then((m) => m.DonorProductList)
      },
      {
        path: 'editar-publicacion',
        loadComponent: () => import('./components/edit-product/edit-product').then((m) => m.EditProduct)
      },
      {
        path: 'solicitudes',
        loadComponent: () => import('./components/requests-list/requests-list').then((m) => m.RequestsList)
      },
      {
        path: 'chats',
        loadComponent: () => import('./components/chat-list/chat-list').then((m) => m.ChatList),
        children: [
          {
            path: 'mensajes',
            loadComponent: () => import('./components/chat/chat').then((m) => m.Chat)
          }
        ]
      },
      {
        path: 'crear-proyecto',
        loadComponent: () => import('./components/create-proyect/create-proyect').then((m) => m.CreateProyect)
      },
      {
        path: 'proyectos',
        loadComponent: () => import('./components/proyects-list/proyects-list').then((m) => m.ProyectsList)
      },
      {
        path: 'detalles-proyecto',
        loadComponent: () => import('./components/proyect-detail/proyect-detail').then((m) => m.ProyectDetail)
      },
      {
        path: 'mapa',
        loadComponent: () => import('./components/map/map').then((m) => m.Map)
      },
      {
        path: 'mis-proyectos',
        loadComponent: () => import('./components/org-proyect-list/org-proyect-list').then((m) => m.OrgProyectList)
      },
      {
        path: 'editar-proyecto',
        loadComponent: () => import('./components/edit-proyect/edit-proyect').then((m) => m.EditProyect)
      },
      {
        path: 'validar-organizaciones',
        loadComponent: () => import('./components/invalid-users-list/invalid-users-list').then((m) => m.InvalidUsersList)
      }
    ]
  },  
  { path: '', redirectTo: 'principal', pathMatch: 'full' },
  { path: '**', redirectTo: 'principal' },
];
