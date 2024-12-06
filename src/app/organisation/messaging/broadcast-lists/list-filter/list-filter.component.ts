import { Component, EventEmitter, OnInit, Output, input } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-list-filter',
    templateUrl: './list-filter.component.html',
    styleUrls: ['./list-filter.component.scss'],
    imports: [FormsModule, ReactiveFormsModule, TranslateModule]
})
export class ListFilterComponent implements OnInit {

  public selectedFilterField;
  readonly listFilters = input(undefined);
  readonly filterGroup = input(undefined);
  readonly optionalOnly = input(false);
  readonly filter = input(undefined);

  @Output() remove = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    const filter = this.filter();
    if( filter ) {
      this.setSelectedFilterField( filter.field );
    }
  }

  setSelectedFilterField(fieldId) {
    this.listFilters().forEach(group => {
      const selected = group.fields.find(filter => filter.id == fieldId);
      if( selected ) {
        this.selectedFilterField = selected;
      }
    });
  }

  showOptional() {
    return this.filterGroup().controls.optional?.value == this.optionalOnly() ? 1 : 0;
  }
}
