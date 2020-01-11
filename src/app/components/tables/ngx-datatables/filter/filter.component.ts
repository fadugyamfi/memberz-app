import { Component, ViewChild } from '@angular/core';
import { DatatableComponent } from "@swimlane/ngx-datatable/release";
import { companyDB } from '../../../../shared/data/tables/company';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterNgxComponent {

  public company = [];

  public temp = [];

  public columns = [
    { prop: 'name' },
    { name: 'Company' },
    { name: 'Gender' }
  ];
  @ViewChild('DatatableComponent',{static: true}) table: DatatableComponent;

  constructor() {
    this.company = companyDB.data;
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.company = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

}
