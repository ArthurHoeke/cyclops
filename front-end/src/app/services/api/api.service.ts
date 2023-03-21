import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Router } from '@angular/router';

import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private router: Router, private authenticationService: AuthenticationService) { }

  // base URL of the back-end API that the service will be interacting with, change to your own domain
  private api: string = "http://localhost:3000/";

  public getBaseURL() {
    return this.api;
  }

  login(email: string, password: string) {
    const body = new HttpParams()
    .set('email', email)
    .set('password', password)
    let promise = new Promise((resolve, reject) => {
      let apiURL = this.getBaseURL() + "user/login";
      this.http.post(apiURL, body.toString(), {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      })
        .toPromise()
        .then(
          res => {
            resolve(res);
          }
        ).catch((err) => {
          reject(err);
        });
    });
    return promise;
  }

  register(email: string, password: string) {
    const body = new HttpParams()
    .set('email', email)
    .set('password', password)
    let promise = new Promise((resolve, reject) => {
      let apiURL = this.getBaseURL() + "user/register";
      this.http.post(apiURL, body.toString(), {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      })
        .toPromise()
        .then(
          res => {
            resolve(res);
          }
        ).catch((err) => {
          // if(err.status == 200) {
          //   resolve(err);
          // } else {
          //   reject(err);
          // }
          console.log(err);
        });
    });
    return promise;
  }
}
