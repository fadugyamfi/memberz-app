import { Component, OnInit, input, output } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ListFilter } from '../../../../shared/services/utilities/list-filter.service';

@Component({
    selector: 'app-list-filter',
    templateUrl: './list-filter.component.html',
    styleUrls: ['./list-filter.component.scss'],
    imports: [FormsModule, ReactiveFormsModule, TranslateModule]
})
export class ListFilterComponent implements OnInit {

  public selectedFilterField;
  readonly listFilters = input<any>();
  readonly filterGroup = input<any>();
  readonly optionalOnly = input(false);
  readonly filter = input<ListFilter>();

  readonly remove = output();

  constructor() { }

  ngOnInit(): void {
    const filter = this.filter();
    if( filter ) {
      this.setSelectedFilterField( filter.field );
    }
  }

  setSelectedFilterField(fieldId) {
    this.listFilters()?.forEach(group => {
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
