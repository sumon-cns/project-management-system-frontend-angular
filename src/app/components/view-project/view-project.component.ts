import {Component, OnInit} from '@angular/core';
import {SidebarComponent} from "../sidebar/sidebar.component";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {Project} from "../../models/models";
import {ProjectService} from "../../services/project.service";
import {ActivatedRoute} from "@angular/router";
import {finalize} from "rxjs";
import {ToastService} from "../../services/toast.service";
import {LoaderComponent} from "../loader/loader.component";

@Component({
  selector: 'app-view-project',
  standalone: true,
  imports: [
    SidebarComponent,
    NgIf,
    NgForOf,
    LoaderComponent,
    DatePipe
  ],
  templateUrl: './view-project.component.html',
  styleUrl: './view-project.component.css'
})
export class ViewProjectComponent implements OnInit {
  project?: Project
  isLoading: boolean = false;

  constructor(private projectService: ProjectService, private activatedRoute: ActivatedRoute,
              private toastService: ToastService) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.fetchProject(params['id']);
    });
  }

  fetchProject(projectId: number) {
    this.isLoading = true;
    this.projectService.fetchProject(projectId)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res) => this.project = res,
        error: (err) => this.toastService.showErrorMessage("Unable to fetch project!")
      });
  }


}
