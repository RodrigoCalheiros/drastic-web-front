import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DrasticComponent } from './drastic/drastic.component';

const routes: Routes = [
  { path: 'drastic', component: DrasticComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
