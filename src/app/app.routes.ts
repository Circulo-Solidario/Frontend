import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'crear-usuario', loadComponent: () => import('./components/create-user/create-user').then(m => m.CreateUser) },
    { path: '', redirectTo: 'crear-usuario', pathMatch: 'full' },
    { path: '**', redirectTo: 'crear-usuario' }
];
