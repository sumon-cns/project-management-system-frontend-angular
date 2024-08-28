import {Component} from '@angular/core';
import {LoaderComponent} from "../loader/loader.component";
import {NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {finalize} from "rxjs";
import {ToastService} from "../../services/toast.service";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    LoaderComponent,
    NgIf,
    FormsModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  isLoading: boolean = false;
  fullName: string = '';
  email: string = '';
  username: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private authService: AuthService, private toastService: ToastService) {
  }

  handleSubmit() {
    if (this.password !== this.confirmPassword) {
      this.toastService.showErrorMessage("Passwords don't match");
      return;
    }
    this.isLoading = true;
    this.authService.register({
      fullName: this.fullName,
      email: this.email,
      username: this.username,
      password: this.password
    })
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe({
        next: res => {
          this.toastService.showSuccessMessage("Successfully registered, you may login now!");
        },
        error: err => {
          this.toastService.showErrorMessage("Unable to register! " + err.error);
        }
      });
  }
}
