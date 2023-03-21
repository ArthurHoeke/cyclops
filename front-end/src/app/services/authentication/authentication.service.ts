import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Router } from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private jwtHelper: JwtHelperService) { }

  public setAccessToken(accessToken: string) {
    localStorage.setItem("accessToken", accessToken);
  }

  public getAccessToken() {
    return localStorage.getItem("accessToken");
  }

  public clearAccessToken() {
    localStorage.removeItem("accessToken")
  }

  public isAuthenticated() {
    return !this.jwtHelper.isTokenExpired(this.getAccessToken());
  }
}
