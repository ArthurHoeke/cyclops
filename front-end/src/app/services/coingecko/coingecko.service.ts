import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CoingeckoService {

  constructor() { }

  // function used to fetch X token price and 24hr price change
  // eg. getTokenData("polkadot", "usd");
  getTokenData(token: String, currency: String) {
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=' + token + '&vs_currencies=' + currency + '&include_24hr_change=true&precision=3')
  .then((response) => response.json())
  .then((data) => console.log(data));
  }
}
