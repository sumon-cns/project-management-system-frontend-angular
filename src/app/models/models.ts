import {Component} from "@angular/core";

export interface LoggedInUser {
  id: number;
  username: string;
  email: string;
  fullName: string;
  token: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
}

export interface Project {
  id: number;
  name: string;
  intro: string,
  projectStatus: string,
  startDateTime?: Date,
  endDateTime: Date,
  ownerId: number;
  owner: User,
  members: User[],
  memberIds: number[]
}

export interface RegistrationRequest {
  fullName: string;
  email: string;
  username: string;
  password: string;
}

export interface ProjectCreationRequest {
  name: string;
  intro: string;
  projectStatus: string;
  startDateTime?: string;
  endDateTime: string;
  ownerId: number;
}


export interface ProjectUpdateRequest {
  id: number;
  name: string;
  intro: string;
  projectStatus: string;
  startDateTime?: string;
  endDateTime: string;
}

export interface ApiUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}
