import {Injectable} from '@angular/core';
import {LoggedInUser, RegistrationRequest} from "../models/models";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl: string = 'http://localhost:8080';

  constructor(public httpClient: HttpClient, private router: Router) {
  }

  isAuthenticated(): boolean {
    const user = JSON.parse(localStorage.getItem('loggedInUser') as string) as LoggedInUser;
    const token = user && user.token;
    return token !== null;
  }

  login(username: string, password: string) {
    return this.httpClient.post(this.baseUrl + '/api/v1/login', {username, password});
  }

  register(request: RegistrationRequest) {
    return this.httpClient.post(this.baseUrl + '/api/v1/register', request);
  }

  getLoggedInUser(): LoggedInUser {
    return JSON.parse(localStorage.getItem('loggedInUser') as string) as LoggedInUser;
  }

  clearLoggedInUserInfo() {
    localStorage.removeItem("loggedInUser");
  }
}
