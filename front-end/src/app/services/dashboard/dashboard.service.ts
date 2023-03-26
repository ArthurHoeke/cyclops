import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  // Number variable that keeps track of the selected validator and used for panel switching
  // index 0 = overview
  private selectedValidator: Number = 0;
  private syncing: Boolean = false;

  public validatorList: any = [];
  public networkList: any = [];

  public pastEraPercentage = 50;
  public leftEraPercentage = 50;

  constructor(private apiService: ApiService) { }

  public updateDashboardData() {
    this.updateNetworkList();
    this.updateValidatorList();
  }

  public toggleSyncing() {
    this.syncing = !this.syncing
  }

  public isSyncing() {
    return this.syncing;
  }

  public async updateValidatorList() {
    await this.apiService.getValidators().then((res: any) => {
      this.validatorList = res['data'];
    }).catch((err) => {
      console.log(err);
    })
  }

  public updateNetworkList() {
    this.apiService.getNetworks().then((res: any) => {
      this.networkList = res['data'];
    }).catch((err) => {
      console.log(err);
    })
  }

  private getSelectedValidatorData(valIndex: Number) {
  }

  public selectValidator(index: Number) {
    this.getSelectedValidatorData(index);
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
