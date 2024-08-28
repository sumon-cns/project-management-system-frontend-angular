import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, finalize, Observable, of} from "rxjs";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {ToastService} from "../../services/toast.service";
import {LoaderComponent} from "../loader/loader.component";
import {ApiUser} from "../../models/models";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    SidebarComponent,
    NgForOf,
    LoaderComponent,
    NgIf,
    NgOptimizedImage
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  users: ApiUser[] = [];
  isLoading = false;

  constructor(private http: HttpClient, private toastService: ToastService) {
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    const apiUrl = 'https://reqres.in/api/users';
    this.isLoading = true;
    this.http.get<{ data: ApiUser[] }>(apiUrl)
      .pipe(
        finalize(() => this.isLoading = false),
        catchError(err => {
          this.toastService.showErrorMessage("Error fetching users");
          return of({data: []});
        })
      )
      .subscribe(response => {
        this.users = response.data;
      });
  }
}
