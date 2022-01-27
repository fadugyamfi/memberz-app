import { Component, OnInit } from '@angular/core';
import { SmsAccountMessageService } from '../../../services/api/sms-account-message.service';
import * as chartData from '../../../data/chart/chartjs';
import { TranslateService } from '@ngx-translate/core';

interface MessagingStats {
  trend: Array<any>,
  total_broadcasts: number,
  total_messages: number
}

@Component({
  selector: 'app-sms-summary',
  templateUrl: './sms-summary.component.html',
  styleUrls: ['./sms-summary.component.scss']
})
export class SmsSummaryComponent implements OnInit {

  private monthObjLabels = chartData.monthObjLabels;
  public labels = [];
  private months = [];

  // lineGraph Chart
  public lineGraphOptions = chartData.lineGraphOptions;
  public lineGraphType = chartData.lineGraphType;
  public lineGraphColors = chartData.lineGraphColors;


  public chartData = [];
  public currencyCodes = [];
  public fetching = false;
  public yearValue: number = null;

  constructor(
    public messageService: SmsAccountMessageService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.searchByYear( new Date().getFullYear() );
  }

  loadSummary(year: number) {
    this.fetching = true;
    this.chartData = null;

    return this.messageService.summary({ year }).subscribe((data: MessagingStats) => {
      this.fetching = false;

      if( data.trend.length == 0 ) { return }

      this.labels = data.trend.map(record => `${this.monthObjLabels[record.month]}`);
      const dataset = data.trend.map(record => record.messages_sent);

      this.chartData = [{
        data: dataset,
        label: this.translate.instant('Messages Sent')
      }];

    });
  }

  hasDataAvailable() {
    return this.chartData && this.chartData.length > 0;
  }

  searchByYear(value: number) {
    if( this.fetching ) { return }

    this.yearValue = value;
    this.loadSummary( this.yearValue );
  }
}