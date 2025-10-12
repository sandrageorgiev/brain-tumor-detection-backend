// import { bootstrapApplication } from '@angular/platform-browser';
// import { appConfig } from './app/app.config';
// import { AppComponent } from './app/app.component';
// // import { PatientsPageComponent } from './app/login-page/register-page.component.ts';
//
// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));
//
//

import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import {provideHttpClient} from "@angular/common/http";

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), provideHttpClient()]
});
