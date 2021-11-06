import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  constructor(
    
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
  }


  public weeklyBreakDownByMonth($event): void {
    console.log($event);
  }

  public getDefaultWeeklyBreakDown() {

  }

  public categoryBreakDownByMonth($event): void {
    console.log($event);
  }

  public trend(year: number): void {
  }

  public getTotalsByCategory(year: number): void {

  }

  public getCategoryBreakdwon(year: number, month: number): void {

  }

}
