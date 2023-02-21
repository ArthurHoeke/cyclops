import { Component, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartEvent, ChartType, ChartOptions, Chart } from 'chart.js';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {


  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

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
}
