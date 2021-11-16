import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { FinanceReportingService } from 'src/app/shared/services/api/finance-reporting.services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-income-summary',
  templateUrl: './income-summary.component.html',
  styleUrls: ['./income-summary.component.scss']
})
export class IncomeSummaryComponent implements OnInit {
  @ViewChild('searchModal', { static: true }) searchModal: any;

  public reportData: any[] = [];

  public subscriptions: Subscription[] = [];

  constructor(
    public reportingService: FinanceReportingService
  ) { }

  ngOnInit(): void {
    this.fetchReportData();
  }

  fetchReportData(){
    const sub = this.reportingService.getIncomeSummary().subscribe((data: any[]) => {
      console.log(data);
    });

    this.subscriptions.push(sub);
  }


  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

}
