import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { CoingeckoService } from '../coingecko/coingecko.service';

import { ChartData, ChartType, Chart } from 'chart.js';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  // Number variable that keeps track of the selected validator and used for panel switching
  // index 0 = overview
  private selectedValidator: Number = 0;
  private selectedValidatorActive = false;
  private syncing: Boolean = false;

  public validatorList: any = [];
  public networkList: any = [];

  public pastEraPercentage = 50;
  public leftEraPercentage = 50;

  public eraRewardPoints = [];

  constructor(private apiService: ApiService, private coingeckoService: CoingeckoService) { }

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

  public isActive() {
    return this.selectedValidatorActive;
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
    const selNetwork = this.networkList[selVal.networkId - 1];
    
    if(selVal['details']['status'] == "active") {
      this.selectedValidatorActive = true;
      const past = (selNetwork['era']['eraProcess'] / selNetwork['era']['eraLength']) * 100;
      this.updateEraProgress(past, 100 - past);
      this.updateEraRewardPoints(selVal['details']['rewardTracking']);
    } else {
      this.selectedValidatorActive = false;
    }
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

  private updateEraRewardPoints(data: any) {
    this.eraRewardPoints = data;

    this.eraChartData.labels = this.createEmptyLabelList(data);
    this.eraChartData.datasets.forEach((dataset) => {
      dataset.data = data;
    });
  }

  private createEmptyLabelList(input: any) {
    let output = [];
    for(let i = 0; i < input.length; i++) {
      output.push("");
    }
    return output;
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

  public eraChartData: ChartData<'line', number[], string | string[]> = {
    labels: [],
    datasets: [{
      data: this.eraRewardPoints,
      borderWidth: 2,
      pointRadius: 2,
      tension: 0.35,
      gradient: {
        backgroundColor: {
          axis: 'y',
          colors: {
            0: 'rgba(255,238,122,0)',
            100000: 'rgba(239,157,0,1)'
          }
        },
        borderColor: {
          axis: 'x',
          colors: {
            1: '#FFC300',
          }
        }
      },
      pointBorderColor: "white",
      fill: true,
    }],
  };

  public tokenChartData: ChartData<'line', number[], string | string[]> = {
    labels: this.coingeckoService.getTestLabels(60),
    datasets: [{
      data: this.coingeckoService.getTestData(6, 12, 60),
      borderWidth: 3,
      pointRadius: 0,
      tension: 0.25,
      gradient: {
        backgroundColor: {
          axis: 'y',
          colors: {
            0: 'rgba(93,212,37,0)',
            10000: 'rgba(93,212,37,1)'
          }
        },
        borderColor: {
          axis: 'x',
          colors: {
            1: '#68C813',
          }
        }
      },
      pointBorderColor: "white",
      fill: true,
    }],
  };

  public lineChartData: ChartData<'line', number[], string | string[]> = {
    labels: ['2/22', '2/23', '2/24', '2/25', '2/26', '2/27', '2/28'],
    datasets: [{
      data: [5000, 5100, 5312, 5681, 5923, 6123, 6421, 6734],
      borderWidth: 2,
      pointRadius: 2,
      tension: 0.35,
      gradient: {
        backgroundColor: {
          axis: 'y',
          colors: {
            0: 'rgba(230,0,122,.2)',
            10000: 'rgba(230,0,122,.6)'
          }
        },
        borderColor: {
          axis: 'x',
          colors: {
            1: 'rgba(230,0,122,1)',
          }
        }
      },
      pointBorderColor: "white",
      fill: true,
    }],

  };

  public incomePieData: ChartData<'doughnut', number[], string | string[]> = {
    labels: ['Amsterdam', 'Dublin', 'Paris', 'Test'],
    datasets: [{
      data: [300, 500, 100],
      backgroundColor: [
        '#5CBD0C',
        '#F7C217',
        '#FF5072',
        '#A7E2FD'
      ],
      borderAlign: 'center',
      borderRadius: 100,
      borderWidth: 0,
      spacing: 10,
    }]
  };

  public dailyIncomeData: ChartData<'bar', number[], string | string[]> = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [{
      data: [15.23, 28, 12.1, 30, 11, 23, 0],
      backgroundColor: [
        '#14151B'
      ],
      borderColor: [
        '#202127'
      ],
      borderWidth: 0,
      borderRadius: 5,
      // barPercentage: 0.5,
      barThickness: 30,
      maxBarThickness: 30,
      minBarLength: 2,
      gradient: {
        backgroundColor: {
          axis: 'y',
          colors: {
            0: 'rgba(230,0,122,.2)',
            100: 'rgba(230,0,122,1)'
          }
        },
      },
    }]
  };
}
