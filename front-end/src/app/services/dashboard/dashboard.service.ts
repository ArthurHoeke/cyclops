import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  // Number variable that keeps track of the selected validator and used for panel switching
  // index 0 = overview
  selectedValidator: Number = 0;

  constructor() { }

  selectValidator(index: Number) {
    this.selectedValidator = index;
  }

  getSelectedValidator() {
    return this.selectedValidator;
  }

  getTotalCombinedRewards() {
    //dummy
    return "$ 23,482";
  }

  getTotalRewardsToday() {
    //dummy
    return "$ 124.12";
  }
}
