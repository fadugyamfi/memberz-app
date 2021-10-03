import { Component, OnInit, OnDestroy } from '@angular/core';
import * as chartData from '../../shared/data/widgets-chart/chart-widget';
import { monthlydoughnutData, dailydoughnutData } from '../../shared/data/widgets-chart/chart-widget';
import { OrganisationMemberService } from '../../shared/services/api/organisation-member.service';
import { OrganisationService } from '../../shared/services/api/organisation.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  public monthlydoughnutData = monthlydoughnutData;
  public dailydoughnutData = dailydoughnutData;

  public chart1 = chartData.chart1;
  public chart2 = chartData.chart2;
  public chart3 = chartData.chart3;

  public WidgetBarChart1 = chartData.WidgetBarChart1;
  public WidgetBarChart2 = chartData.WidgetBarChart2;

  public liveProductChart = chartData.liveProductChart;

  public turnOverChart = chartData.turnOverChart;
  public monthlyChart = chartData.monthlyChart;

  public usesChart = chartData.usesChart;
  public financeWidget = chartData.financeWidget;

  public orderStatusWidget = chartData.orderStatusWidget;
  public skillWidget = chartData.skillWidget;

  // Doughnut Chart (Monthlt visitor chart)
  public monthlydoughnutChartColorScheme = chartData.monthlydoughnutChartcolorScheme;
  public monthlydoughnutChartShowLabels = chartData.monthlydoughnutChartShowLabels;
  public monthlydoughnutChartGradient = chartData.monthlydoughnutChartGradient;

  // Doughnut Chart (Daily visitor chart)
  public dailydoughnutChartColorScheme = chartData.dailydoughnutChartcolorScheme;
  public dailydoughnutChartShowLabels = chartData.dailydoughnutChartShowLabels;
  public dailydoughnutChartGradient = chartData.dailydoughnutChartGradient;

  // Membership Categories chart
  public membershipCategoriesData;
  public categoryChartColorScheme = {
    domain: [
      '#9c3', '#099', '#39c', '#c33', '#609', '#319', '#444', '#ccc', '#909',
      '#303', '#980', '#490', '#19c', '#a09', '#b98', '#63f', '#f90', '#ae9', '#cfc'
    ]
  };

  constructor(
    public organisationMemberService: OrganisationMemberService,
    public organisationService: OrganisationService
  ) {
    Object.assign(this, { monthlydoughnutData, dailydoughnutData });
  }

  ngOnInit() {
    if ( this.organisationService.getActiveOrganisation() ) {
      this.organisationMemberService.statistics().subscribe(results => this.membershipCategoriesData = results);
    }
  }

  ngOnDestroy() {

  }

}
