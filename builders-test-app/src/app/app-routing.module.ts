import {
  NgModule
} from '@angular/core';

import {
  Routes,
  RouterModule
} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'lazy-loaded',
        loadChildren: () => import('./lazy-loaded/lazy-loaded.module').then(m => m.LazyLoadedModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
