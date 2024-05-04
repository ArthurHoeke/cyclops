import { Injectable } from '@angular/core';

import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class CoingeckoService {

  constructor(private storageService: StorageService) { }


  public isRecentTimestamp(timestamp: number): boolean {
    const TEN_MINUTES = 10 * 60 * 1000; // 10 minutes in milliseconds
    const now = new Date().getTime();
    return now - timestamp < TEN_MINUTES;
  }

  // function used to fetch X token price and 24hr price change
  // eg. getTokenData("polkadot", "usd");
  public async getTokenData(token: string, currency: string): Promise<any> {
    const storedData = this.storageService.getTokenData(token);
    
    if (storedData && this.isRecentTimestamp(storedData.timestamp)) {
      return storedData.data;
    } else {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=' + currency + '&ids=' + token + '&per_page=100&page=1&sparkline=true&price_change_percentage=1d');
      const newData = await response.json();
      
      this.storageService.storeTokenData(token, newData);
      
      return newData;
    }
  }


  //------------
  //For UI testing purposes, will be deleted in phase 3
  private randomIntFromInterval(min: number, max: number, decimalPlaces: number) {  
    var rand = Math.random()*(max-min) + min;
    var power = Math.pow(10, decimalPlaces);
    return Math.floor(rand*power) / power;
  }

  public getTestData(min: number, max: number, size: number) {
    let arr = [];

    for(let i = 0; i < size; i++) {
      arr.push(this.randomIntFromInterval(min, max, 2));
    }

    return arr;
  }

  public getTestLabels(size: number) {
    let arr = [];

    for(let i = 0; i < size; i++) {
      arr.push("");
    }

    return arr;
  }
  //------------
}
