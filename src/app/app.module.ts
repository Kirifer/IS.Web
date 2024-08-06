import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { BodyComponent } from './body/body.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SupplyComponent } from './supply/supply.component';

import {MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AddEditComponent } from './add-edit/add-edit.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule} from '@angular/material/paginator';
import { MatSortModule} from '@angular/material/sort';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { LoginRegisterComponent } from './login-register/login-register.component';
import {FormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CodesComponent } from './codes/codes.component';
import { AddEditCodesComponent } from './add-edit-codes/add-edit-codes.component';
import { AsyncPipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {MatGridListModule} from '@angular/material/grid-list';
import {FormBuilder} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import { EditSupplyComponent } from './edit-supply/edit-supply.component';
import { EditCodeComponent } from './edit-code/edit-code.component';
import { BudgetComponent } from './budget/budget.component';
import { DatePipe } from '@angular/common';

 



@NgModule({
  declarations: [
    AppComponent,
    SideNavComponent,
    BodyComponent,
    DashboardComponent,
    SupplyComponent,
    AddEditComponent,
    LoginRegisterComponent,
    CodesComponent,
    AddEditCodesComponent,
    EditSupplyComponent,
    EditCodeComponent,
    BudgetComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatFormFieldModule,
    MatTableModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatCheckboxModule,
    FormsModule,
    HttpClientModule,
    AsyncPipe,
    RouterOutlet,
    MatGridListModule,
    MatCardModule,
    DatePipe
    
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
