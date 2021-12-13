import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';

const telefonesModule = () => import('./telefones/telefones.module').then(x => x.TelefoneModule);

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'telefones', loadChildren: telefonesModule },

    
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }