import {Component, OnInit} from '@angular/core';
import {LoaderComponent} from "../loader/loader.component";
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {Project, User} from "../../models/models";
import {IDropdownSettings, NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectService} from "../../services/project.service";
import {finalize} from "rxjs";
import {ToastService} from "../../services/toast.service";
import moment from "moment";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [
    LoaderComponent,
    NgIf,
    FormsModule,
    SidebarComponent,
    NgForOf,
    NgMultiSelectDropDownModule
  ],
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.css'
})
export class EditProjectComponent implements OnInit {

  isLoading: boolean = false;
  project: Project = {
    name: '',
    id: 0,
    intro: '',
    projectStatus: 'pre',
    startDateTime: undefined,
    endDateTime: new Date(),
    members: [],
    memberIds: [],
    owner: {id: 0, email: '', fullName: '', username: ''},
    ownerId: 0
  };
  availableMembers: User[] = [];
  selectedMembers: any = [];
  startDateTime: string = '';
  endDateTime: string = '';

  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'item_id',
    textField: 'item_text',
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  constructor(private projectService: ProjectService, private activatedRoute: ActivatedRoute,
              private toastService: ToastService, private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    this.fetchProject();
    this.fetchAvailableMembers();
  }


  submitForm() {
    this.isLoading = true;
    this.projectService.updateProject({
      name: this.project.name,
      id: this.project.id,
      projectStatus: this.project.projectStatus,
      startDateTime: this.startDateTime && new Date(this.startDateTime).toISOString(),
      endDateTime: new Date(this.endDateTime).toISOString(),
      intro: this.project.intro
    }).pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res) => {
          this.toastService.showSuccessMessage("Successfully updated project!")
          this.fetchProject();
          this.fetchAvailableMembers();
        },
        error: (err) => {
          this.toastService.showErrorMessage("Unable to update project!");
          console.log(err);
        }
      });
  }

  addUsers() {
    if (this.selectedMembers && this.selectedMembers.length > 0) {
      this.projectService.addUsers(this.project.id, this.selectedMembers.map((it: any) => it.item_id))
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: (res) => {
            this.toastService.showSuccessMessage("Successfully added member(s)");
            this.selectedMembers = [];
            this.fetchProject();
            this.fetchAvailableMembers();
          },
          error: (err) => {
            this.toastService.showErrorMessage("Unable to fetch project!");
          }
        });
    } else {
      this.toastService.showErrorMessage("Please select one or more member(s) to add");
    }

  }

  removeMember(userId: number) {
    this.isLoading = true;
    this.activatedRoute.params.subscribe(params => {
      this.projectService.removeMember(params['id'], userId)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: (res) => {
            this.toastService.showSuccessMessage("Successfully removed member!");
            this.fetchProject();
            this.fetchAvailableMembers();
          },
          error: (err) => this.toastService.showErrorMessage("Unable to remove member!")
        });
    });
  }

  fetchAvailableMembers() {
    this.isLoading = true;
    this.activatedRoute.params.subscribe(params => {
      this.projectService.fetchAvailableMembers(params['id'])
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: res => this.availableMembers = res,
          error: err => this.toastService.showErrorMessage("Unable to fetch project!")
        });
    });
  }

  fetchProject() {
    this.isLoading = true;
    this.activatedRoute.params.subscribe(params => {
      this.projectService.fetchProject(params["id"])
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: res => {
            this.project = res;
            if (this.project.ownerId != this.authService.getLoggedInUser().id) {
              this.router.navigate(['/'])
                .then(() => this.toastService.showErrorMessage("You are not allowed to edit this project!"));
              return;
            }
            if (res.startDateTime) this.startDateTime = moment(res.startDateTime).format('yyyy-MM-DD');
            this.endDateTime = moment(res.endDateTime).format('yyyy-MM-DD');
          },
          error: err => this.toastService.showErrorMessage("Unable to fetch project!")
        });
    });
  }

  getAvailableMembers() {
    return this.availableMembers.map(it => ({item_id: it.id, item_text: it.username + ' - ' + it.fullName}));
  }
}
