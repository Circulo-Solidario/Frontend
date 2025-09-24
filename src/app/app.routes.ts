import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'crear-usuario', loadComponent: () => import('./components/create-user/create-user').then(m => m.CreateUser) },
    { path: 'login', loadComponent: () => import('./components/login/login').then(m => m.Login)},
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }
];
