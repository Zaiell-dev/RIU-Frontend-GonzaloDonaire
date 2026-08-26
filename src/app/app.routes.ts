import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./heroes/pages/heroes-page/heroes-page').then(
        (c) => c.HeroesPage,
      ),
  },
  {
    path: 'form',
    loadComponent: () =>
      import('./heroes/pages/heroes-form-page/heroes-form-page').then(
        (c) => c.HeroesFormPage,
      ),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
