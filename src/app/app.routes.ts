import {Routes} from '@angular/router';
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {AuthGuardService} from "./services/auth-guard.service";
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component";
import {CreateProjectComponent} from "./components/create-project/create-project.component";
import {UsersComponent} from "./components/users/users.component";
import {ViewProjectComponent} from "./components/view-project/view-project.component";
import {EditProjectComponent} from "./components/edit-project/edit-project.component";

export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: '', component: DashboardComponent, canActivate: [AuthGuardService]},
  {path: 'create-project', component: CreateProjectComponent, canActivate: [AuthGuardService]},
  {path: 'users', component: UsersComponent, canActivate: [AuthGuardService]},
  {path: 'projects/:id', component: ViewProjectComponent, canActivate: [AuthGuardService]},
  {path: 'edit-project/:id', component: EditProjectComponent, canActivate: [AuthGuardService]},
  {path: '**', redirectTo: ''},
];
