import {Component} from '@angular/core';
import {LoaderComponent} from "../loader/loader.component";
import {NgIf} from "@angular/common";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {FormsModule} from "@angular/forms";
import {ProjectService} from "../../services/project.service";
import {ToastService} from "../../services/toast.service";
import {finalize} from "rxjs";

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [
    LoaderComponent,
    NgIf,
    SidebarComponent,
    FormsModule
  ],
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.css'
})
export class CreateProjectComponent {
  isLoading: boolean = false;

  name: string = '';
  intro: string = '';
  projectStatus: string = '';
  startDate: string = '';
  endDate: string = '';

  constructor(private projectService: ProjectService, private toastService: ToastService) {
  }

  submitForm() {
    this.isLoading = true;
    this.projectService.createProject({
      name: this.name,
      intro: this.intro,
      projectStatus: this.projectStatus,
      startDateTime: this.startDate && new Date(this.startDate).toISOString(),
      endDateTime: new Date(this.endDate).toISOString(),
      ownerId: 0
    }).pipe(finalize(() => this.isLoading = false)).subscribe({
      next: res => {
        this.toastService.showSuccessMessage("Successfully created project!");
      },
      error: err => {
        this.toastService.showErrorMessage("Error creating project!");
      }
    })
  }
}
