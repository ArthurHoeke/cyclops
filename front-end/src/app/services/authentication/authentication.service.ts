import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Router } from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt';
import { StorageService } from '../storage/storage.service';

import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private jwtHelper: JwtHelperService, private storageService: StorageService, private apiService: ApiService) { }

  private role = 0;
  private authStatus = false;

  public async verifyJWT() {
    const verified = await this.apiService.verifyJWT();
    return verified;
  }

  public isAuthenticated() {
    return this.authStatus;
  }

  public setRole(roleId: number) {
    this.role = roleId;
  }

  public isAdmin() {
    if(this.role == 1) {
      return true;
    } else {
      return false;
    }
  }

  public setAuthenticationStatus(status: boolean) {
    this.authStatus = status;
  }
}
