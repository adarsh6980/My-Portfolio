import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'projects/:slug',
    loadComponent: () => import('./features/projects/project-detail').then((module) => module.ProjectDetail),
  },
];
