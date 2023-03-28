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
    if(percentage != undefined) {
      return percentage.toFixed(2);
    } else {
      return;
    }
  }

  isPositive(number: number) {
    if(number > 0.0) {
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
