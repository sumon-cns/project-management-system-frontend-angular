import {Injectable} from '@angular/core';
import {map, Observable} from "rxjs";
import {LoggedInUser, Project, ProjectCreationRequest, ProjectUpdateRequest, User} from "../models/models";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  baseUrl = "http://localhost:8080";

  constructor(public httpClient: HttpClient) {
  }

  createProject(projectCreationRequest: ProjectCreationRequest) {
    const user = JSON.parse(localStorage.getItem('loggedInUser') as string) as LoggedInUser;
    const url = `${this.baseUrl}/api/v1/projects`;
    projectCreationRequest.ownerId = user.id;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${user.token}`,
      'Content-Type': 'application/json'
    });
    return this.httpClient.post<string>(url, projectCreationRequest, {headers, responseType: 'text' as 'json'});

  }

  fetchProjects(startDate: string, endDate: string): Observable<Project[]> {
    const user = JSON.parse(localStorage.getItem('loggedInUser') as string) as LoggedInUser;
    const url = `${this.baseUrl}/api/v1/users/${user.id}/projects?fromDate=${new Date(startDate).toISOString()}&toDate=${new Date(endDate).toISOString()}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${user.token}`,
      'Content-Type': 'application/json'
    });
    return this.httpClient.get<Project[]>(url, {headers});
  }

  fetchProject(projectId: number) {
    const user = JSON.parse(localStorage.getItem('loggedInUser') as string) as LoggedInUser;
    const url = `${this.baseUrl}/api/v1/projects/${projectId}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${user.token}`,
      'Content-Type': 'application/json'
    });
    return this.httpClient.get<Project>(url, {headers});
  }

  deleteProject(projectId: number) {
    const user = JSON.parse(localStorage.getItem('loggedInUser') as string) as LoggedInUser;
    const url = `${this.baseUrl}/api/v1/projects/${projectId}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${user.token}`
    });
    return this.httpClient.delete<string>(url, {headers, responseType: 'text' as 'json'});
  }

  fetchAvailableMembers(projectId: number) {
    const user = JSON.parse(localStorage.getItem('loggedInUser') as string) as LoggedInUser;
    const url = `${this.baseUrl}/api/v1/projects/${projectId}/available-users`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${user.token}`
    });
    return this.httpClient.get<User[]>(url, {headers});
  }

  updateProject(projectUpdateRequest: ProjectUpdateRequest) {
    const user = JSON.parse(localStorage.getItem('loggedInUser') as string) as LoggedInUser;
    const url = `${this.baseUrl}/api/v1/projects/${projectUpdateRequest.id}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${user.token}`
    });
    return this.httpClient.put<string>(url, projectUpdateRequest, {headers, responseType: 'text' as 'json'});
  }

  addUsers(projectId: number, users: number[]) {
    const user = JSON.parse(localStorage.getItem('loggedInUser') as string) as LoggedInUser;
    const url = `${this.baseUrl}/api/v1/projects/${projectId}/users`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${user.token}`
    });
    return this.httpClient.put<string>(url, users, {headers, responseType: 'text' as 'json'});
  }

  removeMember(projectId: number, userId: number) {
    const user = JSON.parse(localStorage.getItem('loggedInUser') as string) as LoggedInUser;
    const url = `${this.baseUrl}/api/v1/projects/${projectId}/users/${userId}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${user.token}`
    });
    return this.httpClient.delete<string>(url, {headers, responseType: 'text' as 'json'});
  }

  downloadReport(fromDate: string, toDate: string) {
    const user = JSON.parse(localStorage.getItem('loggedInUser') as string) as LoggedInUser;
    const url = `${this.baseUrl}/api/v1/users/${user.id}/projects/report?fromDate=${new Date(fromDate).toISOString()}&toDate=${new Date(toDate).toISOString()}`
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${user.token}`
    });
    return this.httpClient.get(url, {headers, responseType: 'blob'});
  }

  downloadReportV1(fromDate: string, toDate: string): Observable<{ blob: Blob, filename: string }> {
    const user = JSON.parse(localStorage.getItem('loggedInUser') as string) as LoggedInUser;
    const url = `${this.baseUrl}/api/v1/users/${user.id}/projects/report?fromDate=${new Date(fromDate).toISOString()}&toDate=${new Date(toDate).toISOString()}`
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${user.token}`
    });
    return this.httpClient.get(url, {
      headers,
      observe: 'response',
      responseType: 'blob'
    }).pipe(
      map((response: HttpResponse<Blob>) => {
        // Extract filename from Content-Disposition header
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'reports.pdf'; // Default filename if not found

        if (contentDisposition) {
          const matches = /filename="([^"]*)"/.exec(contentDisposition);
          if (matches != null && matches[1]) {
            filename = matches[1];
          }
        }
        return {
          blob: response.body as Blob,
          filename: filename
        };
      })
    );
  }
}
