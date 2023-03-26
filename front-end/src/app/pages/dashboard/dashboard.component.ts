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

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent {

  // ViewChild decorator that assigns BaseChartDirective to chart variable
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  constructor(public dashboardService: DashboardService, private coingeckoService: CoingeckoService, private storageService: StorageService, private router: Router, private authenticationService: AuthenticationService, private apiService: ApiService, private toastr: ToastrService) {
    Chart.register(gradient);

    dashboardService.updateDashboardData();
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

  //-------------------------
  // Overview functionality
  //-------------------------

  incomeChartType: ChartType = 'doughnut';
  dailyIncomeChartType: ChartType = 'bar';
  lineChartType: ChartType = 'line';

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


  public eraChartData: ChartData<'line', number[], string | string[]> = {
    labels: ['19:10', '19:15', '19:20', '19:25', '19:30', '19:35', '19:40'],
    datasets: [{
      data: [0, 20, 40, 80, 160, 240, 500],
      borderWidth: 2,
      pointRadius: 2,
      tension: 0.35,
      gradient: {
        backgroundColor: {
          axis: 'y',
          colors: {
            0: 'rgba(255,238,122,0)',
            10000: 'rgba(239,157,0,1)'
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

  public round(percentage: number) {
    return Math.round(percentage);
  }

  public logout() {
    this.storageService.clearAccessToken();
    this.router.navigate(['/']);
  }
}
