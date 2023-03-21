import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  // Number variable that keeps track of the selected validator and used for panel switching
  // index 0 = overview
  private selectedValidator: Number = 0;

  public validatorList: any = [];
  public networkList: any = [];

  constructor(private apiService: ApiService) { }

  public getValidatorList() {
    this.apiService.getValidators().then((res: any) => {
      this.validatorList = res['data'];
      console.log(this.validatorList)
    }).catch((err) => {
      console.log(err);
    })
  }

  public getNetworkList() {
    this.apiService.getNetworks().then((res: any) => {
      this.networkList = res['data'];
    }).catch((err) => {
      console.log(err);
    })
  }

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
