import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CoingeckoService {

  constructor() { }

  // function used to fetch X token price and 24hr price change
  // eg. getTokenData("polkadot", "usd");
  public getTokenData(token: String, currency: String) {
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=' + token + '&vs_currencies=' + currency + '&include_24hr_change=true&precision=3')
  .then((response) => response.json())
  .then((data) => console.log(data));
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

    console.log(arr)

    return arr;
  }

  public getTestLabels(size: number) {
    let arr = [];

    for(let i = 0; i < size; i++) {
      arr.push("");
    }

    console.log(arr)

    return arr;
  }
  //------------
}
