import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router, RouterLink} from "@angular/router";
import {LoaderComponent} from "../loader/loader.component";
import {NgIf} from "@angular/common";
import {finalize} from "rxjs";
import {ToastService} from "../../services/toast.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    LoaderComponent,
    NgIf,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  isLoading: boolean = false;

  constructor(public authService: AuthService, public router: Router, public toastService: ToastService) {
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  handleLogin() {
    this.isLoading = true;
    this.username = this.username.trim();
    this.password = this.password.trim();
    this.authService.login(this.username, this.password)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe({
        next: res => {
          localStorage.setItem('loggedInUser', JSON.stringify(res));
          this.router.navigate(['/']).then(() => {
            this.toastService.showSuccessMessage("Successfully logged in!");
          });
        },
        error: err => {
          console.log(err)
          this.toastService.showErrorMessage(err.error instanceof Object ? JSON.stringify(err.error) : err.error);
        }
      });
  }
}
