import { Component, ViewChild, Directive, Input, Output, EventEmitter } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartType, Chart } from 'chart.js';

import { CoingeckoService } from 'src/app/services/coingecko/coingecko.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';

import { StorageService } from 'src/app/services/storage/storage.service';
import { ApiService } from 'src/app/services/api/api.service';
import { Router } from '@angular/router';

import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ToastrService } from 'ngx-toastr';

import gradient from 'chartjs-plugin-gradient';

// import { jsPDF } from 'jspdf-invoice-template';
import jsPDFInvoiceTemplate from "jspdf-invoice-template";
import jsPDF from 'jspdf';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent {

  // ViewChild decorator that assigns BaseChartDirective to chart variable
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  reportMonth: any = null;
  incomeReportData: any = null;

  incomeReportTokens: any = 0;
  incomeReportMonetary: any = 0;

  valName: any = '';

  constructor(public dashboardService: DashboardService, private coingeckoService: CoingeckoService, private storageService: StorageService, private router: Router, private authenticationService: AuthenticationService, private apiService: ApiService, private toastr: ToastrService) {
    Chart.register(gradient);

    dashboardService.updateDashboardData();
  }

  public async updateValidatorName() {
    await this.apiService.updateValidatorName(this.dashboardService.validatorList[this.dashboardService.getSelectedValidator() - 1]['id'], this.valName).then((data) => {
      this.toastr.success('Name updated!', "", {
        positionClass: "toast-top-left"
      });
      this.dashboardService.validatorList[this.dashboardService.getSelectedValidator() - 1]['name'] = this.valName;
    }).catch((err) => {
      this.toastr.error('Something went wrong.', "", {
        positionClass: "toast-top-left"
      });
    });
  }

  public async fetchValidatorName(network: any, elem: any, nameElem: any) {
    this.apiService.findValidatorNameByAddress(network.options[network.selectedIndex].text, elem.value).then((name: any) => {
      nameElem.value = JSON.parse(name)['data'];
    })
  }

  public async deleteValidator() {
    if(confirm("Are you sure you want to delete this validator?")) {

      await this.apiService.deleteAllRewards(this.dashboardService.validatorList[this.dashboardService.getSelectedValidator() - 1]['id']).then(async (data) => {
        await this.apiService.deleteValidator(this.dashboardService.validatorList[this.dashboardService.getSelectedValidator() - 1]['id']).then((data) => {
          this.toastr.success('Validator deleted.', "", {
            positionClass: "toast-top-left"
          });
          this.dashboardService.selectValidator(0);
          this.dashboardService.updateDashboardData();
        }).catch((err) => {
          this.toastr.error('Something went wrong.', "", {
            positionClass: "toast-top-left"
          });
        });
      }).catch((err) => {
        this.toastr.error('Something went wrong.', "", {
          positionClass: "toast-top-left"
        });
      });
    }
  }

  public truncateString(str: string, num: number) {
    if (str.length <= num) {
      return str
    }
    return str.slice(0, num) + '...'
  }

  public toggleModal(modal: HTMLDivElement) {
    if (modal.classList.contains("showModal")) {
      modal.classList.remove("showModal");
    } else {
      modal.classList.add("showModal");
    }
  }

  public async submitValidator(name: string, address: string, network: any, modal: HTMLDivElement) {
    if (name != "" && address != "" && network != "") {
      this.apiService.addValidator(name, address, network).then(async (data) => {
        this.toastr.warning("This may take a couple minutes", "Starting to sync..", {
          positionClass: "toast-top-left"
        });

        //update validator list
        await this.dashboardService.updateValidatorList();

        this.dashboardService.toggleSyncing();

        await this.apiService.syncValidator(this.dashboardService.validatorList[this.dashboardService.validatorList.length - 1].id).then((data) => {
          this.toastr.success('Validator synced!', "", {
            positionClass: "toast-top-left"
          });
          this.dashboardService.selectValidator(0);
        }).catch((err) => {
          this.toastr.error('Unable to sync validator.', "", {
            positionClass: "toast-top-left"
          });
        });

        this.toggleModal(modal);
        this.dashboardService.toggleSyncing();
      }).catch((err) => {
        this.toastr.error('Something went wrong.', "", {
          positionClass: "toast-top-left"
        });
      });
    } else {
      this.toastr.error('Fill in all fields.', "", {
        positionClass: "toast-top-left"
      });
    }
  }

  // Function used in HTML to check if 'active' CSS class can be added to panel button
  isActive(index: Number) {
    if (this.dashboardService.getSelectedValidator() == index) {
      return true;
    } else {
      return false;
    }
  }

  isAdmin() {
    return this.authenticationService.isAdmin();
  }

  onOverview() {
    if (this.isActive(0)) {
      return true;
    } else {
      return false;
    }
  }

  async fetchIncomeReportMonth() {
    //fetch rewards from API
    const selVal = this.dashboardService.validatorList[this.dashboardService.getSelectedValidator() - 1];
    const selNetwork = this.dashboardService.networkList[this.dashboardService.validatorList[this.dashboardService.getSelectedValidator() - 1]['networkId'] - 1];

    const date = new Date();
    const year = date.getFullYear();
    let month: any = this.reportMonth;
    if (month < 10) {
      month = '0' + month;
    }

    const report: any = await this.apiService.getMonthlyRewardReportFromValidator(selVal['id'], year + '-' + month);
    this.incomeReportData = report['data'];

    //calculate total tokens & USD value earned
    let sumTokens = 0;

    for (let i = 0; i < this.incomeReportData.length; i++) {
      sumTokens += this.incomeReportData[i]['amount'];
    }

    sumTokens = this.dashboardService.calculateDecimals(sumTokens, selNetwork['decimals']);

    this.incomeReportTokens = sumTokens.toFixed(2) + " " + selNetwork['ticker'].toUpperCase();
    this.incomeReportMonetary = (sumTokens * selNetwork['price']).toFixed(2);
  }

  GeneratePDF() {
    const selectedMonth = this.reportMonth;

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    const rewards = this.incomeReportData;
    let incomeList: any = [];

    const selVal = this.dashboardService.validatorList[this.dashboardService.getSelectedValidator() - 1];
    const selNetwork = this.dashboardService.networkList[this.dashboardService.validatorList[this.dashboardService.getSelectedValidator() - 1]['networkId'] - 1];

    let decimals = selNetwork['decimals'];
    let tokenPrice = selNetwork['price'];
    let name = selNetwork['ticker'];

    let totalEarnedTokens = 0;
    let totalEarnedMonetary = 0;

    for (let i = 0; i < rewards.length; i++) {
      const selReward = rewards[i];
      const date = (new Date(selReward['timestamp'] * 1000));

      const index: any = incomeList.length;
      incomeList[index] = [];
      incomeList[index][0] = index + 1;
      incomeList[index][1] = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
      incomeList[index][2] = (this.dashboardService.calculateDecimals(selReward.amount, decimals)).toFixed(2) + " " + name;
      incomeList[index][3] = "$" + ((this.dashboardService.calculateDecimals(selReward.amount, decimals)) * tokenPrice).toFixed(2);
      incomeList[index][4] = selReward.hash;

      totalEarnedTokens += this.dashboardService.calculateDecimals(selReward.amount, decimals);
      totalEarnedMonetary += (this.dashboardService.calculateDecimals(selReward.amount, decimals)) * tokenPrice;
    }

    const month = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

    var props: any = {
      outputType: "save",
      returnJsPDFDocObject: true,
      fileName: month[selectedMonth] + "-" + yyyy + "-" + selVal['address'],
      orientationLandscape: false,
      compress: true,

      business: {
        name: "Income report",
        address: "Service provided by Cyclops validator dashboard",
        phone: "generated on: " + dd + '/' + mm + '/' + yyyy
      },
      contact: {
        label: selVal['address'],
        name: selNetwork['name']
      },
      invoice: {
        invDate: "$" + tokenPrice + " per " + name,
        invGenDate: dd + '/' + mm + '/' + yyyy + " " + today.getHours() + ":" + today.getMinutes() + " " + Intl.DateTimeFormat().resolvedOptions().timeZone,
        headerBorder: true,
        tableBodyBorder: true,
        header: [
          {
            title: "#",
            style: {
              width: 10
            }
          },
          {
            title: "Date",
            style: {
              width: 30
            }
          },
          {
            title: "Reward",
            style: {
              width: 30
            }
          },
          {
            title: "Monetary value",
            style: {
              width: 30
            }
          },
          {
            title: "Extrinsic hash"
          }
        ],
        table: incomeList,
        additionalRows: [{
          col1: 'Total tokens:',
          col2: totalEarnedTokens.toFixed(2) + " " + name.toUpperCase(),
          style: {
            fontSize: 12
          }
        },
        {
          col1: 'USD value:',
          col2: '$' + this.dashboardService.addThousandSeperator(totalEarnedMonetary.toFixed(2)),
          style: {
            fontSize: 10
          }
        }],

        invDescLabel: "Note",
        invDesc: "Income report generated based on available data provided by subscan.io. Cyclops is not liable for any possible inaccuracies.",
      },
      footer: {
        text: "decentraDOT.com",
      },
      pageEnable: true,
      pageLabel: "Page ",
    };

    jsPDFInvoiceTemplate(props);
  }

  //-------------------------
  // Overview functionality
  //-------------------------

  incomeChartType: ChartType = 'doughnut';
  dailyIncomeChartType: ChartType = 'bar';
  lineChartType: ChartType = 'line';

  incomeChartOption: any = {
    cutout: '90%',
    radius: '80%',
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
        position: 'right',
      },
    }
  }

  dailyIncomeChartOption: any = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false
      },
    },
    scales: {
      y: {
        grid: {
          color: '#141318',
          display: true
        }
      },
      x: {
        grid: {
          color: '#141318',
          display: false
        }
      }
    }
  }

  //-------------------------
  // Validator functionality
  //-------------------------

  eraProgressChartType: ChartType = 'doughnut';

  eraProgressChartOption: any = {
    cutout: '90%',
    radius: '80%',
    circumference: 180,
    rotation: -90,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        position: 'right',
      },
    }
  }

  lineChartOptions: any = {
    responsive: false,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scaleShowLabels: false,
    scales: {
      y: {
        ticks: {
          display: true,
        },
        grid: {
          color: '#141318',
          display: true
        }
      },
      x: {
        ticks: {
          display: true,
        },
        grid: {
          color: '#141318',
          display: false
        }
      }
    }
  }

  tokenChartOptions: any = {
    responsive: false,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scaleShowLabels: false,
    scales: {
      y: {
        ticks: {
          display: true,
        },
        grid: {
          color: '#141318',
          display: true
        }
      },
      x: {
        ticks: {
          display: false,
        },
        grid: {
          color: '#141318',
          display: false
        }
      }
    }
  }

  eraChartOptions: any = {
    responsive: false,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scaleShowLabels: false,
    scales: {
      y: {
        ticks: {
          display: true,
        },
        grid: {
          color: '#141318',
          display: true
        }
      },
      x: {
        ticks: {
          display: true,
        },
        grid: {
          color: '#141318',
          display: false
        }
      }
    }
  }

  public roundTwoDigits(percentage: number) {
    if (percentage != undefined) {
      return percentage.toFixed(2);
    } else {
      return;
    }
  }

  isPositive(number: number) {
    if (number > 0.0) {
      return true;
    } else {
      return false;
    }
  }

  public logout() {
    this.storageService.clearAccessToken();
    this.router.navigate(['/']);
  }
}
