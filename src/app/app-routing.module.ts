import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SideNavComponent } from './side-nav/side-nav.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SupplyComponent } from './supply/supply.component';

const routes: Routes = [
  {
    path:'',
    redirectTo: 'dashboard', pathMatch: 'full'
  },
  {
    path: "dashboard",
    component: DashboardComponent
  },
  {
    path: "supply",
    component: SupplyComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
