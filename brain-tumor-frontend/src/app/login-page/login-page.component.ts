import {Component, inject} from '@angular/core';
import { LucideAngularModule, User, Lock } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import {Router, RouterLink} from "@angular/router";
import {AuthService, LoginRequest} from "../service/auth.service";
import {SessionStorageService} from "../service/session-storage.service";

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [LucideAngularModule, FormsModule, RouterLink],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  icons = { User, Lock };
  authService = inject(AuthService)
  router = inject(Router)
  session = inject(SessionStorageService)

  email: string = '';
  password: string = '';

  onLogin() {
    const loginRequest: LoginRequest = {
      email: this.email,
      password: this.password
    }

    console.log('Login:', this.email, this.password);

    this.authService.login(loginRequest).subscribe(
      {
        next: response =>  {
          this.session.setUserData(response.email, response.role);
          console.log(response.email)
          if(this.session.getRole() == 'DOCTOR'){
            this.router.navigate(['./']);
          }else if(this.session.getRole() == 'PATIENT'){
            this.router.navigate(['./']);
          }else{
            this.router.navigate(['./']);
          }

        },
        error: _ => console.log('ERROR login')
      }
    )

    // Here you would call your backend auth service
  }
}
