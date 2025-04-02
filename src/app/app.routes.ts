import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { FormComponent } from './components/form/form.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'form', 
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent 
    },
    {
        path: 'form',
        component: FormComponent
    }
];
