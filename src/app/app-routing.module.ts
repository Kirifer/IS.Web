import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SideNavComponent } from './side-nav/side-nav.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SupplyComponent } from './supply/supply.component';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { CodesComponent } from './codes/codes.component';

const routes: Routes = [
  {
    path:'',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path:'login',
    component: LoginRegisterComponent
  },
  {
    path: "dashboard",
    component: DashboardComponent
  },
  {
    path: "supply",
    component: SupplyComponent
  },
  {
    path: "codes",
    component: CodesComponent
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
