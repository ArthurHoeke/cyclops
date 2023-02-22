import { Component, ViewChild, Directive, Input, Output, EventEmitter } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartEvent, ChartType, ChartOptions, Chart } from 'chart.js';

import { CoingeckoService } from 'src/app/services/coingecko/coingecko.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';

import gradient from 'chartjs-plugin-gradient';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent {

  //// ViewChild decorator that assigns BaseChartDirective to chart variable
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  constructor(public dashboardService: DashboardService, private coingeckoService: CoingeckoService) {
    Chart.register(gradient);
  }

  // Function used in HTML to check if 'active' CSS class can be added to panel button
  isActive(index: Number) {
    if(this.dashboardService.getSelectedValidator() == index) {
      return true;
    } else {
      return false;
    }
  }

  onOverview() {
    if(this.isActive(0)) {
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

  public eraProgressData: ChartData<'doughnut', number[], string | string[]> = {
    labels: ['Past', 'Left'],
    datasets: [{
      data: [87, 13],
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
}
