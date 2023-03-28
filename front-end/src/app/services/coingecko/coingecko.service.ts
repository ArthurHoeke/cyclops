import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CoingeckoService {

  constructor() { }

  // function used to fetch X token price and 24hr price change
  // eg. getTokenData("polkadot", "usd");
  public async getTokenData(token: String, currency: String) {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=' + currency + '&ids=' + token + '&per_page=100&page=1&sparkline=true&price_change_percentage=1d');
    return response.json();
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
