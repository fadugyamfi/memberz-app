import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ContributionService } from 'src/app/shared/services/api/contribution.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-select-year-control',
  templateUrl: './select-year-control.component.html',
  styleUrls: ['./select-year-control.component.scss']
})
export class SelectYearControlComponent implements OnInit {

  @Output() selectedYearEvent = new EventEmitter();
  public years: any;
  public subscriptions: Subscription[] = [];

  constructor(public contributionService: ContributionService) { }

  ngOnInit() {
    this.findYears();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  findYears() {
    const sub = this.contributionService.getAvailableYears().subscribe(years => {
      this.years = years;
    });

    this.subscriptions.push(sub);
  }

  setValue($event) {
    this.selectedYearEvent.emit($event.target.value);
  }

}
