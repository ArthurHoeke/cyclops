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

  public storeTokenData(token: string, data: any): void {
    const timestamp = new Date().getTime();
    const dataWithTimestamp = { data: data, timestamp: timestamp };
    localStorage.setItem(token, JSON.stringify(dataWithTimestamp));
  }

  public getTokenData(token: string): any {
    const storedData = localStorage.getItem(token);
    return storedData ? JSON.parse(storedData) : null;
  }
}
