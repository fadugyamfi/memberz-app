import { Component, OnInit } from '@angular/core';
import { FinanceReportingService } from 'src/app/shared/services/api/finance-reporting.services';
import { Subscription } from 'rxjs';
import { SelectYearControlComponent } from '../../../../shared/components/forms/select-year-control/select-year-control.component';
import { FormsModule } from '@angular/forms';

import { LoadingRotateDashedComponent } from '../../../../shared/components/forms/loading-rotate-dashed/loading-rotate-dashed.component';
import { NoDataAvailableComponent } from '../../../../shared/components/forms/no-data-available/no-data-available.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-non-contributing-members',
    templateUrl: './non-contributing-members.component.html',
    styleUrls: ['./non-contributing-members.component.scss'],
    standalone: true,
    imports: [SelectYearControlComponent, FormsModule, LoadingRotateDashedComponent, NoDataAvailableComponent, TranslateModule]
})
export class NonContributingMembersComponent implements OnInit {

  public reportData = [];
  public subscriptions: Subscription[] = [];
  public yearValue: number = new Date().getFullYear();
  public showData = false;

  constructor(
    public reportingService: FinanceReportingService
  ) { }

  ngOnInit(): void {
    this.fetchReportData(new Date().getFullYear());
  }

  fetchReportData(value : number){
    this.showData = false;
    this.yearValue = value ? value : new Date().getFullYear();
    const sub = this.reportingService.getNonContributingMembers(this.yearValue).subscribe((data: any[]) => {
      this.showData = true;
      this.reportData = data;
    });

    this.subscriptions.push(sub);
  }

  hasDataAvailable() {
    return this.reportData && this.reportData.length > 0;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

}
