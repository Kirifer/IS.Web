import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SideNavComponent } from './side-nav/side-nav.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SupplyComponent } from './supply/supply.component';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { CodesComponent } from './codes/codes.component';
import { BudgetComponent } from './budget/budget.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path:'',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path:'login',
    component: LoginRegisterComponent,
  },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "supply",
    component: SupplyComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "codes",
    component: CodesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "budget",
    component: BudgetComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "**",
    redirectTo: '',
  }

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
