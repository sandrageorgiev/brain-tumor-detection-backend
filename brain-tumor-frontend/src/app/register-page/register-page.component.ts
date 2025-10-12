import {Component, inject} from '@angular/core';
import { LucideAngularModule, User, Lock } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import {RouterLink, Router} from "@angular/router";
import {AuthService, RegisterRequest} from "../service/auth.service";

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [LucideAngularModule, FormsModule, RouterLink],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {
  icons = { User, Lock };
  authService = inject(AuthService)
  router = inject(Router)

  name: string = '';
  surname: string = '';
  embg: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  onRegister() {
    console.log('Register:', this.email, this.password);
    if (this.password == this.confirmPassword){
      const request: RegisterRequest = {
        name: this.name,
        surname: this.surname,
        embg: this.embg,
        email: this.email,
        password: this.password
      }
      this.authService.register(request).subscribe(_ => {
        console.log("Success");
        this.router.navigate(['./login']);

      }, error => console.log("Error", error))
    }
    // Here you would call your backend auth service
  }
}
