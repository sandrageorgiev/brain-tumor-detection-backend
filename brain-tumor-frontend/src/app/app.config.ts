import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

// app.config.ts (or app.module.ts if you create one)
import { ApplicationConfig } from '@angular/core';
import {provideHttpClient} from "@angular/common/http";
// import {, Brain, Upload, FileText, Download, Stethoscope, User} from "lucide-angular";


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient() // ✅ this replaces HttpClientModule

// provideIcons({
//       Brain,
//       Upload,
//       FileText,
//       Download,
//       Stethoscope,
//       User
//     }),
  ],
};
