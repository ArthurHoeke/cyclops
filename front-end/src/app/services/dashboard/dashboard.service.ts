import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

import { ChartData, ChartType, Chart } from 'chart.js';

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

  private getSelectedValidatorData(valIndex: number) {
    const selVal = this.validatorList[valIndex - 1];
    const selNetwork = this.networkList[valIndex - 1];
    
    const past = (selNetwork['era']['eraProcess'] / selNetwork['era']['eraLength']) * 100;
    this.updateEraProgress(past, 100 - past);
  }

  public selectValidator(index: number) {
    if(index == 0) {
      //add check for overview
    } else {
      this.getSelectedValidatorData(index);
    }
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

  private updateEraProgress(pastEraPercentage: number, leftEraPercentage: number) {
    this.pastEraPercentage = pastEraPercentage;
    this.leftEraPercentage = leftEraPercentage;

    this.eraProgressData.datasets.forEach((dataset) => {
      dataset.data = [pastEraPercentage, leftEraPercentage];
    });
  }

  public eraProgressData: ChartData<'doughnut', number[], string | string[]> = {
    labels: ['Past', 'Left'],
    datasets: [{
      data: [this.pastEraPercentage, this.leftEraPercentage],
      backgroundColor: [
        '#78023B',
        '#313035',
      ],
      borderAlign: 'center',
      borderRadius: 5,
      borderWidth: 0,
      spacing: 0,

    }]
  };
}
