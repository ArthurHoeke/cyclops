import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  public setAccessToken(accessToken: string) {
    localStorage.setItem("accessToken", accessToken);
  }

  public getAccessToken() {
    return String(localStorage.getItem("accessToken"));
  }

  public clearAccessToken() {
    localStorage.removeItem("accessToken")
  }
}
