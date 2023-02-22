import { Component, ViewChild, Directive, Input, Output, EventEmitter } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartEvent, ChartType, ChartOptions, Chart } from 'chart.js';

import gradient from 'chartjs-plugin-gradient';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  constructor() {
    Chart.register(gradient);
  }

  //income pie chart

  public incomePieData: ChartData<'doughnut', number[], string | string[]> = {
    labels: ['Amsterdam', 'Dublin', 'Paris', 'Test'],
    datasets: [{
      data: [300, 500, 100],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
      ],
      borderAlign: 'center',
      borderRadius: 100,
      borderWidth: 0,
      spacing: 10
    }]
  };

  incomeChartType: ChartType = 'doughnut';

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

  //daily income chart

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
      borderWidth: 2,
      borderRadius: 5,
      // barPercentage: 0.5,
      barThickness: 30,
      maxBarThickness: 30,
      minBarLength: 2,
    }]
  };

  dailyIncomeChartType: ChartType = 'bar';

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

  //price chart
  public lineChartData: ChartData<'line', number[], string | string[]> = {
    labels: ['2/22', '2/23', '2/24', '2/25', '2/26', '2/27', '2/28'],
    datasets: [{
      data: [7, 6.5, 7.7, 8.12, 8.3, 8, 8.6],
      borderWidth: 2,
      pointRadius: 1,
      tension: 0.35,
      gradient: {
        backgroundColor: {
          axis: 'y',
          colors: {
            0: 'rgba(255,255,255,0)',
            50: 'rgba(255,255,255,.5)',
            100: 'rgba(255,255,255,1)'
          }
        },
        borderColor: {
          axis: 'x',
          colors: {
            1: 'rgba(255,255,255,1)',
          }
        }
      },
      pointBorderColor: "red",
      fill: true,
    }],
    
  };

  lineChartType: ChartType = 'line';

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
          display: false,
        }
      },
      x: {
        ticks: {
          display: false,
        }
      }
    } 
  }
}
