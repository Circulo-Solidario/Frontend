import { Routes } from '@angular/router';
import { CreateProfile } from './components/create-profile/create-profile';

export const routes: Routes = [
    { path: 'crear-usuario', loadComponent: () => import('./components/create-user/create-user').then(m => m.CreateUser) },
    { path: 'login', loadComponent: () => import('./components/login/login').then(m => m.Login)},
    { path: 'principal', loadComponent: () => import('./components/home/home').then(m => m.Home)},
    { path: 'crear-perfil', loadComponent: () => import('./components/create-profile/create-profile').then(m => m.CreateProfile)},
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }
];
