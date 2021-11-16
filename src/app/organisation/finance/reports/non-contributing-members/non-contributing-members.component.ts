import { Component, OnInit } from '@angular/core';
import { FinanceReportingService } from 'src/app/shared/services/api/finance-reporting.services';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-non-contributing-members',
  templateUrl: './non-contributing-members.component.html',
  styleUrls: ['./non-contributing-members.component.scss']
})
export class NonContributingMembersComponent implements OnInit {

  public reportData: any[] = [];
  public subscriptions: Subscription[] = [];
  public yearValue: number = moment().year();

  constructor(
    public reportingService: FinanceReportingService
  ) { }

  ngOnInit(): void {
    this.fetchReportData();
  }

  fetchReportData(){
    const sub = this.reportingService.getNonContributingMembers(this.yearValue).subscribe((data: any[]) => {
      console.log(data);
    });

    this.subscriptions.push(sub);
  }


  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

}
