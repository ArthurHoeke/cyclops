import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Router } from '@angular/router';

import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private router: Router, private storageService: StorageService) { }

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
          reject(err);
        });
    });
    return promise;
  }

  setSubscanApiKey(subscanApiKey: string) {
    const body = new HttpParams()
      .set('subscanApiKey', subscanApiKey)
    let promise = new Promise((resolve, reject) => {
      let apiURL = this.getBaseURL() + "config/setSubscanApiKey";
      this.http.post(apiURL, body.toString(), {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('auth-token', this.storageService.getAccessToken()),
          responseType: 'text'
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

  getIncomeDistribution() {
    let promise = new Promise((resolve, reject) => {
      let apiURL = this.getBaseURL() + "reward/getIncomeDistribution";
      this.http.get(apiURL, {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('auth-token', this.storageService.getAccessToken())
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

  getAllRewardsFromValidator(validatorId: string) {
    const body = new HttpParams()
      .set('id', validatorId)
    let promise = new Promise((resolve, reject) => {
      let apiURL = this.getBaseURL() + "reward/getAllRewardsFromValidator";
      this.http.post(apiURL, body.toString(), {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('auth-token', this.storageService.getAccessToken())
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

  getMonthlyRewardReportFromValidator(validatorId: string, timestamp: string) {
    const body = new HttpParams()
      .set('id', validatorId)
      .set('timestamp', timestamp)
    let promise = new Promise((resolve, reject) => {
      let apiURL = this.getBaseURL() + "reward/getMonthlyRewardReportFromValidator";
      this.http.post(apiURL, body.toString(), {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('auth-token', this.storageService.getAccessToken())
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

  getWeeklyRewardsFromValidator(validatorId: string) {
    const body = new HttpParams()
      .set('id', validatorId)
    let promise = new Promise((resolve, reject) => {
      let apiURL = this.getBaseURL() + "reward/getWeeklyRewardsFromValidator";
      this.http.post(apiURL, body.toString(), {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('auth-token', this.storageService.getAccessToken())
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

  getValidatorRewardOverview(validatorId: string) {
    const body = new HttpParams()
      .set('id', validatorId)
    let promise = new Promise((resolve, reject) => {
      let apiURL = this.getBaseURL() + "reward/getValidatorRewardOverview";
      this.http.post(apiURL, body.toString(), {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('auth-token', this.storageService.getAccessToken())
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

  syncValidator(validatorId: string) {
    const body = new HttpParams()
      .set('id', validatorId)
    let promise = new Promise((resolve, reject) => {
      let apiURL = this.getBaseURL() + "reward/sync";
      this.http.post(apiURL, body.toString(), {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('auth-token', this.storageService.getAccessToken()),
          responseType: 'text'
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

  getAllEvents() {
    let promise = new Promise((resolve, reject) => {
      let apiURL = this.getBaseURL() + "event/all";
      this.http.get(apiURL, {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('auth-token', this.storageService.getAccessToken())
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

  deleteEvent(eventId: string) {
    const body = new HttpParams()
      .set('id', eventId)
    let promise = new Promise((resolve, reject) => {
      let apiURL = this.getBaseURL() + "event/remove";
      this.http.post(apiURL, body.toString(), {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('auth-token', this.storageService.getAccessToken()),
          responseType: 'text'
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

  verifyJWT() {
    let promise = new Promise((resolve, reject) => {
      let apiURL = this.getBaseURL() + "user/verify";
      this.http.get(apiURL, {
        headers: new HttpHeaders()
          .set('auth-token', this.storageService.getAccessToken())
      })
        .toPromise()
        .then(
          res => {
            resolve(res);
          }
        ).catch((err) => {
          resolve(err);
        });
    });
    return promise;
  }

  getValidators() {
    let promise = new Promise((resolve, reject) => {
      let apiURL = this.getBaseURL() + "validator/list";
      this.http.get(apiURL, {
        headers: new HttpHeaders()
          .set('auth-token', this.storageService.getAccessToken())
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

  addValidator(name: string, address: string, networkId: number) {
    const body = new HttpParams()
      .set('name', name)
      .set('address', address)
      .set('networkId', networkId)
    let promise = new Promise((resolve, reject) => {
      let apiURL = this.getBaseURL() + "validator/add";
      this.http.post(apiURL, body.toString(), {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('auth-token', this.storageService.getAccessToken()),
          responseType: 'text'
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

  addNetwork(name: string, ticker: string, icon: string, decimals: string) {
    const body = new HttpParams()
      .set('name', name)
      .set('ticker', ticker)
      .set('icon', icon)
      .set('decimals', decimals)
    let promise = new Promise((resolve, reject) => {
      let apiURL = this.getBaseURL() + "network/create";
      this.http.post(apiURL, body.toString(), {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('auth-token', this.storageService.getAccessToken()),
          responseType: 'text'
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

  getNetworks() {
    let promise = new Promise((resolve, reject) => {
      let apiURL = this.getBaseURL() + "network/list";
      this.http.get(apiURL, {
        headers: new HttpHeaders()
          .set('auth-token', this.storageService.getAccessToken())
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
}
