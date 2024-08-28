import {Component, OnInit} from '@angular/core';
import {LoggedInUser, Project} from "../../models/models";
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import moment from "moment";
import {ProjectService} from "../../services/project.service";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {ToastService} from "../../services/toast.service";
import {LoaderComponent} from "../loader/loader.component";
import {finalize} from "rxjs";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    SidebarComponent,
    LoaderComponent,
    DatePipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  user?: LoggedInUser = undefined;
  startDate?: string = undefined;
  endDate?: string = undefined;
  projects: Project[] = [];
  isLoading: boolean = false;

  constructor(public router: Router, public projectService: ProjectService,
              public toastService: ToastService) {
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('loggedInUser') as string) as LoggedInUser;
    this.calculateCurrentMonthDates();
    this.fetchProjects();
  }

  calculateCurrentMonthDates() {
    // Use moment to get the first and last day of the current month
    const firstDay = moment().startOf('month').format('YYYY-MM-DD');
    const lastDay = moment().endOf('month').format('YYYY-MM-DD');

    this.startDate = moment().startOf('month').format('YYYY-MM-DD');
    this.endDate = moment().endOf('month').format('YYYY-MM-DD');
  }

  async createNewProject() {
    await this.router.navigate(['/create-project']);
  }

  applyDateRange() {
    this.fetchProjects();
  }

  viewProject(id: number) {
    this.router.navigate(['/projects/' + id]);
  }

  editProject(id: number) {
    this.router.navigate(['/edit-project/' + id])
  }

  deleteProject(id: number) {
    const del = confirm("Are you sure you want to delete this project?");
    this.isLoading = true;
    if (del) {
      this.projectService.deleteProject(id)
        .pipe(finalize(() => {
          this.isLoading = false;
        })).subscribe({
        next: res => {
          this.toastService.showSuccessMessage("Successfully deleted project!");
          this.fetchProjects();
        },
        error: err => {
          this.toastService.showErrorMessage("Unable to delete project!");
        }
      });
    }

    this.isLoading = false;

  }

  fetchProjects() {
    this.isLoading = true;
    this.projectService.fetchProjects(this.startDate!, this.endDate!)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: data => {
          this.projects = data;
        },
        error: err => {
          this.toastService.showErrorMessage("Error fetching projects!");
        }
      });
  }

  downloadReport() {
    this.isLoading = true;
    this.projectService.downloadReport(this.startDate!, this.endDate!)
      .pipe(finalize(() => {
        this.isLoading = false;
      })).subscribe({
      next: res => {
        const url = window.URL.createObjectURL(res);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'reports.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: err => {
        this.toastService.showErrorMessage("Unable to download report!");
      }
    });
  }

  downloadReportV1() {
    this.isLoading = true;
    this.projectService.downloadReportV1(this.startDate!, this.endDate!)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: ({blob, filename}) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename; // Use the filename provided by the server
          a.click();
          window.URL.revokeObjectURL(url); // Clean up the URL object
        },
        error: error => {
          this.toastService.showErrorMessage("Error fetching projects!");
        }
      });
  }
}
