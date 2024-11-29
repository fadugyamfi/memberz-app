import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import * as chartData from '../../../shared/data/chart/chartjs';
import { OrganisationMemberService } from '../../../shared/services/api/organisation-member.service';
import { OrganisationService } from '../../../shared/services/api/organisation.service';

import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-membership-overview',
    templateUrl: './membership-overview.component.html',
    styleUrls: ['./membership-overview.component.scss'],
    standalone: true,
    imports: [NgChartsModule, TranslateModule]
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

  // Doughnut
  public doughnutChartLabels: string[] = [ 'Download Sales', 'In-Store Sales', 'Mail-Order Sales' ];
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: []
  };
  public doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right'
      }
    }
  };

  public doughnutChartType: ChartType = 'doughnut';
  public renderChart = false;

  constructor(
    public organisationMemberService: OrganisationMemberService,
    public organisationService: OrganisationService
  ) { }

  ngOnInit(): void {
    if (this.organisationService.getActiveOrganisation()) {
      this.organisationMemberService.statistics().subscribe(results => {
        this.membershipCategoriesData = results;

        const labels = this.membershipCategoriesData.map(item => item.name);
        const dataset = this.membershipCategoriesData.map(item => item.value);

        this.doughnutChartData.labels = labels;
        this.doughnutChartData.datasets.push({
          data: dataset,
          ...chartData.doughnutChartColors[0]
        });

        this.renderChart = true;
      });
    }
  }

}
