import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { CoingeckoService } from '../coingecko/coingecko.service';

import { ChartData, ChartType, Chart } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import { Timestamp } from 'rxjs';

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

  public totalEarned = 0;
  public eraRewardPoints = [];

  public validatorNetworkTokenPrice = 0;
  public validatorNetworkIcon = "";

  private totalRewardsToday = 0;

  constructor(private apiService: ApiService, private coingeckoService: CoingeckoService, private toastr: ToastrService) { }

  public async updateDashboardData() {
    await this.updateNetworkList();
    await this.updateValidatorList();
    await this.getDashboardData();
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
    this.toastr.clear();
    this.toastr.info('Fetching validators..', "Cyclops API", {
      positionClass: "toast-top-left",
      timeOut: 0,
      extendedTimeOut: 0
    });
    await this.apiService.getValidators().then(async (res: any) => {
      this.validatorList = res['data'];

      for(let i = 0; i < this.validatorList.length; i++) {
        await this.apiService.getWeeklyRewardsFromValidator(this.validatorList[i].id).then((data: any) => {
          this.validatorList[i].weeklyRewardList = data['data'];
        });
      }

    }).catch((err) => {
      console.log(err);
    })
  }

  public async updateNetworkList() {
    this.toastr.info('Fetching network data..', "Coingecko API", {
      positionClass: "toast-top-left",
      timeOut: 0,
      extendedTimeOut: 0
    });
    await this.apiService.getNetworks().then(async (res: any) => {
      this.networkList = res['data'];

      //get prices using coingecko
      for (let i = 0; i < this.networkList.length; i++) {
        const self = this;
        await this.coingeckoService.getTokenData(this.networkList[i]['name'], 'usd').then((data) => {
          self.networkList[i].price = data[0]['current_price'];
          self.networkList[i].change = data[0]['price_change_percentage_24h'];
          self.networkList[i].sparkline = data[0]['sparkline_in_7d']['price'];
        });
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  private calculateDecimals(input: any, decimals: any) {
    let divide = "1";
    for (let i = 0; i < decimals; i++) {
      divide = divide + "0";
    }
    return input / parseInt(divide);
  }

  private getSelectedValidatorData(valIndex: number) {
    const selVal = this.validatorList[valIndex - 1];
    const selNetwork = this.networkList[selVal.networkId - 1];

    if (selVal['details']['status'] == "active") {
      this.selectedValidatorActive = true;
      this.updateEraRewardPoints(selVal['details']['rewardTracking']);
    } else {
      this.selectedValidatorActive = false;
    }

    const past = (selNetwork['era']['eraProcess'] / selNetwork['era']['eraLength']) * 100;
    this.updateEraProgress(past, 100 - past);

    this.validatorNetworkTokenPrice = selNetwork['price'];
    this.validatorNetworkIcon = selNetwork['icon'];

    this.updateSparkline(selNetwork['sparkline'], selNetwork['change']);

    this.updateWeeklyRewardList(selVal['weeklyRewardList'], selNetwork['price'], selNetwork['decimals']);
  }

  private async getDashboardData() {
    this.toastr.clear();
    this.toastr.info('Fetching dashboard data..', "Cyclops API", {
      positionClass: "toast-top-left"
    });
    let incomePerValidator: any = await this.apiService.getIncomeDistribution();
    incomePerValidator = incomePerValidator['data'];

    let totalEarned = 0;
    let incomeList: any = [];
    let nameList: any = [];
    for (let i = 0; i < incomePerValidator.length; i++) {
      const incomeInUSD = this.networkList[incomePerValidator[i].networkId - 1]['price'] * this.calculateDecimals(incomePerValidator[i]['totalEarned'], this.networkList[incomePerValidator[i].networkId - 1]['decimals']);

      totalEarned += incomeInUSD;

      incomeList.push(incomeInUSD);
      nameList.push(this.validatorList[i]['name']);
    }

    this.incomePieData.datasets.forEach((dataset) => {
      dataset.data = incomeList;
    });

    this.incomePieData.labels = nameList;
    this.totalEarned = totalEarned;

    Chart.getChart("incomePieChart")?.update("normal");


    //calculate combined rewards
    let combinedDailyRewards = [0,0,0,0,0,0,0];
    for(let i = 0; i < this.validatorList.length; i++) {
      const val = this.validatorList[i];
      const net = this.networkList[val.networkId - 1];
      for(let i2 = 0; i2 < val['weeklyRewardList'].length; i2++) {
        const rewardObj = val['weeklyRewardList'][i2];

        const dayIndex = this.getWeekdayIndexFromUnixTimestamp(rewardObj['timestamp']);
        
        combinedDailyRewards[dayIndex] += net['price'] * this.calculateDecimals(rewardObj['reward_sum'], net['decimals'])
      }
    }

    this.dailyIncomeData.datasets.forEach((dataset) => {
      dataset.data = combinedDailyRewards;
    });

    Chart.getChart("combinedDailyRewardChart")?.update("normal");
    this.totalRewardsToday = combinedDailyRewards[new Date().getDay()];

    this.toastr.clear();
  }

  private getWeekdayIndexFromUnixTimestamp(unixTimestamp: any) {
    const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
    const weekdayIndex = date.getDay() - 1; // Sunday is 0, subtract 1 to make Monday 0
    return weekdayIndex < 0 ? 6 : weekdayIndex; // Convert negative values to Sunday (6)
  }

  public async selectValidator(index: number) {
    if (index == 0) {
      await this.getDashboardData();
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
    return "$ " + this.round(this.totalEarned);
  }

  public getValidatorNetworkTokenPrice() {
    return "$ " + this.validatorNetworkTokenPrice;
  }

  public getValidatorNetworkIcon() {
    return this.validatorNetworkIcon;
  }

  public getTotalRewardsToday() {
    //dummy
    return "$ " + this.addThousandSeperator((this.totalRewardsToday).toFixed(2));
  }
  
  private updateWeeklyRewardList(data: any, tokenPrice: any, decimals: any) {
    const weeklyRewardList = [0,0,0,0,0,0,0];

    for(let i = 0; i < data.length; i++) {
      const dayIndex = this.getWeekdayIndexFromUnixTimestamp(data[i]['timestamp']);
      weeklyRewardList[dayIndex] = tokenPrice * this.calculateDecimals(data[i].reward_sum, decimals);
    }

    this.dailyIncomeData.datasets.forEach((dataset) => {
      dataset.data = weeklyRewardList;
    });

    Chart.getChart("weeklyOverviewChart")?.update("normal");
  }

  private updateEraProgress(pastEraPercentage: number, leftEraPercentage: number) {
    this.pastEraPercentage = pastEraPercentage;
    this.leftEraPercentage = leftEraPercentage;

    this.eraProgressData.datasets.forEach((dataset) => {
      dataset.data = [pastEraPercentage, leftEraPercentage];
    });

    Chart.getChart("eraPieChart")?.update("normal");
  }

  private updateSparkline(sparkline: any, change: any) {
    this.tokenChartData.labels = this.createEmptyLabelList(sparkline);
    let chartColorRGB = "";

    if(change <= 0) {
      chartColorRGB = "211,38,38";
    } else {
      chartColorRGB = "93,212,37";
    }

    this.tokenChartData.datasets.forEach((dataset) => {
      dataset.data = sparkline;
      dataset.gradient = {
        backgroundColor: {
          axis: 'y',
          colors: {
            0: 'rgba(' + chartColorRGB + ',0)',
            10000: 'rgba(' + chartColorRGB + ',1)'
          }
        },
        borderColor: {
          axis: 'x',
          colors: {
            1: 'rgba(' + chartColorRGB + ',1)',
          }
        }
      }
    });

    Chart.getChart("sparklineChart")?.update("normal");
  }

  private updateEraRewardPoints(data: any) {
    this.eraRewardPoints = data;

    this.eraChartData.labels = this.createEmptyLabelList(data);
    this.eraChartData.datasets.forEach((dataset) => {
      dataset.data = data;
    });

    Chart.getChart("eraPointChart")?.update("normal");
  }

  private createEmptyLabelList(input: any) {
    let output = [];
    for (let i = 0; i < input.length; i++) {
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
    labels: [],
    datasets: [{
      data: [],
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
    labels: [],
    datasets: [{
      data: [],
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
      data: [],
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

  public round(percentage: number) {
    return Math.round(percentage);
  }

  addThousandSeperator(number: any) {
    const parts = number.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }
}
