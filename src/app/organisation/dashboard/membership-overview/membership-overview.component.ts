import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective, Label, MultiDataSet } from 'ng2-charts';
import * as chartData from '../../../shared/data/widgets-chart/chart-widget';
import { OrganisationMemberService } from '../../../shared/services/api/organisation-member.service';
import { OrganisationService } from '../../../shared/services/api/organisation.service';

@Component({
  selector: 'app-membership-overview',
  templateUrl: './membership-overview.component.html',
  styleUrls: ['./membership-overview.component.scss']
})
export class MembershipOverviewComponent implements OnInit {

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  // Membership Categories chart
  public membershipCategoriesData;
  public categoryChartColorScheme = {
    domain: [
      '#303', '#980', '#490', '#19c', '#a09', '#b98', '#63f', '#f90', '#ae9', '#cfc',
      '#9c3', '#099', '#39c', '#c33', '#609', '#319', '#444', '#ccc', '#909',
    ]
  };

  public chartLabels: Label[] = [];
  public chartData: MultiDataSet = [];
  public chartType: ChartType = 'doughnut';
  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    legend: {
      display: true,
      position: 'right',
    }
  };
  public renderChart = false;

  constructor(
    public organisationMemberService: OrganisationMemberService,
    public organisationService: OrganisationService
  ) { }

  ngOnInit(): void {
    if (this.organisationService.getActiveOrganisation()) {
      this.organisationMemberService.statistics().subscribe(results => {
        this.membershipCategoriesData = results;

        this.chartLabels = this.membershipCategoriesData.map(item => item.name);
        const dataset = this.membershipCategoriesData.map(item => item.value);
        this.chartData = [dataset];
        this.renderChart = true;
      });
    }
  }

}
