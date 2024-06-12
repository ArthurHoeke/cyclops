import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { CoingeckoService } from '../coingecko/coingecko.service';

import { ChartData, Chart } from 'chart.js';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  // Number variable that keeps track of the selected validator and used for panel switching
  // index 0 = overview
  private selectedValidator: number = 0;
  private selectedValidatorActive = false;
  private syncing: Boolean = false;

  public validatorList: any = [];
  public networkList: any = [];

  public eventList: any = [];
  public poolList: any = [];
  public selectValEventList: any = [];

  public validatorRewardOverview: any;

  public pastEraPercentage = 50;
  public leftEraPercentage = 50;

  public totalEarned = 0;
  public eraRewardPoints = [];

  public validatorNetworkTokenPrice = 0;
  public validatorNetworkIcon = "";

  private totalRewardsToday = 0;

  private bonded_total: any = 0;
  private bonded_owner: any = 0;
  private bonded_nominators: any = 0;

  private count_nominators: any = 0;

  public thousandValData = null;

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

  public async removeEvent(eventId: string) {
    await this.apiService.deleteEvent(eventId);

    this.updateEventList();
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
      console.log(this.validatorList)

      for (let i = 0; i < this.validatorList.length; i++) {
        await this.apiService.getWeeklyRewardsFromValidator(this.validatorList[i].id).then((data: any) => {
          this.validatorList[i].weeklyRewardList = data['data'];
        });

        await this.apiService.getMonthlyRewardsFromValidator(this.validatorList[i].id).then((data: any) => {
          this.validatorList[i].monthlyRewardList = data['data'];
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

  public calculateDecimals(input: any, decimals: any) {
    let divide = "1";
    for (let i = 0; i < decimals; i++) {
      divide = divide + "0";
    }
    return input / parseInt(divide);
  }

  private async getSelectedValidatorData(valIndex: number) {
    const selVal = this.validatorList[valIndex - 1];
    const selNetwork = this.networkList[selVal.networkId - 1];

    if (selVal['details']['status'] == "active") {
      this.selectedValidatorActive = true;

      this.updateEraRewardPoints(selVal['details']['rewardTracking']);

      this.bonded_total = this.calculateDecimals(selVal['details']['bonded_total'], selNetwork['decimals']).toFixed(2);
      this.bonded_owner = this.calculateDecimals(selVal['details']['bonded_owner'], selNetwork['decimals']).toFixed(2);
      this.bonded_nominators = this.calculateDecimals(selVal['details']['bonded_nominators'], selNetwork['decimals']).toFixed(2);
    } else {
      this.selectedValidatorActive = false;
    }

    this.count_nominators = selVal['details']['count_nominators'];

    const past = (selNetwork['era']['eraProcess'] / selNetwork['era']['eraLength']) * 100;
    this.updateEraProgress(past, 100 - past);

    this.validatorNetworkTokenPrice = selNetwork['price'];
    this.validatorNetworkIcon = selNetwork['icon'];

    this.updateSparkline(selNetwork['sparkline'], selNetwork['change']);

    this.updateWeeklyRewardList(selVal['weeklyRewardList'], selNetwork['price'], selNetwork['decimals']);

    await this.apiService.getValidatorRewardOverview(selVal.id).then((data: any) => {
      data = data['data'][0];
      console.log(data)
      this.validatorRewardOverview = {
        ticker: selNetwork['ticker'],
        allTime: {
          reward: this.calculateDecimals(data['allTime'], selNetwork['decimals']).toFixed(2),
          monetaryValue: selNetwork['price'] * this.calculateDecimals(data['allTime'], selNetwork['decimals'])
        },
        daily: {
          reward: this.calculateDecimals(data['daily'], selNetwork['decimals']).toFixed(2),
          monetaryValue: selNetwork['price'] * this.calculateDecimals(data['daily'], selNetwork['decimals'])
        },
        monthly: {
          reward: this.calculateDecimals(data['monthly'], selNetwork['decimals']).toFixed(2),
          monetaryValue: selNetwork['price'] * this.calculateDecimals(data['monthly'], selNetwork['decimals'])
        },
        weekly: {
          reward: this.calculateDecimals(data['weekly'], selNetwork['decimals']).toFixed(2),
          monetaryValue: selNetwork['price'] * this.calculateDecimals(data['weekly'], selNetwork['decimals'])
        }
      };
    });

    await this.apiService.getAllRewardsFromValidator(selVal.id).then((data: any) => {
      this.updateStashChart(data['data'], selNetwork['decimals']);
    });

    this.selectValEventList = [];

    for (let i = 0; i < this.eventList.length; i++) {
      if (this.eventList[i]['validatorId'] == selVal['id']) {
        this.selectValEventList.push(this.eventList[i]);
      }
    }

    this.updateNominatorChart(selVal['nominatorHistory']);


    this.updateMonthlyRewardList(selVal['monthlyRewardList'], selNetwork['price'], selNetwork['decimals']);

    this.fetch1kvData(valIndex);
  }

  public async fetch1kvData(valIndex: any) {
    this.thousandValData = null;

    const selValAddress = this.validatorList[valIndex - 1]['address'];
    const thousandValList = this.networkList[this.validatorList[valIndex - 1]['networkId'] - 1]['1kv'];

    for (let i = 0; i < thousandValList.length; i++) {
      const stash = thousandValList[i]['stash'];

      if (stash == selValAddress) {
        this.thousandValData = thousandValList[i]['validity'];
        break;
      }
    }
  }

  private async getDashboardData() {
    this.toastr.clear();
    this.toastr.info('Fetching dashboard data..', "Cyclops API", {
      positionClass: "toast-top-left"
    });


    //setup income pie
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

    //calculate combined rewards for bar chart and daily income

    const dailyRewards = new Array(7).fill(0); // Pre-fill daily rewards with zeros
    const monthlyRewards = new Array(12).fill(0); // Pre-fill monthly rewards with zeros

    for (const validator of this.validatorList) {
      const network = this.networkList.find((n: { id: any; }) => n.id === validator.networkId);

      if (!network) {
        console.warn(`Network not found for validator: ${validator.name}`);
        continue;
      }

      // Iterate through validator's weekly rewards (if available)
      if (validator.weeklyRewardList) {
        for (const item of validator.weeklyRewardList) {
          // Get the day as a number
          const dayIndex = this.setWeekdayIndex(item.weekday);
          dailyRewards[dayIndex] += network.price * this.calculateDecimals(item.total_amount, network.decimals);
        }
      }

      // Iterate through validator's monthly rewards (if available)
      if (validator.monthlyRewardList) {
        for (const item of validator.monthlyRewardList) {
          // Get the month as a number (assuming month is a property within the item)
          const dataMonth = parseInt(item.month, 10);

          // Ensure dataMonth is within the valid range (1-12)
          if (dataMonth < 1 || dataMonth > 12) {
            console.error("Invalid month provided in validator data:", item.month);
            continue; // Skip to the next item in the loop
          }

          // Update the specific month based on dataMonth (zero-based index)
          const monthIndex = dataMonth - 1;
          const reward = item.total_reward || 0;
          monthlyRewards[monthIndex] += network.price * this.calculateDecimals(reward, network.decimals);
        }
      }
    }

    // Update chart data sets
    this.dailyIncomeData.datasets.forEach(dataset => dataset.data = dailyRewards);
    this.monthlyIncomeData.datasets.forEach(dataset => dataset.data = monthlyRewards);

    // Update charts
    Chart.getChart("combinedDailyRewardChart")?.update();
    Chart.getChart("combinedMonthlyRewardChart")?.update();

    let dayNumber = this.setWeekdayIndex(new Date().getDay());
    this.totalRewardsToday = dailyRewards[dayNumber];

    await this.updateEventList();

    await this.getPoolList();

    this.toastr.clear();
  }

  private async updateEventList() {
    const eventList: any = await this.apiService.getAllEvents();
    this.eventList = eventList['data'];
  }

  public async getPoolList() {
    const poolList: any = await this.apiService.getPoolList();
    this.poolList = poolList['data'];
  }

  private updateStashChart(data: any, decimals: any) {
    data = data.reverse();
    let total: number = 0;

    let rewardArr: any = [];
    for (let i = 0; i < data.length; i++) {
      const amt = this.calculateDecimals(data[i]['amount'], decimals);
      rewardArr.push(amt + total);
      total += amt;
    }

    this.lineChartData.labels = this.createEmptyLabelList(rewardArr);
    this.lineChartData.datasets.forEach((dataset) => {
      dataset.data = rewardArr;
    });

    Chart.getChart("stashBalanceChart")?.update("normal");
  }

  private formatDate(timestamp: any) {
    const date = new Date(timestamp * 1000); // convert to milliseconds
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  }

  private updateNominatorChart(data: any) {
    let nominatorAmt: any = [];
    let labels = [];

    for (let i = 0; i < data.length; i++) {
      nominatorAmt.push(data[i]['nominationCount']);
      labels.push(this.formatDate(data[i]['timestamp']));
    }

    labels.reverse();
    nominatorAmt.reverse();

    this.nominatorChartData.labels = labels;
    this.nominatorChartData.datasets.forEach((dataset) => {
      dataset.data = nominatorAmt;
    });

    Chart.getChart("nominatorChart")?.update("normal");
  }

  private setWeekdayIndex(index: any) {
    return (index === 0) ? 6 : index - 1;
  }

  public async selectValidator(index: number) {
    if (index == 0) {
      await this.getDashboardData();
    } else {
      await this.getSelectedValidatorData(index);
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

  public getBondedTotal() {
    return this.bonded_total;
  }

  public getBondedOwner() {
    return this.bonded_owner;
  }

  public getBondedNominators() {
    return this.bonded_nominators;
  }

  public getNominatorCount() {
    return this.count_nominators;
  }

  public getIntegerOfTotalRewardsToday() {
    let totalRewards = (this.totalRewardsToday).toFixed(2);
    let parts = totalRewards.split('.');
    // If there's no decimal part, return directly
    if (parts.length !== 2) return "$" + this.addThousandSeperator(totalRewards);

    let integerPart = parts[0];
    return "$" + this.addThousandSeperator(integerPart);
  }

  public getDecimalOfTotalRewardsToday() {
    let totalRewards = (this.totalRewardsToday).toFixed(2);
    let parts = totalRewards.split('.');
    // If there's no decimal part, return an empty string
    if (parts.length !== 2) return "";

    let decimalPart = parts[1];
    return `${decimalPart}`;
  }

  private updateMonthlyRewardList(data: any, tokenPrice: any, decimals: any) {
    const combinedMonthlyRewards = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    for (const item of data) {
      // Get the month as a number (assuming month is a property within the item)
      const dataMonth = parseInt(item.month, 10);

      // Ensure dataMonth is within the valid range (1-12)
      if (dataMonth < 1 || dataMonth > 12) {
        console.error("Invalid month provided in data:", item.month);
        continue; // Skip to the next item in the loop
      }

      // Update the specific month based on dataMonth (zero-based index)
      const monthIndex = dataMonth - 1;
      let rewardObj = 0;
      if (item) {
        rewardObj = item['total_reward'];
      }
      combinedMonthlyRewards[monthIndex] += tokenPrice * this.calculateDecimals(rewardObj, decimals);
    }

    this.monthlyIncomeData.datasets.forEach((dataset) => {
      dataset.data = combinedMonthlyRewards;
    });

    Chart.getChart("combinedMonthlyRewardChart")?.update("normal");
  }


  private updateWeeklyRewardList(data: any, tokenPrice: any, decimals: any) {
    const weeklyRewardList = [0, 0, 0, 0, 0, 0, 0];

    for (let i = 0; i < data.length; i++) {
      const dayIndex = this.setWeekdayIndex(data[i]['weekday']);
      weeklyRewardList[dayIndex] = tokenPrice * this.calculateDecimals(data[i].total_amount, decimals);
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

    if (change <= 0) {
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
    if (data != null) {
      this.eraRewardPoints = data;

      this.eraChartData.labels = this.createEmptyLabelList(data);
      this.eraChartData.datasets.forEach((dataset) => {
        dataset.data = data;
      });

      Chart.getChart("eraPointChart")?.update("normal");
    }
  }

  public createEmptyLabelList(input: any) {
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
        '#fff',
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
      tension: 0,
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
      borderWidth: 2,
      pointRadius: 0,
      tension: 0,
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
    labels: [],
    datasets: [{
      data: [],
      borderWidth: 2,
      pointRadius: 0.0,
      tension: 0,
      gradient: {
        backgroundColor: {
          axis: 'y',
          colors: {
            0: 'rgba(59, 96, 216,.2)',
            10000: 'rgba(59, 96, 216,.6)'
          }
        },
        borderColor: {
          axis: 'x',
          colors: {
            1: '#3b60d8',
          }
        }
      },
      pointBorderColor: "white",
      fill: true,
    }],
  };

  public poolChartData: ChartData<'line', number[], string | string[]> = {
    labels: [],
    datasets: [{
      data: [],
      borderWidth: 2,
      pointRadius: 0.2,
      tension: 0,
      gradient: {
        backgroundColor: {
          axis: 'y',
          colors: {
            0: 'rgba(126, 32, 183,.2)',
            100000000: 'rgba(126, 32, 183,.6)'
          }
        },
        borderColor: {
          axis: 'x',
          colors: {
            1: 'rgba(126, 32, 183,1)',
          }
        }
      },
      pointBorderColor: "white",
      fill: true,
    }],
  };

  public nominatorChartData: ChartData<'line', number[], string | string[]> = {
    labels: [],
    datasets: [{
      data: [],
      borderWidth: 2,
      pointRadius: 0.2,
      tension: 0,
      gradient: {
        backgroundColor: {
          axis: 'y',
          colors: {
            0: 'rgba(14, 228, 216,.2)',
            10000: 'rgba(14, 228, 216,.6)'
          }
        },
        borderColor: {
          axis: 'x',
          colors: {
            1: 'rgba(14, 228, 216,1)',
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
        '#3d64e1',
        '#ebb362',
        '#b8acf6',
        '#e7ccee',
        '#dde0e6'
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
      minBarLength: 4,
      gradient: {
        backgroundColor: {
          axis: 'y',
          colors: {
            0: 'rgb(81, 126, 246, 0.5)',
            100: '#517ef6'
          }
        },
      },
    }]
  };

  public monthlyIncomeData: ChartData<'bar', number[], string | string[]> = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
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
            0: 'rgb(159, 116, 198, .5)',
            1000000: '#9f74c6'
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

  formatUnixTimestamp(timestamp: any) {
    const date = new Date(timestamp * 1000);
    const options: any = { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return date.toLocaleString('en-US', options);
  }
}
