import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  // Number variable that keeps track of the selected validator and used for panel switching
  // index 0 = overview
  private selectedValidator: Number = 0;

  constructor() { }

  public selectValidator(index: Number) {
    this.selectedValidator = index;
  }

  public getSelectedValidator() {
    return this.selectedValidator;
  }

  public getTotalCombinedRewards() {
    //dummy
    return "$ 23,482";
  }

  public getTotalRewardsToday() {
    //dummy
    return "$ 124.12";
  }
}
