import { Routes } from '@angular/router';
import {LandingPageComponent} from "./landing-page/landing-page.component";
import {LoginPageComponent} from "./login-page/login-page.component";
import {RegisterPageComponent} from "./register-page/register-page.component";
import {DoctorsPageComponent} from "./doctors-page/doctors-page.component";
import {PatientsPageComponent} from "./patients-page/patients-page.component";
import {CreateReportPageComponent} from "./create-report-page/create-report-page.component";

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'doctor', component: DoctorsPageComponent},
  { path: 'patient', component: PatientsPageComponent},
  { path: 'report', component: CreateReportPageComponent}
];
