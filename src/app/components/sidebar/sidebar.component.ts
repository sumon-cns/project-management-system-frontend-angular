import {Component} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {NgClass} from "@angular/common";
import {ToastService} from "../../services/toast.service";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    NgClass
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  constructor(private router: Router, private toastService: ToastService) {
  }

  handleLogout(event: Event): void {
    event.preventDefault();
    localStorage.removeItem('loggedInUser');
    this.router.navigate(['/login']).then(() => {
      this.toastService.showSuccessMessage("Successfully logged out!");
    });
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  isViewProjectActive() {
    return this.router.url.includes('/projects');
  }

  isEditProjectActive() {
    return this.router.url.includes('/edit-project');
  }
}

