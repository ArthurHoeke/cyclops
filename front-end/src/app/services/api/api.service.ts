import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }

  // base URL of the back-end API that the service will be interacting with, change to your own domain
  api: string = "https://domain.com/api";
}
